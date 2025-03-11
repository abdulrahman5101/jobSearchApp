// 1. senderId (must be HR or company owner) (The sender id , required)
// 2. receiverId (any user) (The sender id , required) 

import { model, Schema, Types } from "mongoose";

// 3. messages (array of  {message,senderId})
const messageSchema=new Schema({
    
        message:{
            type:String
        },
        senderId:{
            type:Types.ObjectId,
            ref:"User",
            required:true
        },
        receiverId:{
            type:Types.ObjectId,
            ref:"User",
            required:true
        },
    
},{timestamps:true})
const chatSchema=new Schema({
    users : [{type : Types.ObjectId , ref : "User" , required : true}],
    messages :[messageSchema],
    isDeleted : {type : Boolean , default : false}

},{timestamps:true})
//model 
export const Chat =model("Chat",chatSchema)