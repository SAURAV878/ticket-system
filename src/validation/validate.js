import Joi from "joi";

export const singupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('Customer', 'Vendor', 'Admin').default('Customer'),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').default('Other'),
    
    // Validate the avatar as a URL
    avatar: Joi.string().uri().optional()
});

export const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});