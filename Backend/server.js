import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import passport from 'passport';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

import connectDB from './db/index.js';

//Mongo connection
connectDB();

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
import eventsRouter from './routes/events.route.js';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/events', eventsRouter);


//error handling route
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server error');
});

//server start
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
