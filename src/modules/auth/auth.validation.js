import joi from "joi";
import { gender, otpTypes } from "../../utils/enums.js";
export let signup = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    mobileNumber: joi.string().length(11).required(),
    DOB: joi
      .string()
      .max(new Date().setFullYear(new Date().getFullYear() - 18))
      .required(),
    gender: joi
      .string()
      .valid(...Object.values(gender)).required()
      ,
    otp: joi.array().items({
      code: joi.string().required(),
      type: joi
        .string()
        .required()
        .valid(...Object.values(otpTypes)),
      expiresIn: joi.date().required(),
    }),
  })
  .required();
export let confirmOtp = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
  })
  .required();
export const sendOtp = joi.object({
  email: joi.string().email().required(),
});
export const sendOtpPassword = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();
export const loginOtp = joi
  .object({
    email: joi.string().required().email(),
    otp: joi.string().required(),
  })
  .required();

export let login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();
export const signupWithGoogle = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();
export const loginWithGoogle = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();

export const resetPassword = joi
  .object({
    otp: joi.string().required(),
    email: joi.string().required().email(),
    newPassword: joi.string().required(),
  })
  .required();
export const refreshToken = joi.object({
  refreshToken: joi.string().required(),
});
