import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken';
import {User , Profile} from "../model/index.js"
import redisClient from "./ratelimit.js";


export const protect = catchAsync(async (req, res, next) => {
    let token;

    if(req.headers.authorization  && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next ( new AppError('You are not logged in', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if(isBlacklisted) {
        return next (new AppError('Token has been invalidated.Please login again', 401));
    }

    const currentUser = await User.findByPk(decoded.id, {
        include: [{
            model: Profile, as: 'profile'
        }]
    });

    if(!currentUser) {
        return next (new AppError('User no longer exists', 401));
    }

    req.user = currentUser;
    next();
    
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to perform this action', 403));
        }
        next();
    };
};