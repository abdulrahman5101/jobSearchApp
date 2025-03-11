import joi from "joi";
import { jobLocation, seniorityLevel, workingTime } from "../../utils/enums.js";
import { generalFields } from "../../middlewares/validation.middleware.js";
export const addJob = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi
      .string()
      .valid(...Object.values(jobLocation))
      .required(),
    workingTime: joi
      .string()
      .valid(...Object.values(workingTime))
      .required(),
    seniorityLevel: joi
      .string()
      .valid(...Object.values(seniorityLevel))
      .required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.string().required(),
    softSkills: joi.string().required(),
    companyId: generalFields.id.required(),
  })
  .required();

export const updateJob = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid(...Object.values(jobLocation)),
    workingTime: joi.string().valid(...Object.values(workingTime)),
    seniorityLevel: joi.string().valid(...Object.values(seniorityLevel)),
    jobDescription: joi.string(),
    technicalSkills: joi.string(),
    softSkills: joi.string(),
    jobId: generalFields.id.required(),
  })
  .required();
export const deleteJob = joi
  .object({
    jobId: generalFields.id.required(),
  })
  .required();
export const getAllOrSpecificjob = joi
  .object({
    companyId: generalFields.id,
    jobId: generalFields.id,
    skip: joi.number(),
    limit: joi.number(),
    sort:joi.string(),
    companyName: joi.string(),
  })
  .required();
export const getWithFilter = joi
  .object({
    workingTime:joi.string().valid(...Object.values(workingTime)),
    jobLocation:joi.string().valid(...Object.values(jobLocation)),
    seniorityLevel:joi.string().valid(...Object.values(seniorityLevel)),
    jobTitle:joi.string(),
    technicalSkills:joi.string(),
  })
  .required();
  export const getAppsForJob = joi
  .object({
    jobId: generalFields.id,
    skip: joi.number(),
    limit: joi.number(),
    sort:joi.string()
  })
  .required();