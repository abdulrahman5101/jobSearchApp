import { Application } from "../../db/models/application.model.js";
import { Company } from "../../db/models/company.model.js";
import { JobOpportunity } from "../../db/models/jobopportunity.model.js";
import { mesaages } from "../../utils/messages/index.js";

export const addJob = async (req, res, next) => {
  //get data from req
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { companyId } = req.params;
  //check company existance
  const company = await Company.findById(companyId);

  if (!company||company.isDeleted==true) {
    return next(new Error(mesaages.COMPANY.notFound));
  }
  //check company if user exist in  hrs
  const isHr = company.HRs.includes(req.userExist._id);
  if (!isHr&&company.createdBy.toString()!=req.userExist._id) {
    return next(new Error("not allowed!", { cause: 401 }));
  }
  if (!company.approvedByAdmin) {
    return next(new Error(mesaages.COMPANY.notApproved,{cause:400}))
    
  }

  const job = new JobOpportunity({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.userExist._id,
    companyId,
  });
  await job.save();
  return res.status(201).json({
    success: true,
    msg: mesaages.JOB.createdSuccessfully,
  });
};
export const updateJob = async (req, res, next) => {
  //get data from from req
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { jobId } = req.params;

  //check owner of the comapny
  const job = await JobOpportunity.findById(jobId);
  if (!job||job.isDeleted==true) {
    return next(new Error(mesaages.JOB.notFound, { cause: 404 }));
  }

  if (job.addedBy.toString() != req.userExist._id.toString()) {
    return next(new Error(mesaages.JOB.notTheOwner, { cause: 404 }));
  }

  await job.updateOne({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  });

  await job.save();
  return res.status(200).json({
    success: true,
    msg: mesaages.JOB.updatedSuccessfully,
  });
};
export const deleteJob = async (req, res, next) => {
  //get data from req
  const { jobId } = req.params;
  const job = await JobOpportunity.findById(jobId);
  //check job existance
  if (!job||job.isDeleted==true) {
    return next(new Error(mesaages.JOB.notFound));
  }
  const company = await Company.findById(job.companyId);
  //check if user hr
  const isHr = company.HRs.includes(req.userExist._id);
  if (!isHr) {
    return next(new Error("not allowed !", { cause: 401 }));
  }
  //delete from db
  job.isDeleted = true;
  //update db
  await job.save();

  //send response
  return res.status(200).json({
    success: true,
    msg: mesaages.JOB.deletedSuccessfully,
  });
};
export const getAllOrSpecificjob = async (req, res, next) => {
  //get data from req
  const { companyName } = req.body;
  const { companyId, jobId } = req.params;
  let { size, limit, sort = "createdAt" } = req.query;
  const query = { isDeleted: false };
  //get specific job
  if (jobId) {
    query._id = jobId;
  }
  if (companyId) {
    query.companyId = companyId;
  }
  if (companyName) {
    const company = await Company.findOne({
      companyName,
    });
    //check company existance
    if (!company||company.isDeleted==true) {
      return next(new Error(mesaages.COMPANY.notFound, { cause: 404 }));
    }
    query.companyId = company._id;
  }
  // search for jobs
  if (!size) size = 10;
  if (!limit) limit = 1;
  if (!sort) sort = "createdAt";
  const totalJob = await JobOpportunity.find(query).countDocuments();
  const totalPages = Math.ceil(totalJob / size);
  const currentPage = parseInt(limit);
  const skip = size * (limit - 1);

  const jobs = await JobOpportunity.find(query)
    .skip(skip)
    .limit(size)
    .sort({ [sort]: -1 });

  // check jobs existance
  if (jobs.length < 1) {
    return next(new Error(mesaages.JOB.notFound));
  }
  //send response

  return res.status(200).json({
    success: true,
    data: { jobs, totalPages, totalJob, currentPage },
  });
};
export const getWithFilter = async (req, res, next) => {
  //get data from req
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;
  let { size, limit, sort = "createdAt" } = req.query;
  const query = { isDeleted: false };
  //get specific job
  if (jobLocation) {
    query.jobLocation = jobLocation;
  }
  if (workingTime) {
    query.workingTime = workingTime;
  }
  if (seniorityLevel) {
    query.seniorityLevel = seniorityLevel;
  }
  if (jobTitle) {
    query.jobTitle = jobTitle;
  }
  if (technicalSkills) {
    query.technicalSkills = technicalSkills;
  }

  // search for jobs
  if (!size) size = 10;
  if (!limit) limit = 1;
  if (sort) sort = "createdAt";
  const totalJob = await JobOpportunity.find(query).countDocuments();
  const totalPages = Math.ceil(totalJob / size);
  const currentPage = parseInt(limit);
  const skip = size * (limit - 1);

  const jobs = await JobOpportunity.find(query)
    .skip(skip)
    .limit(size)
    .sort({ [sort]: -1 });
  console.log(jobs);
  console.log(query);
  // check jobs existance
  if (jobs.length < 1) {
    return next(new Error(mesaages.JOB.notFound));
  }
  //send response

  return res.status(200).json({
    success: true,
    data: { jobs, totalPages, totalJob, currentPage },
  });
};
export const getAppsForJob = async (req, res, next) => {
  //get data from req
  const { jobId } = req.params;
  let { size, limit, sort = "createdAt" } = req.query;
  //handel pagentaion
  if (!size) size = 10;
  if (!limit) limit = 1;
  if (!sort) sort = "createdAt";
  const currentPage = parseInt(limit);
  const skip = size * (limit - 1);
  //search for job
  const job = await JobOpportunity.findById(jobId)
    .populate([
      {
        path: "Application",
        match: {
          jobId,
        },
        populate: {
          path: "User",
          as: "user data",
        },
      },
    ])
    .skip(skip)
    .limit(size)
    .sort({ [sort]: -1 });

  // check jobs existance
  if (!job||job.isDeleted==true) {
    return next(new Error(mesaages.JOB.notFound));
  }
  //check owner of company or hrs

  const company = await Company.findById(job.companyId);
  //check company existance
  if (!company||company.isDeleted==true) {
    return next(new Error(mesaages.COMPANY.notFound, { cause: 404 }));
  }
  const isHr = company.HRs.includes(req.userExist._id);
  if (req.userExist._id.toString() !== company.createdBy.toString() || !isHr) {
    return next(new Error("not allowed !", { cause: 401 }));
  }

  //send response
  const totalApps = job.Application.length;
  const totalPages = Math.ceil(totalApps / size);

  return res.status(200).json({
    success: true,
    data: { job, totalPages, totalApps, currentPage },
  });
};
