import { MessagingProvider, MessageLog } from './types.js';

export class TwilioMessagingProvider implements MessagingProvider {
  private accountSid: string | undefined;
  private authToken: string | undefined;
  private fromNumber: string | undefined;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_API_SECRET;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  isConfigured(): boolean {
    return Boolean(this.accountSid && this.authToken && this.fromNumber);
  }

  async sendSMS(params: {
    leadId?: string;
    userId: string;
    to: string;
    text: string;
  }): Promise<{ success: boolean; messageLog: MessageLog; message: string }> {
    const now = new Date().toISOString();
    const logId = `msg-sms-${Date.now()}`;

    // Clean phone number
    const cleanedTo = params.to.replace(/[^\d+]/g, '');

    if (!cleanedTo || cleanedTo.length < 8) {
      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'SMS',
        recipient: params.to,
        content: params.text,
        optInStatus: 'UNKNOWN',
        status: 'FAILED',
        sentAt: now
      };
      return {
        success: false,
        messageLog,
        message: 'Invalid SMS destination phone number'
      };
    }

    if (!this.isConfigured()) {
      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'SMS',
        recipient: cleanedTo,
        content: params.text,
        optInStatus: 'UNKNOWN',
        status: 'CONFIG_REQUIRED',
        sentAt: now
      };
      return {
        success: false,
        messageLog,
        message: 'SMS provider setup required: configure TWILIO_ACCOUNT_SID and TWILIO_PHONE_NUMBER in .env'
      };
    }

    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const authHeader = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const statusCallbackUrl = `${appUrl}/api/webhooks/twilio/messages`;

      const bodyParams = new URLSearchParams({
        To: cleanedTo,
        From: this.fromNumber!,
        Body: params.text,
        StatusCallback: statusCallbackUrl
      });

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Twilio SMS error ${response.status}`);
      }

      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'SMS',
        recipient: cleanedTo,
        content: params.text,
        providerMessageId: result.sid,
        optInStatus: 'OPTED_IN',
        status: 'SENT',
        sentAt: now
      };

      return {
        success: true,
        messageLog,
        message: `SMS dispatched via Twilio Carrier Gateway (SID: ${result.sid})`
      };
    } catch (err: any) {
      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'SMS',
        recipient: cleanedTo,
        content: params.text,
        optInStatus: 'UNKNOWN',
        status: 'FAILED',
        sentAt: now
      };
      return {
        success: false,
        messageLog,
        message: `SMS delivery failed: ${err.message}`
      };
    }
  }
}

export const messagingProvider = new TwilioMessagingProvider();
