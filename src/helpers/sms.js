const twilio = require("twilio");

exports.sendSMSOTP = async (data) => {
  try {
    const client = new twilio(
      process.env.SEND_SMS_SID,
      process.env.SEND_SMS_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Your OTP code is: ${data.otp}`,
      from: `${process.env.SEND_SMS_PHONE_NUMBER}`,
      to: data.toPhoneNumber,
    });
  } catch (error) {
    console.error("Error sending SMS OTP:", error);
    return error;
  }
};
