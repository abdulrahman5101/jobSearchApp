import { Application } from "../../db/models/application.model.js";
import { Company } from "../../db/models/company.model.js";
import { JobOpportunity } from "../../db/models/jobopportunity.model.js";
import {
  applicationStatusHtml,
  subjectOfAppEmail,
} from "../../utils/deafultValues.js";
import { sendEmail } from "../../utils/email/send-email.js";
import cloudinary from "../../utils/file upload/cloud-config.js";
import { mesaages } from "../../utils/messages/index.js";

export const applyToJob = async (req, res, next) => {
  //get data from req
  const { jobId } = req.params;
  //check job existance
  const job = await JobOpportunity.findById(jobId);
  if (!job||job.isDeleted==true) {
    return next(new Error(mesaages.JOB.notFound));
  }
  //upload attachment to cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `search-job-app/companies/job/${job._id}/applications/${req.userExist._id}`,
    }
  );
  //create into db
  const app = await Application.create({
    jobId,
    userCV: {
      secure_url,
      public_id,
    },
    userId: req.userExist._id,
  });
  //send response
  return res.status(201).json({
    success: true,
    msg: mesaages.APP.createdSuccessfully,
  });
};
export const acceptOrReject = async (req, res, next) => {
  //get data from req
  const { appId } = req.params;
  const { status } = req.body;
  const app = await Application.findById(appId);
  //check app existance
  if (!app||app.isDeleted==true) {
    return next(new Error(mesaages.APP.notFound, { cause: 404 }));
  }
  //check if HR
  const job = await JobOpportunity.findById(app.jobId);
  //check job exist
  if (!job||job.isDeleted==true) {
    return next(new Error(mesaages.JOB.notFound))
    
  }
  const company = await Company.findById(job.companyId);
  const isHr = company.HRs.includes(req.userExist._id);
  if (!isHr) {
    return next(new Error("not allowed !", { cause: 401 }));
  }
  //update db
  await app.updateOne({
    status,
  });
  //save into db
  await app.save();
  //send email
  await sendEmail({
    to: req.userExist.email,
    subject: subjectOfAppEmail,
    html: applicationStatusHtml({
      status,
      jobTitle: job.jobTitle,
      companyName: company.companyName,
    }),
  });
  //send response
  return res.status(200).json({
    success: true,
    msg: `application ${status} successfully`,
  });
};
