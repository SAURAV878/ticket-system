import express  from "express";
import { validate } from "../middleware/validate.js";
import { loginValidate, singupSchema } from "../validation/validate.js";
import { login, signUp } from "../controller/auth.js";
import {authLimiter} from "../middleware/ratelimit.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

router.post('/signup', validate(singupSchema), authLimiter, signUp);

router.post('/login', validate(loginValidate), authLimiter, login);

export default router;