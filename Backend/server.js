import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import passport from 'passport';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

import connectDB from './db/index.js';
import AdminEventRoutes from "./routes/AdminEvents.route.js";

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


app.use('/api/v1/auth', authRouter);
app.use("/api/Adminevents", AdminEventRoutes);


//error handling route
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server error');
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server started on PORT:", 5000);
  });
});
