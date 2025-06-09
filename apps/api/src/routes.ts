import { Router } from 'express';
import {
  requestOtp,
  login,
  register,
  sendPasswordResetOtp,
  resetPasswordWithOtp
} from './controllers/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password/send-otp', sendPasswordResetOtp);
router.post('/forgot-password/reset', resetPasswordWithOtp);


export { router };
