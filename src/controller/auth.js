import  Profile from "../model/profile.js";
import User from "../model/user.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import database from "../core/database.js";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../middleware/ratelimit.js"



export const signUp = catchAsync(async (req, res, next) => {

    const { email, password, role, firstName, lastName, phoneNumber, gender, avatar } = req.body;
 
    const existingUser = await User.findOne({ where : {email : req.body.email}}); 
    
    if(existingUser) {
        return next ( new AppError('Email with this user is alreadye exists', 400))
    }

    const transaction = await database.sequelize.transaction();

    if(role  === 'Admin') {
        return next (new AppError('You cannot register yourself as an admin', 403))
    }

    try {
        const newUser = await User.create({
            email,
            password,
            role: role || 'Customer'
        }, { transaction });

        await Profile.create({
            userId: newUser.id,
            firstName,
            lastName,
            phoneNumber,
            gender: gender || 'Other',
            avatar: avatar || `https://ui-avatars.com/api/?name=${req.body.firstName}+${req.body.lastName}&background=random`
        }, { transaction });

        await transaction.commit();

        res.status(201).json ({
            status: 'sucess',
            message: 'User created sucessfully',
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email
                }
            }
        });
    } catch (err) {
        await transaction.rollback();
        next(err);
    }
});


export const login = catchAsync(async (req, res, next) => {
        const { email, password} = req.body;

        const user = await  User.findOne({ where: {email}});

        const ispassword = await bcrypt.compare(password, user?.password || "");

        if(!user || !ispassword) {
            return next (new AppError('Incorrect email  or password',401))
        }

        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.status(200).json({
            status: 'sucess',
            message: "logged in sucessfully",
            token
        });
    });


export const logout = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return next(new AppError('You are not logged in!', 400));
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
        return next(new AppError('Invalid token', 400));
    }

    //Calculate remaining time (in seconds)
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    // Save token to Redis (Blacklist) if it's still valid
    if (timeLeft > 0) {
        await redisClient.setEx(`blacklist_${token}`, timeLeft, 'true');
    }

    res.status(200).json({ 
        status: 'success', 
        message: 'Logged out successfully' 
    });
});