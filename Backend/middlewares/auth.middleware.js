import { validateToken } from '../services/auth.service.js';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';


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

        // Check if user is admin or regular user
        let user = await Admin.findById(payload.userId).select("-password");
        if (!user) {
            user = await User.findById(payload.userId).select("-password");
            if (user) {
                user.role = 'user'; // Add role property
            }
        } else {
            user.role = 'admin'; // Add role property
        }

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