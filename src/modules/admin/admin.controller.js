import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import * as adminService from "./admin.service.js";
import { endpoint } from "./admin.endpoint.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as adminValidation from "./admin.validation.js";
const router = Router();
router.use(isAuthenticated, isAuthorized(...endpoint.adminDashBoard));
// Ban or unbanned specific user
router.post(
  "/user/ban-unbanned/:userId",
  isValid(adminValidation.banOrUnbannedUser),
  asyncHandler(adminService.banOrUnbannedUser)
);
// Ban or unbanned specific company
router.post(
  "/company/ban-unbanned/:companyId",
  isValid(adminValidation.banOrUnbannedCompany),
  asyncHandler(adminService.banOrUnbannedCompany)
);
//approve company
router.post(
  "/company/approve/:companyId",
  isValid(adminValidation.approveCompany),
  asyncHandler(adminService.approveCompany)
);
export default router;
