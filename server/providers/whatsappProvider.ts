import { WhatsAppProvider, MessageLog } from './types.js';

export class TwilioWhatsAppProvider implements WhatsAppProvider {
  private accountSid: string | undefined;
  private authToken: string | undefined;
  private whatsappNumber: string | undefined;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_API_SECRET;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  }

  isConfigured(): boolean {
    return Boolean(this.accountSid && this.authToken && this.whatsappNumber);
  }

  async sendMessage(params: {
    leadId?: string;
    userId: string;
    to: string;
    message: string;
    optInStatus?: 'OPTED_IN' | 'OPTED_OUT' | 'UNKNOWN';
  }): Promise<{ success: boolean; messageLog: MessageLog; message: string }> {
    const now = new Date().toISOString();
    const logId = `msg-wa-${Date.now()}`;
    const optIn = params.optInStatus || 'UNKNOWN';

    // Compliance Check: Do not send if explicitly opted out
    if (optIn === 'OPTED_OUT') {
      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'WHATSAPP',
        recipient: params.to,
        content: params.message,
        optInStatus: 'OPTED_OUT',
        status: 'FAILED',
        sentAt: now
      };
      return {
        success: false,
        messageLog,
        message: 'WhatsApp delivery blocked: Prospect has opted out of WhatsApp business communications'
      };
    }

    if (!this.isConfigured()) {
      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'WHATSAPP',
        recipient: params.to,
        content: params.message,
        optInStatus: optIn,
        status: 'CONFIG_REQUIRED',
        sentAt: now
      };
      return {
        success: false,
        messageLog,
        message: 'WhatsApp provider setup required: configure TWILIO_ACCOUNT_SID and TWILIO_WHATSAPP_NUMBER in .env'
      };
    }

    try {
      const formattedTo = params.to.startsWith('whatsapp:')
        ? params.to
        : `whatsapp:${params.to.replace(/[^\d+]/g, '')}`;
      const formattedFrom = this.whatsappNumber!.startsWith('whatsapp:')
        ? this.whatsappNumber!
        : `whatsapp:${this.whatsappNumber!}`;

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const authHeader = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const statusCallbackUrl = `${appUrl}/api/webhooks/twilio/messages`;

      const bodyParams = new URLSearchParams({
        To: formattedTo,
        From: formattedFrom,
        Body: params.message,
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
        throw new Error(result.message || `Twilio WhatsApp error ${response.status}`);
      }

      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'WHATSAPP',
        recipient: params.to,
        content: params.message,
        providerMessageId: result.sid,
        optInStatus: optIn,
        status: 'SENT',
        sentAt: now
      };

      return {
        success: true,
        messageLog,
        message: `WhatsApp message dispatched via Twilio (SID: ${result.sid})`
      };
    } catch (err: any) {
      const messageLog: MessageLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        channel: 'WHATSAPP',
        recipient: params.to,
        content: params.message,
        optInStatus: optIn,
        status: 'FAILED',
        sentAt: now
      };
      return {
        success: false,
        messageLog,
        message: `WhatsApp delivery failed: ${err.message}`
      };
    }
  }
}

export const whatsappProvider = new TwilioWhatsAppProvider();
