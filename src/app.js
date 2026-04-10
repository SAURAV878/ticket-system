import express from 'express';
import errorHandler from './middleware/errorhandler.js';
import AppError from './utils/appError.js';

const app = express();

app.use(express.json());

app.all('*splat', (req, res, next)=> {
    return next (new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;