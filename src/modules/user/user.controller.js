import { Router } from "express";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { cloudUpload, fileValidation } from "../../utils/file upload/multer-cloud.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../utils/enums.js";
const router = Router();
//update logged user
router.patch(
  "/",
  isAuthenticated,
  isValid(userValidation.updateLoggedUser),
  asyncHandler(userService.updateLoggedUser)
);
//get logged user
router.get(
  "/",
  isAuthenticated,
  isAuthorized(roles.USER),
  asyncHandler(userService.getLoggedUser)
);
//get another user
router.get(
  "/profile/:id",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(userValidation.getUser),
  asyncHandler(userService.getUser)
);
//update password
router.patch(
  "/update-password",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(userValidation.updatePassword),
  asyncHandler(userService.updatePassword)
);
//upload profile pic
router.post(
  "/profile-pic",
  isAuthenticated,
  isAuthorized(roles.USER),
  cloudUpload(fileValidation.images).single("attachment"),
  isValid(userValidation.uploadProfilePic),
  asyncHandler(userService.uploadProfilePic)
);
//upload cover pic
router.post(
  "/cover-pic",
  isAuthenticated,
  isAuthorized(roles.USER),
  cloudUpload(fileValidation.images).single("attachment"),
  isValid(userValidation.uploadCoverPic),
  asyncHandler(userService.uploadCoverPic)
);
//delete profile pic
router.delete(
  "/profile-pic",
  isAuthenticated,
  isAuthorized(roles.USER),
  asyncHandler(userService.deleteProfilePic)
);
//delete cover pic
router.delete(
  "/cover-pic",
  isAuthenticated,
  isAuthorized(roles.USER),
  asyncHandler(userService.deleteCoverPic)
);

//soft delete>>freez account
router.delete(
  "/freez-account",
  isAuthenticated,
  asyncHandler(userService.freezAcc)
);

export default router;
