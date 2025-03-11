import joi from "joi";
import {
  generalFields,
  isValidId,
} from "../../middlewares/validation.middleware.js";
import { gender } from "../../utils/enums.js";
export const updateLoggedUser = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    gender: joi.string().valid(...Object.values(gender)),
    email: joi.string().email(),
    DOB: joi
      .string()
      .max(new Date().setFullYear(new Date().getFullYear() - 18)),
    mobileNumber: joi.string().length(11),
  })
  .required();
export const getUser = joi
  .object({
    id: generalFields.id.required(),
  })
  .required();
export const updatePassword = joi
  .object({
    password: joi.string().required(),
    newPassword: joi.string().required(),
  })
  .required();
  export const uploadProfilePic=joi.object({
    attachment:generalFields.attachment
  }).required()
  export const uploadCoverPic=joi.object({
    attachment:generalFields.attachment
  }).required()
export const otp = joi
  .object({
    otp: joi.string().required(),
  })
  .required();
export const blockUser = joi
  .object({
    userId: joi.custom(isValidId),
    email: joi.string().email(),
  })
  .required();
export const addFriendReq = joi
  .object({
    id: generalFields.id.required(),
  })
  .required();
