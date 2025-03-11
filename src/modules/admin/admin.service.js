import { Company } from "../../db/models/company.model.js";
import {  User } from "../../db/models/user.model.js";
import { roles } from "../../utils/enums.js";
import { mesaages } from "../../utils/messages/index.js";

export const banOrUnbannedUser=async(req,res,next)=>{
  //get dat from req 
  const{userId}=req.params
  //find user 
  const user= await User.findById(userId)
  //check user existance 
  if (!user||user.isDeleted==true) {
    return next (new Error(mesaages.USER.notFound,{cause:404}))
    
  }
  //check user banned or unbanned
  let status=""
  if (user.bannedAt) {
   await user.updateOne({
      bannedAt:null
    })
    status="unbanned"
  }else{
   await user.updateOne({
      bannedAt:new Date()
    })
    status="banned"
  }
  //save into db
  await user.save()
  //send response 
  
  return res.status(200).json({
    success:true,
    msg:`user ${status} successfully `
  })
}
export const banOrUnbannedCompany=async(req,res,next)=>{
  //get dat from req 
  const{companyId}=req.params
  //find company 
  const company= await Company.findById(companyId)
  //check compay banned or unbanned
if (!company||company.isDeleted==true) {
  return next (new Error(mesaages.COMPANY.notFound))
  
}
  let status=""
  if (company.bannedAt) {
   await company.updateOne({
      bannedAt:null
    })
    status="unbanned"
  }else{
   await company.updateOne({
      bannedAt:new Date()
    })
    status="banned"
  }
  //save into db
  await company.save()
  //send response 
  
  return res.status(200).json({
    success:true,
    msg:`company ${status} successfully `
  })
}
export const approveCompany=async(req,res,next)=>{
  //get dat from req and update 
  const{companyId}=req.params
  //find company 
  const company= await Company.findByIdAndUpdate(companyId,{
    approvedByAdmin:true
  })
  //check company existance
  if (!company||company.isDeleted==true) {
    return next (new Error(mesaages.COMPANY.notFound))
  }
  //save into db
  await company.save()
  //send response 

  return res.status(200).json({
    success:true,
    msg:`company approved successfully`
  })
}