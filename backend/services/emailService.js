"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendPurchaseConfirmationEmail = sendPurchaseConfirmationEmail;
const nodemailer = __importStar(require("nodemailer"));
// Email configuration from environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
    },
});
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Herbal Soap Works <noreply@herbalsoapworks.com>';
async function sendVerificationEmail(email, token) {
    const verificationUrl = `${APP_URL}/verify-email/${token}`;
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify Your Email - Herbal Soap Works',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4a148c; text-align: center;">Welcome to Herbal Soap Works!</h1>
        <p style="font-size: 16px; color: #333;">Thank you for signing up. Please verify your email address to get started.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #7b1fa2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">${verificationUrl}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; text-align: center;">If you didn't sign up for this account, please ignore this email.</p>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    }
    catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}
async function sendPasswordResetEmail(email, token) {
    const resetUrl = `${APP_URL}/reset-password/${token}`;
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset Your Password - Herbal Soap Works',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4a148c; text-align: center;">Password Reset Request</h1>
        <p style="font-size: 16px; color: #333;">You requested to reset your password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #7b1fa2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
        <p style="font-size: 14px; color: #d32f2f; margin-top: 20px;"><strong>This link will expire in 1 hour.</strong></p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}
async function sendPurchaseConfirmationEmail(email, orderDetails) {
    const { orderId, items, total, currency } = orderDetails;
    const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${currency}${item.price}</td>
    </tr>
  `).join('');
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: `Order Confirmation #${orderId} - Herbal Soap Works`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4a148c; text-align: center;">Thank You for Your Order!</h1>
        <p style="font-size: 16px; color: #333;">Your order #${orderId} has been confirmed and is being processed.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #7b1fa2; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="font-weight: bold; font-size: 18px;">
                <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
                <td style="padding: 15px; text-align: right;">${currency}${total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #666;">We'll send you a shipping confirmation when your order ships.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; text-align: center;">Thank you for choosing Herbal Soap Works!</p>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Purchase confirmation email sent to:', email);
    }
    catch (error) {
        console.error('Error sending purchase confirmation email:', error);
        // Don't throw here - order should complete even if email fails
    }
}
