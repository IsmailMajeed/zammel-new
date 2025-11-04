import { transporter } from "../config/nodemailer.config.js";
import BRAND from "./brandConstants.js";

/**
 * Send email to customer (not to Zammel)
 * @param {string} to - Customer email address
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
export const sendOrderEmail = async (to, subject, html) => {
  if (!to) {
    throw new Error('Recipient email is required');
  }

  const mailOptions = {
    from: `"${BRAND.name}" <${process.env.NODEMAILER_USER}>`,
    to: to,
    replyTo: BRAND.contact.email,
    subject: subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Order email sending error:', error);
    throw error;
  }
};

