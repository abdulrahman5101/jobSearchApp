import { Schema, Types, model } from "mongoose";
import { decrypt, encrypt, hash } from "../../utils/index.js";
import { gender, otpTypes, provider, roles } from "../../utils/enums.js";
import {
  allowedAge,
  deafulProfilePicSecureUrl,
  deafultProfilePicPublicId,
} from "../../utils/deafultValues.js";
import { Company } from "./company.model.js";
import { JobOpportunity } from "./jobopportunity.model.js";
import { Application } from "./application.model.js";
import { Chat } from "./chat.model.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already exist"],
      lowercase: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider == Object.values(provider.SYSTEM) ? true : false;
      },
    },
    provider: {
      type: String,
      enum: Object.values(provider),
      default: provider.SYSTEM,
    },
    gender: {
      type: String,
      enum: Object.values(gender),
      required: true,
    },
    DOB: {
      type: Date,
      validate: {
        validator: (DOB) => {
          const currentDate = new Date();
          const age = currentDate.getFullYear() - DOB.getFullYear();
          return age >= 18;
        },
        message: `age must be greater than or equal ${allowedAge}`,
      },
      required: function () {
        return this.provider == Object.values(provider.SYSTEM) ? true : false;
      },
    },
    mobileNumber: {
      type: String,
      required: function () {
        return this.provider == Object.values(provider.SYSTEM) ? true : false;
      },
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },
    bannedAt: {
      type: Date,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: { type: Date },
    //cloud  system
    profilePic: {
      secure_url: {
        type: String,
        default: deafulProfilePicSecureUrl,
      },
      public_id: {
        type: String,
        default: deafultProfilePicPublicId,
      },
    },

    coverPic: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    OTP: [
      {
        code: {
          type: String,
        },
        type: {
          type: String,
          enum: Object.values(otpTypes),
        },
        expiresIn: {
          type: Date,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },

  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
userSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
//middlewares==>hooks
userSchema.pre("save", async function (next) {
  //hash password
  if (this.isModified("password")) {
    this.changeCredentialTime = new Date();
    this.password = hash({ data: this.password, saltRound: 8 });
  }
  //encrypt phone
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({
      data: this.mobileNumber,
      key: process.env.CRYPTO_KEY,
    });
  }
  //soft delete===>hooks
  if (this.isModified("deletedAt")) {
    const companies = await Company.find({ createdBy: this._id });
    if (companies.length > 0)
      for (const company of companies) {
        company.isDeleted = this.isDeleted;
        if (this.isDeleted) company.deletedAt = Date.now();
        else company.deletedAt = null;
        await company.save();
      }

    const jobs = await JobOpportunity.find({ addedBy: this._id });
    if (jobs.length > 0)
      for (const job of jobs) {
        job.isDeleted = this.isDeleted;
        if (!this.isDeleted) job.deletedAt = Date.now();
        else job.deletedAt = null;
        await job.save();
      }

    const chats = await Chat.find({ users: { $in: [this._id] } });
    if (chats.length > 0)
      for (const chat of chats) {
        chat.isDeleted = this.isDeleted;
        if (!this.isDeleted) chat.deletedAt = Date.now();
        else chat.deletedAt = null;
        await chat.save();
      }

    await Company.updateMany(
      { HRs: { $in: [this._id] } },
      { $pull: { HRs: this._id } }
    );
  }

  return next();
});
//decrypt phone
userSchema.post("findOne", async function (doc, next) {
  if (doc && doc.mobileNumber) {
    doc.mobileNumber = decrypt({
      data: doc.mobileNumber,
      key: process.env.CRYPTO_KEY,
    });
  }
  return next();
});

//model
export const User = model("User", userSchema);
