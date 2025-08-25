import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
dotenv.config();
const secret = process.env.JWT_SECRET || 'fallback-secret-key';

//create token utility
const createToken = function(user){
    const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });

    console.log("Token created for user:", user.username);
    return token;
}

//validate token utility
const validateToken = function(token) {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

//authenticate user utility
const authenticateUser = async (email, password) => {
  try{
    //find user
    const foundUser = await User.findOne({ email: email })

    if(!foundUser){
      return { success : false, message: "User not found" }
    }

    //validate password
    const isPasswordValid = await foundUser.comparePassword(password);

    if(!isPasswordValid){
      return { 
        success: false, 
        message: "Invalid password"  
      }
    }

    //return user with role
    return {
      success : true,
      user : {
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        profile: foundUser.profile
      }
    };

  }
  catch(error){
    console.error("Authentication error:", error);
    return { success: false, message: "Authentication failed" };
  }
}

export { createToken, validateToken, authenticateUser};
