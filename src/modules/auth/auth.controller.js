import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
const router = Router();

//sign up
router.post(
  "/signup",
isValid(authValidation.signup),
  asyncHandler(authService.signup)
);
//send otp >>verification code for confirm email
router.post(
  "/send-otp",
  isValid(authValidation.sendOtp),
  asyncHandler(authService.sendOtp)
);
//confirm email
router.post(
  "/confirm-email",
  isValid(authValidation.confirmOtp),
  asyncHandler(authService.confirmOtp)
);
//login
router.post(
  "/login",
  asyncHandler(isValid(authValidation.login)),
  asyncHandler(authService.login)
);
//signup with google account
router.post(
  "/signup-with-google",
  isValid(authValidation.signupWithGoogle),
  asyncHandler(authService.signupWithGoogle)
);
//login with google account
router.post(
  "/login-with-google",
  isValid(authValidation.loginWithGoogle),
  asyncHandler(authService.loginWithGoogle)
);
//send otp password 
router.post(
  "/send-otp-password",
  isValid(authValidation.sendOtpPassword),
  asyncHandler(authService.sendOtpPassword)
);
//reset password
router.patch("/reset-password", isValid(authValidation.resetPassword),asyncHandler(authService.resetPassword)),
//refresh token
router.post(
  "/refresh-token",
  isValid(authValidation.refreshToken),
  authService.refreshToken
);

export default router;
