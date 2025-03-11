//deafult values
export const numberOfEmployeesMin=11
export const numberOfEmployeesMax=20
export const allowedAge = 18;
export const deafultProfilePic = "uploads/deafult.jpg";
export const deafulProfilePicSecureUrl =
  "https://res.cloudinary.com/di2pocamo/image/upload/v1739140542/deafult_pic_dlz4cr.jpg";
export const deafultProfilePicPublicId = "deafult_pic_dlz4cr";
export function confirmEmailHtml(otp) {
  return`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #4CAF50;
          }
          .content {
            text-align: center;
          }
          .content p {
            font-size: 16px;
            margin: 20px 0;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            padding: 10px;
            background-color: #f0f8f4;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your OTP for Email Confirmation</h1>
          </div>
          <div class="content">
            <p>Thank you for signing up </p>
            <p>Your One-Time Password (OTP) for confirming your email address is:</p>
            <div class="otp">${otp}</div>
            <p>Please enter this OTP in the app or website to complete the process.</p>
            <p>This OTP will expire in 10 minutes.</p>
          </div>
          <div class="footer">
            <p>If you did not sign up for this account, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;


}
export function forgotPasswordOtpHtml(otp) {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #4CAF50;
          }
          .content {
            text-align: center;
          }
          .content p {
            font-size: 16px;
            margin: 20px 0;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            padding: 10px;
            background-color: #f0f8f4;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Forgot Password OTP</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password.</p>
            <p>Your One-Time Password (OTP) to reset your password is:</p>
            <div class="otp">${otp}</div>
            <p>Please enter this OTP in the app or website to reset your password.</p>
            <p>This OTP will expire in 10 minutes.</p>
          </div>
          <div class="footer">
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
export function applicationStatusHtml({status, jobTitle, companyName}) {
  let message;

  if (status === "accepted") {
    message = `
      <p>Congratulations! Your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been <strong>accepted</strong>.</p>
      <p>We are excited to move forward with your application and will contact you shortly with further details.</p>
    `;
  } else if (status === "rejected") {
    message = `
      <p>We regret to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been <strong>rejected</strong>.</p>
      <p>We appreciate the time and effort you put into your application and encourage you to apply for future opportunities with us.</p>
    `;
  } else {
    message = `<p>Your application status for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> is currently <strong>pending</strong>.</p>`;
  }

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #4CAF50;
          }
          .content {
            text-align: center;
          }
          .content p {
            font-size: 16px;
            margin: 20px 0;
          }
          .status {
            font-size: 18px;
            font-weight: bold;
            color: #4CAF50;
            padding: 10px;
            background-color: #f0f8f4;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            ${message}
            <div class="status">${status === "accepted" ? "Accepted" : "Rejected"}</div>
            <p>If you have any questions, feel free to contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
export const subjectOfAppEmail="application-status"

