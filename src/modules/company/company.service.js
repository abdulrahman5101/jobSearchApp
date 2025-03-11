import mongoose, { Types } from "mongoose";
import { Company } from "../../db/models/company.model.js";
import cloudinary from "../../utils/file upload/cloud-config.js";
import { mesaages } from "../../utils/messages/index.js";
import { roles } from "../../utils/enums.js";

export const addCompany = async (req, res, next) => {
  //get data from req
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    HRs,
  } = req.body;
  //check company existance
  const companyExist = await Company.findOne({
    $or: [{ companyEmail, companyName }],
  });
  if (companyExist) {
    return next(new Error(mesaages.COMPANY.alreadyExist, { cause: 400 }));
  }
  //upload file to cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `search-job-app/companies/${companyName}/legal-attachment`,
    }
  );

  //create company >>db
  const company = new Company({
    companyName,
    description,
    companyEmail,
    industry,
    address,
    numberOfEmployees,
    createdBy: req.userExist._id,
    legalAttachment: {
      secure_url,
      public_id,
    },
    createdAt: new Date(),
    HRs,
  });

  await company.save();
  return res.status(201).json({
    success: true,
    msg: mesaages.COMPANY.createdSuccessfully,
  });
};
export const updateCompany = async (req, res, next) => {
  //get data from from req
  const { companyId } = req.params;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    HRs,
  } = req.body;
  //check owner of the company
  const company = await Company.findOne({
    createdBy: req.userExist._id,
    _id: companyId,
  });
  if (!company||company.isDeleted==true) {
    return next(new Error(mesaages.COMPANY.notTheOwner, { cause: 401 }));
  }

  await company.updateOne({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  });
  if (HRs) {
    company.HRs.push(...HRs);
  }

  await company.save();
  return res.status(200).json({
    success: true,
    msg: mesaages.COMPANY.updatedSuccessfully,
  });
};
export const softDeleteCompany = async (req, res, next) => {
  //get data from request
  const { companyId } = req.params;
  //check owner of the company
  const company = await Company.findOne({
    _id: companyId,
  });

  if (!company) {
    return next(new Error(mesaages.COMPANY.notFound, { cause: 404 }));
  }
  if (
    company.createdBy.toString() != req.userExist._id.toString() &&
    req.userExist.role != roles.ADMIN
  ) {
    return next(new Error(mesaages.COMPANY.notTheOwner, { cause: 401 }));
  }

  //update db
  (company.isDeleted = true), (company.deletedAt = new Date());
  //save updates
  await company.save();
  //send response
  return res.status(200).json({
    success: true,
    msg: mesaages.COMPANY.deletedSuccessfully,
  });
};
export const getCompanyWithJobs = async (req, res, next) => {
  //get data from req
  const { id } = req.params;

  const company = await Company.findOne({
    _id: id,
  }).populate({
    path: "jobs",
    match: {
      companyId: id,
    },
  });
  if (!company) {
    return next(new Error(mesaages.COMPANY.notFound, { cause: 404 }));
  }
  return res.status(200).json({
    success: true,
    data: company,
  });
};
export const getCompanyByName = async (req, res, next) => {
  //get data from req
  const { companyName } = req.body;
  const company = await Company.findOne({
    companyName,
  });
  //check company existance
  if (!company||company.isDeleted==true) {
    return next(new Error(mesaages.COMPANY.notFound));
  }

  return res.status(200).json({
    success: true,
    data: company,
  });
};
export const updateLogo = async (req, res, next) => {
  //get data from req
  const { companyId } = req.params;
  //check company existance
  const company = await Company.findById(companyId);
  if (!company||company.isDeleted==true) {
    return next(new Error(mesaages.COMPANY.notFound, { cause: 404 }));
  }
  if (
    company.createdBy.toString() != req.userExist._id.toString() &&
    !company.HRs.includes(req.userExist._id)
  ) {
    return next(new Error("not allowed !",{cause:401}))
  }
  //delete the old logo pic

  if (company.Logo.public_id) {
    await cloudinary.uploader.destroy(company.Logo.public_id);
  }

  // upload file to cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `search-job-app/companies/${company.companyName}/logo`,
    }
  );
  //update db
  await company.updateOne({
    Logo: {
      secure_url,
      public_id,
    },
  });
  await company.save();
  return res.json({
    success: true,
    msg: "logo updated successfully",
    data: company,
  });
};
export const updateCoverPic = async (req, res, next) => {
  //get data from req
  const { companyId } = req.params;
  //check company existance
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error(mesaages.COMPANY.notFound, { cause: 404 }));
  }
  if (
    company.createdBy.toString() != req.userExist._id &&
    !company.HRs.includes(req.userExist._id)
  ) {
    return next(new Error("not allowed !",{cause:401}))
  }
  //delete the old logo pic

  if (company.coverPic.public_id) {
    await cloudinary.uploader.destroy(company.coverPic.public_id);
  }

  // upload file to cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `search-job-app/companies/${company.companyName}/cover-pic`,
    }
  );
  //update db
  await company.updateOne({
    coverPic: {
      secure_url,
      public_id,
    },
  });
  await company.save();
  return res.json({
    success: true,
    msg: "cover pic updated successfully",
    data: company,
  });
};
export const deleteLogo = async (req, res, next) => {
  // get data from req
  const { companyId } = req.params;
  //check company existance
  const company = await Company.findById(companyId);
  if (!company||company.isDeleted==true) {
    return next(new Error(mesaages.COMPANY.notFound));
  }
  if (
    company.createdBy.toString() != req.userExist._id &&
    !company.HRs.includes(req.userExist._id)
  ) {
    return next(new Error("not allowed !",{cause:401}))
  }

  //check cover pic exist
  if (!company.Logo.public_id) {
    return next(new Error("there is no logo pic to delete"));
  }

  //delete from cloud
  await cloudinary.uploader.destroy(company.Logo.public_id);
  //update db
  company.Logo = null;
  await company.save();

  return res
    .status(200)
    .json({ success: true, msg: "logo pic deleted successfully" });
};
export const deleteCoverPic = async (req, res, next) => {
  // get data from req
  const { companyId } = req.params;
  //check company existance
  const company = await Company.findById(companyId);
  if (!company||company.isDeleted==true) {
    return next(new Error(mesaages.COMPANY.notFound));
  }
  if (
    company.createdBy.toString() != req.userExist._id &&
    !company.HRs.includes(req.userExist._id)
  ) {
    return next(new Error("not allowed !",{cause:401}))
  }
  //check cover pic exist
  if (!company.coverPic.public_id) {
    return next(new Error("there is no cover pic to delete"));
  }

  //delete from cloud
  await cloudinary.uploader.destroy(company.coverPic.public_id);
  //update db
  company.coverPic = null;
  await company.save();

  return res
    .status(200)
    .json({ success: true, msg: "cover pic deleted successfully" });
};
