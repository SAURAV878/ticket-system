import Joi from "joi";

export const userSchema = Joi.object({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    phoneNumber: Joi.string().min(10)
});