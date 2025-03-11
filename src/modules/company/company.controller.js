import { Router } from "express";
import * as companyService from "./company.service.js";
import * as companyValidation from "./company.validation.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../utils/enums.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  cloudUpload,
  fileValidation,
} from "../../utils/file upload/multer-cloud.js";
import { asyncHandler } from "../../utils/index.js";
import jobRouter from "../jobopportunity/jobopportunity.controller.js"
const router = Router();
router.use("/:companyId?/job",jobRouter)
//add company
router.post(
  "/",
  isAuthenticated,
  isAuthorized(roles.USER),
  cloudUpload(fileValidation.images).single("attachment"),
  isValid(companyValidation.addCompany),
  asyncHandler(companyService.addCompany)
);
//update company
router.patch(
  "/:companyId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(companyValidation.updateCompany),
  asyncHandler(companyService.updateCompany)
);
//delete company >>>soft delete
router.delete(
  "/:companyId",
  isAuthenticated,
  isAuthorized(roles.ADMIN, roles.USER),
  isValid(companyValidation.softDeleteCompany),
  asyncHandler(companyService.softDeleteCompany)
);
//get company by name
router.get(
  "/get-by-name",
  isAuthenticated,
  isAuthorized(roles.USER),
  asyncHandler(companyService.getCompanyByName)
);
// get specific company with jobs
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(companyValidation.getCompanyWithJobs),
  asyncHandler(companyService.getCompanyWithJobs)
);
//upload company logo
router.post(
  "/logo/:companyId",
  isAuthenticated,
  isAuthorized(roles.USER),
  cloudUpload(fileValidation.images).single("logo"),
  isValid(companyValidation.updateLogo),
  asyncHandler(companyService.updateLogo)
);
//upload company cover pic
router.post(
  "/cover-pic/:companyId",
  isAuthenticated,
  isAuthorized(roles.USER),
  cloudUpload(fileValidation.images).single("cover"),
  isValid(companyValidation.updateCoverPic),
  asyncHandler(companyService.updateCoverPic)
);
//delete company logo 
router.delete(
  "/logo/:companyId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(companyValidation.deleteLogo),
  asyncHandler(companyService.deleteLogo)
);
//delete company logo 
router.delete(
  "/cover-pic/:companyId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(companyValidation.deleteCoverPic),
  asyncHandler(companyService.deleteCoverPic)
);

export default router;
