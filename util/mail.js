const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const useremail = process.env.EMAIL;
const password = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: useremail,
    pass: password,
  },
});

const envoyerEmail = async (
  email,
  subject,
  confirmationLink = null,
  code = null,
  type
) => {
  try {
    let htmlTemplate;

    console.log(type);

    if (type === "OTP") {
      htmlTemplate = fs.readFileSync(
        path.join(__dirname, "public", "confirmationEmail.html"),
        "utf8"
      );
    } else if (type === "forgetpassword") {
      htmlTemplate = fs.readFileSync(
        path.join(__dirname, "public", "forgetpassword.html"),
        "utf8"
      );
    } else if(type === "livreur"){
      htmlTemplate = fs.readFileSync(
        path.join(__dirname, "public", "livreur.html"),
        "utf8"
      );

    } else {
      htmlTemplate = fs.readFileSync(
        path.join(__dirname, "public", "code2FA.html"),
        "utf8"
      );
    }

    let message = htmlTemplate;

    if (confirmationLink) {
      message = htmlTemplate.replace("{{confirmationLink}}", confirmationLink);
    }

    if (code) {
      message = htmlTemplate.replace("{{code}}", code);
    }

    const info = await transporter.sendMail({
      from: "bbilalzaimrajawi@gmail.com",
      to: email,
      subject: subject,
      html: message,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = envoyerEmail;
