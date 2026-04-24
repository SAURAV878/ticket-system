import express from 'express';
import errorHandler from './middleware/errorhandler.js';
import AppError from './utils/appError.js';
import signRoute from './route/auth.js';
import loginRoute from './route/auth.js';
import userRoute from './route/user.js';
import logoutRoute from './route/auth.js'

const app = express();

app.use(express.json());

app.use('/api/v1/auth', signRoute);
app.use('/api/v1/auth', loginRoute);
app.use('/api/v1/logout', logoutRoute);
app.use('/api/v2/auth', userRoute);

app.all('*splat', (req, res, next)=> {
    return next (new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});



app.use(errorHandler);

export default app;