import joi from "joi"
import { Types } from "mongoose";
export const generalFields={
  id:joi.custom(isValidId),
  attachment:joi.object({
    fieldname:joi.string().required(),
    originalname:joi.string().required(),
    encoding:joi.string().required(),
    mimetype:joi.string().required(),
    destination:joi.string().required(),
    filename:joi.string().required(),
    path:joi.string().required(),
    size:joi.number().required(),
}).required()

}
export const isValid = (schema) => {
  return async (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    if (req.file||req.files) {
      data.attachment=req.file||req.files
      
    }
    const result = schema.validate(data, { abortEarly: false });
    if (result.error) {
      let msgsArr = result.error.details.map((obj) => obj.message);
      return next(new Error(msgsArr, { cause: 400 }));
    }
    return next();
  };
};
export function isValidId (value,helpers) {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message("invalid obj id")
    
  }else{
    return true
  }
  
}

