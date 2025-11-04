import { transporter } from "../config/nodemailer.config.js";
import BRAND from "./brandConstants.js";

export const sendEmail = async (name = "Zammel", email, subject, html) => {
  if (!email) {
    throw new Error('Email is required');
  }

  const mailOptions = {
    from: `"${name}" <${process.env.NODEMAILER_USER}>`,
    to: BRAND.contact.email,
    replyTo: email,
    subject: subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
