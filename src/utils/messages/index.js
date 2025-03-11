
export const generateMessage=(entity)=>{
    return{
        missingValue:`${entity} is required`,
notFound:`${entity} not found`,
alreadyExist:`${entity} already exist`,
createdSuccessfully:`${entity} created successfully`,
updatedSuccessfully:`${entity} updated sucessfully`,
deletedSuccessfully:`${entity} deleted successfully`,


    }

}
export const mesaages={
AUTH:{loginSuccessfully:"login successfully"},
    USER:{...generateMessage("user"),
        acctivateAccount:" please activate your account",
        profilePicUpdated:"profile pic updated successfully",
        coverPicUpdated:"cover pic updated successfully",
        profilePicDeleted:"profile pic deleted successfully",
        coverPicDeleted:"cover pic deleted successfully",
        bannedUser:"you are banned"
    },
    OTP:{
        ...generateMessage("otp"),
        expiredOtp:"OTP expired please requset new one"
    }
    ,
    COMPANY:{
        ...generateMessage("company"),
        notTheOwner:"you are not the owner",
        notApproved:"company not approved by admin"
    },
JOB:{
    ...generateMessage("job"),
    notTheOwner:"you are not the owner"


},
APP:{
    ...generateMessage("application")

}
}