import Profile from "../model/profile.js";
import User from "../model/user.js";
import catchAsync from "../utils/catchAsync.js";

export const getMe = catchAsync(async(req, res, next) => {

    const userData = req.user.toJSON();
    delete userData.password;

    res.status(200).json({
        status: 'sucess',
        data: {
            user: userData
        }
    });
}) 


export const updateMe = catchAsync(async(req , res, next) => {
    const {firstName,lastName, phoneNumber} = req.body;

    await Profile.update({
        firstName, lastName, phoneNumber
    }, { where: {id: req.user.profile.id}});

    res.status(200).json({
        status: 'success',
        message: 'Profile updated sucessfully'
    });
});

export const deleteMe = catchAsync(async(req, res, next) => {
    await User.destroy({where: {id: req.user.id}});

    res.status(204).json({
        status: 'sucess',
        data: null
    })

})