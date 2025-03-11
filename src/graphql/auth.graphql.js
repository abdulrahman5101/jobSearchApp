import { User } from "../db/models/user.model.js";
import { verifyToken } from "../utils/token/verify-token.js";

export const isAuthenticated = async (context)=> {

  const {token}=context
  const result = verifyToken({token,secretKey:process.env.SECRET_KEY});
  const {id,iat,email}=result;
  
  if (result.error) {
    throw new Error(`${result.error}`);
  }
  //check user existance
  const userExist = await User.findById(id);
  if (!userExist) {

    throw new Error("user not found",{cause:404});
  }
  if (userExist.deletedAt?.getTime() > iat * 1000) {
    throw new Error("invaild token", { cause: 400 });
  }
  
  if (userExist.deletedAt?.getTime() > iat * 1000) {
    throw new Error("invaild token", { cause: 400 });
  }
  if (userExist.updatedAt?.getTime() > iat * 1000 & userExist.passwordModified==true) {
    throw new Error("invaild token ,plz login", { cause: 400 });
  }
  
  context.userExist = userExist;

};
