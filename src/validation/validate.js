import Joi from "joi";

export const singupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('Customer', 'Vendor', 'Admin').default('Customer')
});

export const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});