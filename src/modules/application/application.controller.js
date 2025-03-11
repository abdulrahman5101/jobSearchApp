import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as applicationValidation from "./application.validation.js";
import * as applicationService from "./application.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import {
  cloudUpload,
  fileValidation,
} from "../../utils/file upload/multer-cloud.js";
import { roles } from "../../utils/enums.js";
const router = Router();
//apply job
router.post(
  "/apply/:jobId",
  isAuthenticated,
  isAuthorized(roles.USER),
  cloudUpload([...fileValidation.images, ...fileValidation.files]).single("cv"),
  isValid(applicationValidation.applyToJob),
  asyncHandler(applicationService.applyToJob)
);
//accept or reject app
router.post(
  "/accept-reject/:appId",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(applicationValidation.acceptOrReject),
  asyncHandler(applicationService.acceptOrReject)
);
export default router;
