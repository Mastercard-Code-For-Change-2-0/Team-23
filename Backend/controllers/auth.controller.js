import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { createToken, validateToken, authenticateUser } from '../services/auth.service.js';


//signUp controller
const userSignup = async(req,res) =>{
    //check if data is empty
    if(!req.body){
        return res.status(400).json({
            error: "Body is required"
        });
    }

    const {username,email,password} = req.body;

    if([username,email,password].some((field) => field?.trim() === "")){
        return res.status(400).json({
            error: "All fields are compulsory"
        });
    }

    try{
        //check for existing user
        const existingUser = await User.findOne({
            $or : [{ username },{ email }]
        });

         if (existingUser) {
            return res.status(409).json({
                error: "User already exists"
            });
        } 

        //create new user
        const newUser = await User.create({
            username: username,
            email: email,
            password: password
        });
        
        const createdUser = await User.findById(newUser._id).select(
            "-password"
        );

        //check for created user
        if(!createdUser){
            return res.status(500).json({
                error: "Failed to create user"
            });
        }
        //return response
        return res.status(201).json({
            message: "User created successfully",
            user: createdUser
        });
    }
    catch(error){
        console.error("Error during user signup:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

//userLogin controller
const userLogin = async(req,res) =>{
    //check if body is empty
    if(!req.body){
        return res.status(400).json({
            error: "Body is required"
        });
    }

    const {email,password} = req.body;

    if(!email?.trim() || !password?.trim()){
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    try{
        
        const { success, message, user } = await authenticateUser(email, password);

        if(!success){
            return res.status(401).json({
                    error: message
            });
        }

        const token = createToken(user);

        if(!token){
            return res.status(500).json({
                error: "Failed to create token"
            });
        }

        const cookieOptions = {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 100 * 60 * 60 * 1000 // 1 day
        }

        res.cookie('token', token, cookieOptions);  

        return res
            .status(200)
            .json({
                message: "Login successful",
                user : user,
            })
            
    
    }
    catch(error){
        return res
        .status(500)
        .json({
            error: "User signIn unsuccessful!"
        });
    }
}


//User Logout controller

const userLogout = (req,res) =>{
    try{
        res.clearCookie('token');

        return res.status(200).json({
            message: "User logged out successfully!"
        });

    }catch(error){
        return res.status(500).json({
            message : "User logout unsuccessful!"
        })
    }
}


//google oauth
const signInWithGoogle = async (req, res) => {
  try {
    const user = req.user; // Comes from Passport Google OAuth strategy

    if (!user) {
      return res.redirect('http://localhost:5173/login?error=oauth_failed');
    }

    const token = createToken(user);

   
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,    // Set to true in production with HTTPS
      sameSite: "Lax",
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });

    // Redirect to frontend dashboard or callback page
    return res.redirect('http://localhost:5173/');
    
  }
   catch (err) {
    console.error("OAuth signup error:", err);
    return res.redirect('http://localhost:5173/login?error=oauth_failed');
  }

}


export { userSignup, userLogin, userLogout, signInWithGoogle };