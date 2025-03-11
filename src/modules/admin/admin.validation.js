import joi from "joi"
import { generalFields } from "../../middlewares/validation.middleware.js"
export const banOrUnbannedUser=joi.object({
    userId:generalFields.id.required(),
}).required()
export const banOrUnbannedCompany=joi.object({
    companyId:generalFields.id.required(),
}).required()
export const approveCompany=joi.object({
    companyId:generalFields.id.required(),
}).required()