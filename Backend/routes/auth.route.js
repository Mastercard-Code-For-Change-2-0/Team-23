import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import { userSignup, userLogin, userLogout, signInWithGoogle} from "../controllers/auth.controller.js";
import configurePassport from "../config/passport.config.js";
import passport from "passport";


//we need to configure passport first
configurePassport(passport);

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', verifyJWT, userLogout);

//sign in with google
router.get("/google",passport.authenticate("google",{scope : ["profile","email"]}));
router.get("/google/callback",passport.authenticate("google",{session : false}),signInWithGoogle);

export default router;