import { model, Schema, Types } from "mongoose";
import { status } from "../../utils/enums.js";
//schema
const applicationSchema=new Schema({
    jobId: {
        type: Types.ObjectId,
        ref: "JobOpportunity",  
      },
      userId: {
        type: Types.ObjectId,
        ref: "User",  
      },
      userCV: {
        secure_url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
      status: {
        type: String,
        enum: Object.values(status),
        default: status.PENDING,  
      },
      isDeleted:{
        type:Boolean,
        default:false
      }

},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})
//model
export const Application = model("Application",applicationSchema)