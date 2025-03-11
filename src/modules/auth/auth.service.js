import { User } from "../../db/models/user.model.js";
import { sendEmail, sendEmailEvent } from "../../utils/email/send-email.js";
import { encrypt, hash, verifyToken } from "../../utils/index.js";
import Randomstring from "randomstring";

import { compare, generateToken } from "../../utils/index.js";
import { OAuth2Client } from "google-auth-library";
import {
  confirmEmailHtml,
  forgotPasswordOtpHtml,
} from "../../utils/deafultValues.js";
import { otpTypes, provider } from "../../utils/enums.js";
import { mesaages } from "../../utils/messages/index.js";
import { verifyGoogleToken } from "../../utils/token/google.token.js";

export const signup = async (req, res, next) => {
  //get data from user
  const { firstName, lastName, email, password, mobileNumber, DOB,gender } = req.body;

  //check user existance
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new Error(`${mesaages.USER.alreadyExist},`, { cause: 400 }));
  }
  //generate otp
  const otp = Randomstring.generate({ length: 5, charset: "numeric" });
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

  //create user
  const createdUser = new User({
    firstName,
    lastName,
    email,
    password,
    gender,
    mobileNumber,
    DOB,
    OTP: [],
  });

  //save otp into db
  createdUser.OTP.push({
    code: hash({ data: otp, saltRound: 8 }),
    type: otpTypes.CONFIRM_EMAIL,
    expiresIn,
  });
  await createdUser.save();
  //send otp to email
  await sendEmail({
    to: email,
    subject: otpTypes.CONFIRM_EMAIL,
    html: confirmEmailHtml(otp),
  });
  //send response
  return res.status(201).json({
    success: true,
    msg: `${mesaages.USER.createdSuccessfully}${mesaages.USER.acctivateAccount}`,
  });
};
export const confirmOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new Error(mesaages.USER.notFound, { cause: 404 }));
  }
  if (userExist.isConfirmed == true) {
    return next(new Error("email already confirmed", { cause: 400 }));
  }

  // Check OTP existance, expire date and value
  if (userExist.OTP.length == 0) {
    return next(new Error(`${mesaages.OTP.notFound}`, { cause: 404 }));
  }
  //check expired date
  const currentDate = new Date();
  const existOtp = userExist.OTP.filter((ele) => {
    return (
      ele.expiresIn.setMinutes(ele.expiresIn.getMinutes() + 10) > currentDate &&
      ele.type == otpTypes.CONFIRM_EMAIL
    );
  });
  if (existOtp.length == 0) {
    return next(new Error(`${mesaages.OTP.expiredOtp}`, { cause: 400 }));
  }
  const matchedOtp = compare({ hashData: existOtp[0].code, data: otp });
  if (!matchedOtp) {
    return next(new Error("invalid OTP", { cause: 400 }));
  }
  //remove otp from db
  await userExist.updateOne({
    $pull: {
      OTP: {
        code: existOtp[0].code,
        type: otpTypes.CONFIRM_EMAIL,
      },
    },
  });
  //update is confirmed
  userExist.isConfirmed = true;
  // save user doc
  await userExist.save();

  return res.json({ success: true, msg: "Email confirmed successfully" });
};
export const sendOtp = async (req, res, next) => {
  //get data from req
  const { email } = req.body;
  //check user existence
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new Error(mesaages.USER.notFound, { cause: 404 }));
  }
  // check email confirmation
  if (userExist.isConfirmed == true) {
    return next(new Error("Email already confirmed", { cause: 400 }));
  }
  //check otp exist
  const existOtp = userExist.OTP.filter((otp) => {
    return otp.type == otpTypes.CONFIRM_EMAIL;
  });
  if (existOtp.length > 0) {
    await userExist.updateOne({
      $pull: {
        OTP: {
          code: existOtp[0].code,
          type: otpTypes.CONFIRM_EMAIL,
        },
      },
    });
  }
  //generate otp
  const otp = Randomstring.generate({ length: 5, charset: "numeric" });
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

  userExist.OTP.push({
    code: hash({ data: otp, saltRound: 8 }),
    type: otpTypes.CONFIRM_EMAIL,
    expiresIn,
  });
  //save into db
  await userExist.save();
  //send email
  await sendEmail({
    to: userExist.email,
    subject: otpTypes.CONFIRM_EMAIL,
    html: confirmEmailHtml(otp),
  });
  //send response
  return res.status(201).json({ success: true, msg: "otp sent successfully" });
};
export const login = async (req, res, next) => {
  //get email and password
  const { email, password } = req.body;
  //check user existance by email
  const userExist = await User.findOne({ email }); // return user || null
  if (!userExist) {
    return next(new Error(mesaages.USER.notFound, { cause: 404 }));
  }
  if (userExist.provider == provider.GOOGLE) {
    return next(new Error("please login with google", { cause: 400 }));
  }
  //compare passwords
  const matchedPassword = compare({
    data: password,
    hashData: userExist.password,
  });
  if (!matchedPassword) {
    return next(new Error("invaid password", { cause: 401 }));
  }
  if (userExist.isConfirmed == false) {
    return next(new Error("please acctive your account", { cause: 400 }));
  }
  // active acc again
  if (userExist.deletedAt) {
    userExist.deletedAt=null;
    userExist.save()
    
  }

  //generate token
  const accessToken = generateToken({
    payload: {
      id: userExist._id,
    },
    options: { expiresIn: "1h" },
  });
  const refreshToken = generateToken({
    payload: {
      id: userExist._id,
    },
    options: { expiresIn: "7d" },
  });

  //send response
  return res.status(200).json({
    success: true,
    msg: mesaages.AUTH.loginSuccessfully,
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};
export const signupWithGoogle = async (req, res, next) => {
  //get data from req
  const { idToken } = req.body;
  const { email, given_name, family_name, picture } = await verifyGoogleToken(
    idToken
  );

  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(
      new Error(`${mesaages.USER.alreadyExist} please login`, { cause: 400 })
    );
  }

  //create user
  const createdUser = await User.create({
    firstName: given_name,
    lastName: family_name,
    email,
    provider: provider.GOOGLE,
    isConfirmed: true,
  });

  //send response
  return res.status(200).json({
    success: true,
    msg: `${mesaages.USER.createdSuccessfully} please login`,
  });
};
export const loginWithGoogle = async (req, res, next) => {
  //get data from req
  const { idToken } = req.body;
  const { email } = await verifyGoogleToken(idToken);

  const userExist = await User.findOne({ email });

  if (!userExist) {
    return next(new Error(`${mesaages.USER.notFound}`, { cause: 404 }));
  }
  if (userExist.deletedAt) {
    userExist.deletedAt=null;
    userExist.save()
    
  }
  //generate token
  const accessToken = generateToken({
    payload: {
      id: userExist._id,
    },
    options: { expiresIn: "1h" },
  });
  const refreshToken = generateToken({
    payload: {
      id: userExist._id,
    },
    options: { expiresIn: "7d" },
  });

  //send response
  return res.status(200).json({
    success: true,
    msg: mesaages.AUTH.loginSuccessfully,
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};
export const sendOtpPassword = async (req, res, next) => {
  //get data from req
  const { email } = req.body;
  //check user existence
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new Error(mesaages.USER.notFound, { cause: 404 }));
  }
  //check otp exist
  const existOtp = userExist.OTP.filter((otp) => {
    return otp.type == otpTypes.FORGET_PASSWORD;
  });
  if (existOtp.length > 0) {
    await userExist.updateOne({
      $pull: {
        OTP: {
          code: existOtp[0].code,
          type: otpTypes.FORGET_PASSWORD,
        },
      },
    });
  }
  //generate otp
  const otp = Randomstring.generate({ length: 5, charset: "numeric" });
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

  userExist.OTP.push({
    code: hash({ data: otp, saltRound: 8 }),
    type: otpTypes.FORGET_PASSWORD,
    expiresIn,
  });
  //save into db
  await userExist.save();
  //send email
  await sendEmail({
    to: userExist.email,
    subject: otpTypes.CONFIRM_EMAIL,
    html: forgotPasswordOtpHtml(otp),
  });
  //send response
  return res.status(201).json({ success: true, msg: "otp sent successfully" });
};
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new Error(mesaages.USER.notFound, { cause: 404 }));
  }
  // Check OTP existance, expire date and value
  if (userExist.OTP.length == 0) {
    return next(new Error(`${mesaages.OTP.notFound}`, { cause: 404 }));
  }
  //check expired date
  const currentDate = new Date();
  const existOtp = userExist.OTP.filter((ele) => {
    return (
      ele.expiresIn.setMinutes(ele.expiresIn.getMinutes() + 10) > currentDate &&
      ele.type == otpTypes.FORGET_PASSWORD
    );
  });
  if (existOtp.length == 0) {
    return next(new Error(`${mesaages.OTP.expiredOtp}`, { cause: 400 }));
  }
  const matchedOtp = compare({ hashData: existOtp[0].code, data: otp });
  if (!matchedOtp) {
    return next(new Error("invalid OTP", { cause: 400 }));
  }
  //remove otp from db
  await userExist.updateOne({
    $pull: {
      OTP: {
        code: existOtp[0].code,
        type: otpTypes.FORGET_PASSWORD,
      },
    },
  });
userExist.password=newPassword;
await userExist.save()

  return res.json({ success: true, msg: "password updated successfully" });
};
export const refreshToken = async (req, res, next) => {
  //get data from req
  const { refreshToken } = req.body;
  //Verify token
  const result = verifyToken({
    token: refreshToken,
  });
  if (result.error) {
    return next(result.error);
  }
  //generate token
  const accessToken = generateToken({
    payload: { _id: result.id },
    options: { expiresIn: "1h" },
  });
  return res.status(201).json({ success: true, accessToken });
};
