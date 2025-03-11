import { model, Schema, Types } from "mongoose";
import { jobLocation, seniorityLevel, workingTime } from "../../utils/enums.js";
import { Application } from "./application.model.js";

//schema
const jobOpportunitySchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocation),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTime),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevel),
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    technicalSkills: [String],
    softSkills: [String],
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

//handel soft delete===>hooks
jobOpportunitySchema.pre("save", async function (next) {
  if (this.isModified("isDeleted")) {
    const applications = await Application.find({ jobId: this._id });
    if (applications.length > 0)
      for (const application of applications) {
        application.isDeleted = this.isDeleted;
        await application.save();
      }
  }

  return next();
});

//model
export const JobOpportunity = model("JobOpportunity", jobOpportunitySchema);
