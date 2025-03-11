export const isDeleted=async(req,res,next)=>{
//check if user deleted 
if (req.userExist.deletedAt) {
    return next(new Error("user is deleted please login"))
}
return next()
}