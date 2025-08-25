import { validateToken } from '../services/auth.service.js';
import User from '../models/user.model.js';


//verify JWT middleware
const verifyJWT = async (req,res,next) =>{
    const token = req.cookies?.token;

    if(!token) return res.status(401).json({
        error: "token not found"
    })

    console.log(token);
    try{
        const payload = validateToken(token);

        if(!payload && !payload.userId) return res.status(401).json({
            message: "No payload found",
            error:"No payload found"
        })

        console.log("Payload in middleware:", payload);

    const user = await User.findById(payload.userId).select("-password");

        if(!user){
            return res.status(401).json({
                message: "User not found",
                error: "User not found"
            });
        }

        req.user = user;
        next();
    }
    catch(error){
        console.error("Token validation error:", error);
        return res.status(401).json({
            message: "Invalid token",
            error: "Invalid token"
        })
    }
    

}

export default verifyJWT;