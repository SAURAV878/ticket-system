import express from "express";
import { protect } from "../middleware/auth.js";
import { deleteMe, getMe, updateMe } from "../controller/userauth.js";
import { validate } from "../middleware/validate.js";
import { userSchema } from "../validation/uservalidation.js";

const router = express.Router();

router.use(protect);

router.get('/me',  getMe)

router.patch('/update', validate(userSchema), updateMe);
router.delete('/delete', deleteMe)

export default router;