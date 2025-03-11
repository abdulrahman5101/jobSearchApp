import nodemailer from "nodemailer";
import { EventEmitter } from "events";
 export const sendEmailEvent = new EventEmitter();
sendEmailEvent.on("sendEmail", async (email,otp) => {
    //send email
    await sendEmail({
        to:email,
        subject:"verify account",
        html:`<p>your OTP is ${otp}</p>`

    })
});
export const sendEmail =async ({ to, subject, html }) => {
  //transporter>>>generate
  const transporter = nodemailer.createTransport({
    //service==>outlook>>gmail>>yahoo
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  //send email
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
  });
  
  if (info.rejected.length> 0) {return false};
  return true;
};
