// src/lib/email.ts
import nodemailer from 'nodemailer';

// Configure email transport
// For production, use a service like AWS SES, SendGrid, etc.
// For development, you can use a test account or services like Mailtrap
let transporter: nodemailer.Transporter;

if (process.env.NODE_ENV === 'production') {
  // Production email setup
  transporter = nodemailer.createTransport({
    // Configure based on your chosen email service
    // Example for AWS SES:
    service: 'ses',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
} else {
  // Development email setup
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, text, from }: EmailOptions) {
  const defaultFrom = process.env.EMAIL_FROM || 'Inkless Flow <no-reply@inklessflow.com>';
  
  try {
    const info = await transporter.sendMail({
      from: from || defaultFrom,
      to,
      subject,
      text: text || '',
      html,
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Email template for document signing invitations
interface SigningInvitationParams {
  documentId: string;
  documentTitle: string;
  signerName: string;
  signerEmail: string;
  senderName: string;
  message?: string;
  signingLink: string;
}

export async function sendSigningInvitation({
  documentId,
  documentTitle,
  signerName,
  signerEmail,
  senderName,
  message,
  signingLink,
}: SigningInvitationParams) {
  const subject = `${senderName} has invited you to sign "${documentTitle}"`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Inkless Flow Logo" style="height: 40px; margin-bottom: 24px;" />
        
        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Document Signing Request</h1>
        
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
          Hello ${signerName},
        </p>
        
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
          ${senderName} has invited you to sign the document "${documentTitle}".
        </p>
        
        ${message ? `
          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="color: #475569; font-size: 16px; margin: 0;">
              ${message}
            </p>
          </div>
        ` : ''}
        
        <div style="margin: 32px 0;">
          <a href="${signingLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
            Review & Sign Document
          </a>
        </div>
        
        <p style="color: #475569; font-size: 14px; margin-bottom: 8px;">
          If the button above doesn't work, copy and paste this link into your browser:
        </p>
        
        <p style="color: #64748b; font-size: 14px; margin-bottom: 24px; word-break: break-all;">
          ${signingLink}
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">
            This document is being securely processed by Inkless Flow, a free e-signature platform.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Inkless Flow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  
  const text = `
Hello ${signerName},

${senderName} has invited you to sign the document "${documentTitle}".

${message ? `Message: ${message}` : ''}

To review and sign the document, please visit:
${signingLink}

This document is being securely processed by Inkless Flow, a free e-signature platform.
  `;
  
  return sendEmail({
    to: signerEmail,
    subject,
    html,
    text,
  });
}

// Email template for signing reminders
interface SigningReminderParams {
  documentId: string;
  documentTitle: string;
  signerName: string;
  signerEmail: string;
  senderName: string;
  signingLink: string;
}

export async function sendSigningReminder({
  documentId,
  documentTitle,
  signerName,
  signerEmail,
  senderName,
  signingLink,
}: SigningReminderParams) {
  const subject = `Reminder: Please sign "${documentTitle}"`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Inkless Flow Logo" style="height: 40px; margin-bottom: 24px;" />
        
        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Signature Reminder</h1>
        
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
          Hello ${signerName},
        </p>
        
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
          This is a friendly reminder that ${senderName} is waiting for you to sign the document "${documentTitle}".
        </p>
        
        <div style="margin: 32px 0;">
          <a href="${signingLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
            Review & Sign Document
          </a>
        </div>
        
        <p style="color: #475569; font-size: 14px; margin-bottom: 8px;">
          If the button above doesn't work, copy and paste this link into your browser:
        </p>
        
        <p style="color: #64748b; font-size: 14px; margin-bottom: 24px; word-break: break-all;">
          ${signingLink}
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">
            This document is being securely processed by Inkless Flow, a free e-signature platform.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Inkless Flow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  
  const text = `
Hello ${signerName},

This is a friendly reminder that ${senderName} is waiting for you to sign the document "${documentTitle}".

To review and sign the document, please visit:
${signingLink}

This document is being securely processed by Inkless Flow, a free e-signature platform.
  `;
  
  return sendEmail({
    to: signerEmail,
    subject,
    html,
    text,
  });
}

// Email template for document completion notification
interface DocumentCompletedParams {
  documentId: string;
  documentTitle: string;
  recipientName: string;
  recipientEmail: string;
  downloadLink: string;
}

export async function sendDocumentCompletedNotification({
  documentId,
  documentTitle,
  recipientName,
  recipientEmail,
  downloadLink,
}: DocumentCompletedParams) {
  const subject = `Document Signed: "${documentTitle}"`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Inkless Flow Logo" style="height: 40px; margin-bottom: 24px;" />
        
        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Document Completed</h1>
        
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
          Hello ${recipientName},
        </p>
        
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
          Great news! The document "${documentTitle}" has been signed by all parties and is now complete.
        </p>
        
        <div style="margin: 32px 0;">
          <a href="${downloadLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
            Download Signed Document
          </a>
        </div>
        
        <p style="color: #475569; font-size: 14px; margin-bottom: 8px;">
          If the button above doesn't work, copy and paste this link into your browser:
        </p>
        
        <p style="color: #64748b; font-size: 14px; margin-bottom: 24px; word-break: break-all;">
          ${downloadLink}
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">
            This document was securely processed by Inkless Flow, a free e-signature platform.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Inkless Flow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  
  const text = `
Hello ${recipientName},

Great news! The document "${documentTitle}" has been signed by all parties and is now complete.

To download the signed document, please visit:
${downloadLink}

This document was securely processed by Inkless Flow, a free e-signature platform.
  `;
  
  return sendEmail({
    to: recipientEmail,
    subject,
    html,
    text,
  });
}