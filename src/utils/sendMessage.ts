import nodemailer from "nodemailer";

interface IEmail {
  receiverMail: string;
  subject: string;
  html: string;
}

const sendMessage = async ({ html, receiverMail, subject }: IEmail) => {
  console.log(process.env.MAIL, process.env.MAILPASS);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL as string,
      pass: process.env.MAILPASS as string,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: "legendxpro123455@gmail.com",
    to: receiverMail,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMessage;
