import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
dotenv.config();
const secret = process.env.JWT_SECRET;

//create token utility
const createToken  = function(user){
    const payload = {
        userId : user._id,
        username: user.username,
        role: user.role || 'user' // Add role to token
    }
    const token = jwt.sign(payload,secret);

    console.log(token);
    return token;
}


//validate token utility
const validateToken = function(token) {
  console.log(token);
  const payload = jwt.verify(token, secret);
  return payload;
}

//authenticate user utility
const authenticateUser = async (email, password) => {

  try{
    // Check if it's an admin first
    let foundUser = await Admin.findOne({ email: email });
    let isAdmin = false;
    
    if (foundUser) {
      isAdmin = true;
    } else {
      // If not admin, check regular users
      foundUser = await User.findOne({ email: email });
    }

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
    //return user
    return {
      success : true,
      user : {
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        role: isAdmin ? 'admin' : 'user'
      }
    };

  }
  catch(error){
    console.error("Authentication error:", error);
    return { success: false, message: "Authentication failed" };
  }
}

export { createToken, validateToken, authenticateUser};
