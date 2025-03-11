import { User } from "../db/models/user.model.js";
import { mesaages } from "../utils/messages/index.js";
import { verifyToken } from "../utils/token/verify-token.js";

export const isAuthenticated = async (req, res, next) => {
  //get data from request
  const { token } = req.headers;
  // const { authorization } = req.headers;
  // if (!authorization) {
  //   return next(new Error("authourization is required", { cause: 400 }));
  // }
  // if (!authorization.startsWith("Bearer")) {
  //   return next(new Error("invaild bearer", { cause: 400 }));
  // }
  // const token = await authorization.split(" ")[1];
  //verfiy token
  const result = verifyToken({ token });
  const { id, iat, email } = result;
  if (result.error) {
    return next(result.error);
  }
  //check user exist
  const userExist = await User.findById(id);
  if (!userExist) {
    return next(new Error("user not found"));
  }
  if (userExist.deletedAt?.getTime() > iat * 1000) {
    return next(new Error("invaild token", { cause: 400 }));
  }
  if (userExist.changeCredentialTime?.getTime() > iat * 1000) {
    return next(new Error("invaild token ,plz login", { cause: 400 }));
  }
  if (userExist.bannedAt) {
    return next(new Error(mesaages.USER.bannedUser, { cause: 401 }));
  }
  req.userExist = userExist;

  return next();
};
