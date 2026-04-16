import express from 'express';
import { register, login, logout, getProfile, updateProfile } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.post('/logout',   logout);
router.get('/profile',   protect, getProfile);
router.put('/profile',   protect, updateProfile);

export default router;