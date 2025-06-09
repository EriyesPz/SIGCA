import { Router } from 'express';
import {
  login,
  register,
  sendPasswordResetOtp,
  resetPasswordWithOtp
} from './controllers/auth';
import {} from './middlewares/protected';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password/send-otp', sendPasswordResetOtp);
router.post('/forgot-password/reset', resetPasswordWithOtp);


export { router };
