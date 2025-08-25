import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import passport from 'passport';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

import connectDB from './db/index.js';



//middlewares
app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser())

app.use(passport.initialize());


//Routes
import authRouter from './routes/auth.route.js';
import AdminEventRoutes from './routes/AdminEvent.route.js';

app.use('/api/v1/auth', authRouter);
app.use("/api/v1/Adminevents", AdminEventRoutes);


//error handling route
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server error');
});

//server start
connectDB().then(() =>{
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
    });
})



