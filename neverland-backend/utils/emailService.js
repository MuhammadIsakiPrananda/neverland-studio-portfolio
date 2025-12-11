// neverland-backend/utils/emailService.js - Email Service using Nodemailer
import nodemailer from "nodemailer";
import logger from "./logger.js";

/**
 * Initialize email transporter based on environment
 * Supports both Gmail OAuth2 and standard SMTP
 */
const initializeTransporter = () => {
  const envNode = process.env.NODE_ENV || "development";

  if (envNode === "production") {
    // Production: Use Gmail OAuth2 or your SMTP service
    if (
      process.env.EMAIL_SERVICE === "gmail" &&
      process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN
    ) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GMAIL_USER || process.env.EMAIL_FROM,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        },
      });
    } else {
      // Standard SMTP
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  } else {
    // Development: Use Ethereal Email (free testing service)
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER || "test@ethereal.email",
        pass: process.env.ETHEREAL_PASS || "test-password",
      },
    });
  }
};

let transporter = null;

/**
 * Get or initialize email transporter
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = initializeTransporter();
  }
  return transporter;
};

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} resetToken - Reset token for the password reset link
 * @param {string} frontendUrl - Frontend URL for reset link
 * @returns {Promise<object>} Email send response
 */
export const sendPasswordResetEmail = async (
  to,
  name,
  resetToken,
  frontendUrl = process.env.FRONTEND_URL
) => {
  try {
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@neverlandstudio.my.id",
      to,
      subject: "Reset Your Password - Neverland Studio",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 3px solid #f59e0b;
            }
            .header h1 {
              color: #f59e0b;
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px 0;
              text-align: center;
            }
            .content p {
              margin: 15px 0;
              font-size: 16px;
            }
            .reset-button {
              display: inline-block;
              padding: 12px 30px;
              margin: 20px 0;
              background: linear-gradient(to right, #f59e0b, #f97316);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              transition: transform 0.2s;
            }
            .reset-button:hover {
              transform: scale(1.05);
            }
            .reset-link {
              margin: 20px 0;
              padding: 20px;
              background-color: #f9fafb;
              border-radius: 6px;
              word-break: break-all;
              font-size: 12px;
              color: #666;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #999;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              color: #856404;
              padding: 12px;
              border-radius: 4px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>

            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>

              <p>We received a request to reset the password for your Neverland Studio account. If you didn't make this request, you can safely ignore this email.</p>

              <a href="${resetLink}" class="reset-button">Reset Your Password</a>

              <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
              <div class="reset-link">${resetLink}</div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for your security. If you need another reset link, please request a new one.
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you have any questions, feel free to contact our support team.
              </p>
            </div>

            <div class="footer">
              <p>© 2024 Neverland Studio. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request

        Hi ${name},

        We received a request to reset the password for your Neverland Studio account. Please use the link below to reset your password:

        ${resetLink}

        This link will expire in 1 hour.

        If you didn't request a password reset, please ignore this email.

        © 2024 Neverland Studio
      `,
    };

    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);

    logger.info("Password reset email sent successfully", {
      to,
      messageId: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
      message: "Password reset email sent successfully",
    };
  } catch (error) {
    logger.error("Failed to send password reset email", {
      to,
      error: error.message,
      stack: error.stack,
      config: {
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        emailFrom: process.env.EMAIL_FROM,
      },
    });
    if (error.response) {
      logger.error("Nodemailer response error:", error.response);
    }
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send account verification email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationToken - Verification token
 * @param {string} frontendUrl - Frontend URL
 * @returns {Promise<object>} Email send response
 */
export const sendVerificationEmail = async (
  to,
  name,
  verificationToken,
  frontendUrl = process.env.FRONTEND_URL
) => {
  try {
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@neverlandstudio.my.id",
      to,
      subject: "Verify Your Email - Neverland Studio",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 3px solid #f59e0b;
            }
            .header h1 {
              color: #f59e0b;
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px 0;
              text-align: center;
            }
            .verify-button {
              display: inline-block;
              padding: 12px 30px;
              margin: 20px 0;
              background: linear-gradient(to right, #f59e0b, #f97316);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              transition: transform 0.2s;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Verify Your Email</h1>
            </div>

            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Welcome to Neverland Studio! Please verify your email address to complete your registration.</p>

              <a href="${verificationLink}" class="verify-button">Verify Email</a>

              <p style="color: #666; font-size: 14px;">© 2024 Neverland Studio</p>
            </div>

            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);

    logger.info("Verification email sent successfully", {
      to,
      messageId: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    logger.error("Failed to send verification email", {
      to,
      error: error.message,
      stack: error.stack,
    });

    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default {
  sendPasswordResetEmail,
  sendVerificationEmail,
  getTransporter,
};
