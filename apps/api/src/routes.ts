import { Router } from 'express';
import {
  login,
  register,
  sendPasswordResetOtp,
  resetPasswordWithOtp,
} from './controllers/auth';
import { getLocations, getLocationsWarehouse } from "./controllers/locations";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password/send-otp', sendPasswordResetOtp);
router.post('/forgot-password/reset', resetPasswordWithOtp);
router.get('/locations', getLocations);
router.get('/locations/:warehouse', getLocationsWarehouse)

export { router };
