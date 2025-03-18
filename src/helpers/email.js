const { Resend } = require("resend");

exports.sendOTP = async (data) => {
  try {
    const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

    return await resend.emails.send({
      from: "ME <onboarding@resend.dev>",
      to: data.toEmail,
      subject: "One Time Password",
      html: `<div style="text-align: center; font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                <h2>OTP Verification</h2>
                <p>Use the following OTP to complete your verification process. This OTP is valid for 15 minutes.</p>
                <p style="font-size: 24px; font-weight: bold; color: #007bff;">${data.otp}</p>
                <p>If you did not request this, please ignore this email.</p>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">© 2024 My Edu. All rights reserved.</p>
            </div>`,
    });
  } catch (error) {
    return error;
  }
};
