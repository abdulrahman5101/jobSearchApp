import { model, Schema, Types } from "mongoose";
import { numberOfEmployeesMax, numberOfEmployeesMin } from "../../utils/deafultValues.js";
import { JobOpportunity } from "./jobopportunity.model.js";
import { Application } from "./application.model.js";

//schema
const companySchema=new Schema({

companyName:{
    type:String,
    unique:[true,"company name already exist"],
    required:true
},
 description:{
    type:String,
    required:true

 } ,
industry:{
    type:String,
    required:true

},
address:{
type:String,
required:true

},
numberOfEmployees:{
type:String,

enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '500+'],

required:true


}
,
companyEmail:{
    type: String,
      required: [true, "email is required"],
      unique: [true, "email already exist"],
      lowercase: true,
} ,
createdBy:{
      type: Types.ObjectId,
          ref: "User",
          required:true
} ,
Logo: {
    
          secure_url: {
            type: String,
          },
          public_id: {
            type: String,
          },
},
coverPic:{
     
          secure_url: {
            type: String,
          },
          public_id: {
            type: String,
          },
},
 HRs:[{
type:Types.ObjectId,
ref:"User"
}],
 bannedAt :{
type:Date
 },
deletedAt:{
    type:Date
},
legalAttachment: {
    secure_url: {
      type: String,
      required: true, 
    },
    public_id: {
      type: String,
      required: true, 
    },
  },
  approvedByAdmin: {
    type: Boolean,
    default: false,  
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
},{timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})
companySchema.virtual("jobs",{
  ref:"JobOpportunity",
  localField:"_id",
  foreignField:"companyId"
})
companySchema.pre("save", async function (next) {
  if (this.isModified("isDeleted") ){
      const jobs = await JobOpportunity.find({ companyId : this._id })
      if( jobs.length > 0 )
      for (const job of jobs) {
          job.isDeleted = this.isDeleted
          await job.save() 
      }
  }
  
  return next()
})

//model
export const Company=model("Company",companySchema)