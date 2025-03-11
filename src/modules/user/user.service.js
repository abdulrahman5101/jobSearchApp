import { User } from "../../db/models/user.model.js";
import cloudinary from "../../utils/file upload/cloud-config.js";
import { compare } from "../../utils/index.js";
import { mesaages } from "../../utils/messages/index.js";
import {
  deafulProfilePicSecureUrl,
  deafultProfilePicPublicId,
} from "../../utils/deafultValues.js";

export const updateLoggedUser = async (req, res, next) => {
  //get user exist from req
  const { firstName, lastName, DOB, mobileNumber, gender } = req.body;
  const userExist = req.userExist;
  if (mobileNumber) {
    userExist.mobileNumber = mobileNumber;
    await userExist.save();
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: userExist._id },
    { firstName, lastName, DOB, gender }
  );
  //send res
  return res
    .status(200)
    .json({ success: true, msg: mesaages.USER.updatedSuccessfully });
};
export const getLoggedUser = async (req, res, next) => {
  const user = await User.findOne({ _id: req.userExist._id });
  return res.status(200).json({ success: true, user });
};
export const getUser = async (req, res, next) => {
  //get data from request
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select(
    ` mobileNumber firstName lastName userName profilePic CoverPic`
  );
  //check user existance
  if (!user) {
    return next(new Error(mesaages.USER.notFound, { cause: 404 }));
  }
  //return res
  return res.status(200).json({ success: true, user });
};
export const updatePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  const matchPassword = compare({
    data: password,
    hashData: req.userExist.password,
  });
  if (!matchPassword) {
    return next(new Error("invalid password", { cause: 400 }));
  }
  req.userExist.password = newPassword;
  req.userExist.changeCredentialTime = new Date();
  await req.userExist.save();

  return res.status(200).json({
    success: true,
    msg: "password updated successfully please login ",
  });
};
export const uploadProfilePic = async (req, res, next) => {
  //delete the old profile pic
  // await cloudinary.uploader.destroy(req.userExist.profilePic.public_id)

  let options = {};
  if (req.userExist.profilePic.public_id == deafultProfilePicPublicId) {
    options.folder = `search-job-app/users/${req.userExist._id}/profile-pic`;
  } else {
    options.public_id = req.userExist.profilePic.public_id;
  }
  // upload file to cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    options
  );
  //update db
  const { profilePic } = await User.findByIdAndUpdate(
    req.userExist._id,
    {
      profilePic: {
        secure_url,
        public_id,
      },
    },
    { new: true }
  );
  return res.json({
    success: true,
    msg: mesaages.USER.profilePicUpdated,
    data: profilePic,
  });
};
export const uploadCoverPic = async (req, res, next) => {
  //delete the old cover pic

  if (req.userExist.coverPic.public_id) {
    await cloudinary.uploader.destroy(req.userExist.coverPic.public_id);
  }
  console.log(req.file.path);

  // upload file to cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `search-job-app/users/${req.userExist._id}/cover-pic`,
    }
  );
  //update db
  const { coverPic } = await User.findByIdAndUpdate(
    req.userExist._id,
    {
      coverPic: {
        secure_url,
        public_id,
      },
    },
    { new: true }
  );
  return res.json({
    success: true,
    msg: mesaages.USER.coverPicUpdated,
    data: coverPic,
  });
};
export const deleteProfilePic = async (req, res, next) => {
  //check profile pic exist
  if (req.userExist.profilePic.public_id == deafultProfilePicPublicId) {
    return next(new Error("there is no profile pic to delete"));
  }

  //delete from cloud
  await cloudinary.uploader.destroy(req.userExist.profilePic.public_id);
  //update db
  req.userExist.profilePic = {
    secure_url: deafulProfilePicSecureUrl,
    public_id: deafultProfilePicPublicId,
  };
  await req.userExist.save();

  return res
    .status(200)
    .json({ success: true, msg: mesaages.USER.profilePicDeleted });
};
export const deleteCoverPic = async (req, res, next) => {
  //check profile pic exist
  if (!req.userExist.coverPic.public_id) {
    return next(new Error("there is no cover pic to delete"));
  }

  //delete from cloud
  await cloudinary.uploader.destroy(req.userExist.coverPic.public_id);
  //update db
  req.userExist.coverPic = null;
  await req.userExist.save();

  return res
    .status(200)
    .json({ success: true, msg: mesaages.USER.coverPicDeleted });
};
export const freezAcc = async (req, res, next) => {
  const user = await User.findById(req.userExist._id);
  user.isDeleted=true;
  user.deletedAt=new Date()
  await user.save();
  return res
    .status(200)
    .json({ success: true, msg: mesaages.USER.deletedSuccessfully });
};
