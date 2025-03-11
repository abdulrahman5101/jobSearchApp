import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";

export const addCompany = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.valid(
      "1-10",
      "11-20",
      "21-50",
      "51-100",
      "101-200",
      "201-500"
    ).required(),
    companyEmail: joi.string().email().required(),
    attachment: generalFields.attachment,
    HRs: joi.array().items(generalFields.id.required()).required(),
  })
  .required();
export const updateCompany = joi
  .object({
    companyName: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.number().min(11).max(20),
    companyEmail: joi.string().email(),
    HRs: joi.array().items(generalFields.id.required()),
    companyId: generalFields.id.required(),
  })
  .required();
export const softDeleteCompany = joi
  .object({
    companyId: generalFields.id.required(),
  })
  .required();
export const getCompanyWithJobs = joi
  .object({
    id: generalFields.id.required(),
  })
  .required();

export const getCompanyByname = joi
  .object({
    companyName: joi.string().required(),
  })
  .required();
export const updateLogo = joi
  .object({
    attachment: generalFields.attachment,
    companyId: generalFields.id.required(),
  })
  .required();
export const updateCoverPic = joi
  .object({
    attachment: generalFields.attachment,
    companyId: generalFields.id.required(),
  })
  .required();
export const deleteLogo = joi.object({
  companyId: generalFields.id.required(),
});
export const deleteCoverPic = joi.object({
  companyId: generalFields.id.required(),
});
