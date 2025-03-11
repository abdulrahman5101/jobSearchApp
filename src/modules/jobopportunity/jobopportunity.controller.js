import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../utils/enums.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as jobValidation from "./jobopportunity.validation.js";
import * as jobService from "./jobopportunity.service.js";
import { asyncHandler } from "../../utils/index.js";
const router = Router({ mergeParams: true });
//add job
router.post(
  "/:companyId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(jobValidation.addJob),
  asyncHandler(jobService.addJob)
);
//update job
router.patch(
  "/:jobId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(jobValidation.updateJob),
  asyncHandler(jobService.updateJob)
);
//delete job
router.delete(
  "/:jobId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(jobValidation.deleteJob),
  asyncHandler(jobService.deleteJob)
);
// get with filter
router.get(
  "/filter",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(jobValidation.getWithFilter),
  asyncHandler(jobService.getWithFilter)
);

//get all or specific
router.get(
  "/:jobId?",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(jobValidation.getAllOrSpecificjob),
  asyncHandler(jobService.getAllOrSpecificjob)
);
//get all app for job
router.get(
  "/job-with-apps/:jobId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(jobValidation.getAppsForJob),
  asyncHandler(jobService.getAppsForJob)
);

export default router;
