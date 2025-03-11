import joi from "joi"
import { generalFields } from "../../middlewares/validation.middleware.js"
import { status } from "../../utils/enums.js"
export const applyToJob=joi.object({
    attachment:generalFields.attachment,
jobId:generalFields.id.required()
}).required()
export const acceptOrReject=joi.object({
    appId:generalFields.id.required(),
    status:joi.string().valid(...Object.values(status)).required()
}).required()