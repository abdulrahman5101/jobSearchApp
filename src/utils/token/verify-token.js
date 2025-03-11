import jwt from "jsonwebtoken";
export const verifyToken = ({ token, secretKey = process.env.JWT_KEY }) => {
  try {

    return jwt.verify(token, secretKey);// return payload or throw error
  } catch (error) {
    return { error };// obj>>error
  }
};
