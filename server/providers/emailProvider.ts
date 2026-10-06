import { EmailProvider, EmailLog } from './types.js';

export class RealEmailProvider implements EmailProvider {
  private resendApiKey: string | undefined;
  private sendgridApiKey: string | undefined;
  private defaultSender: string;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY;
    this.sendgridApiKey = process.env.SENDGRID_API_KEY;
    this.defaultSender = process.env.EMAIL_FROM || 'sales@leadflow.demo';
  }

  isConfigured(): boolean {
    return Boolean(this.resendApiKey || this.sendgridApiKey);
  }

  async sendEmail(params: {
    leadId?: string;
    userId: string;
    to: string;
    subject: string;
    body: string;
  }): Promise<{ success: boolean; emailLog: EmailLog; message: string }> {
    const now = new Date().toISOString();
    const logId = `email-${Date.now()}`;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.to)) {
      const emailLog: EmailLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        recipient: params.to,
        subject: params.subject,
        body: params.body,
        status: 'FAILED',
        sentAt: now
      };
      return {
        success: false,
        emailLog,
        message: 'Invalid recipient email address format'
      };
    }

    if (!this.isConfigured()) {
      const emailLog: EmailLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        recipient: params.to,
        subject: params.subject,
        body: params.body,
        status: 'CONFIG_REQUIRED',
        sentAt: now
      };
      return {
        success: false,
        emailLog,
        message: 'Email provider setup required: configure RESEND_API_KEY or SENDGRID_API_KEY in .env'
      };
    }

    try {
      if (this.resendApiKey) {
        // Real Resend API
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: this.defaultSender,
            to: params.to,
            subject: params.subject,
            text: params.body
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Resend error ${response.status}`);
        }

        const emailLog: EmailLog = {
          id: logId,
          leadId: params.leadId,
          userId: params.userId,
          recipient: params.to,
          subject: params.subject,
          body: params.body,
          providerMessageId: data.id,
          status: 'SENT',
          sentAt: now
        };

        return {
          success: true,
          emailLog,
          message: `Email sent via Resend (Message ID: ${data.id})`
        };
      }

      if (this.sendgridApiKey) {
        // Real SendGrid API
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.sendgridApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: params.to }] }],
            from: { email: this.defaultSender },
            subject: params.subject,
            content: [{ type: 'text/plain', value: params.body }]
          })
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`SendGrid error: ${text}`);
        }

        const emailLog: EmailLog = {
          id: logId,
          leadId: params.leadId,
          userId: params.userId,
          recipient: params.to,
          subject: params.subject,
          body: params.body,
          status: 'SENT',
          sentAt: now
        };

        return {
          success: true,
          emailLog,
          message: `Email sent via SendGrid to ${params.to}`
        };
      }

      throw new Error('No active email provider detected');
    } catch (err: any) {
      const emailLog: EmailLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        recipient: params.to,
        subject: params.subject,
        body: params.body,
        status: 'FAILED',
        sentAt: now
      };
      return {
        success: false,
        emailLog,
        message: `Email dispatch failed: ${err.message}`
      };
    }
  }
}

export const emailProvider = new RealEmailProvider();
