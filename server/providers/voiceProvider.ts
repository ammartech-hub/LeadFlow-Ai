import { VoiceProvider, CallLog } from './types.js';

export class TwilioVoiceProvider implements VoiceProvider {
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

  // Validate E.164 format
  validatePhoneNumber(phone: string): { valid: boolean; formatted: string } {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned) return { valid: false, formatted: phone };
    const formatted = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return { valid: e164Regex.test(formatted), formatted };
  }

  async initiateCall(params: {
    leadId?: string;
    userId: string;
    phoneNumber: string;
    purpose?: string;
    script?: string;
  }): Promise<{ success: boolean; callLog: CallLog; message: string }> {
    const { valid, formatted } = this.validatePhoneNumber(params.phoneNumber);
    const now = new Date().toISOString();
    const logId = `call-${Date.now()}`;

    if (!valid) {
      const callLog: CallLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        phoneNumber: params.phoneNumber,
        purpose: params.purpose,
        status: 'FAILED',
        durationSeconds: 0,
        startedAt: now,
        endedAt: now,
        notes: 'Invalid phone number format. E.164 format required (e.g. +919820144321)',
        createdAt: now
      };
      return {
        success: false,
        callLog,
        message: 'Invalid phone number format. Must be valid E.164 (e.g., +919820144321)'
      };
    }

    if (!this.isConfigured()) {
      const callLog: CallLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        phoneNumber: formatted,
        purpose: params.purpose,
        status: 'CONFIG_REQUIRED',
        durationSeconds: 0,
        startedAt: now,
        endedAt: now,
        notes: 'Telephony provider setup required: configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.',
        createdAt: now
      };
      return {
        success: false,
        callLog,
        message: 'Provider account/setup required: set TWILIO_ACCOUNT_SID and TWILIO_PHONE_NUMBER in .env'
      };
    }

    try {
      // Real Twilio API Call
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`;
      const authHeader = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const statusCallbackUrl = `${appUrl}/api/webhooks/twilio/voice`;

      const twiml = `<Response><Say voice="alice">${params.script || 'Hello, this is LeadFlow AI calling regarding your enterprise communication requirement.'}</Say></Response>`;

      const bodyParams = new URLSearchParams({
        To: formatted,
        From: this.fromNumber!,
        Twiml: twiml,
        StatusCallback: statusCallbackUrl,
        StatusCallbackEvent: 'initiated ringing answered completed'
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
        throw new Error(result.message || `Twilio error ${response.status}`);
      }

      const callLog: CallLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        providerCallId: result.sid,
        phoneNumber: formatted,
        purpose: params.purpose,
        status: 'QUEUED',
        durationSeconds: 0,
        startedAt: now,
        createdAt: now
      };

      return {
        success: true,
        callLog,
        message: `Call initiated via Twilio (Call SID: ${result.sid})`
      };
    } catch (err: any) {
      const callLog: CallLog = {
        id: logId,
        leadId: params.leadId,
        userId: params.userId,
        phoneNumber: formatted,
        purpose: params.purpose,
        status: 'FAILED',
        durationSeconds: 0,
        startedAt: now,
        endedAt: now,
        notes: `Call provider error: ${err.message}`,
        createdAt: now
      };
      return {
        success: false,
        callLog,
        message: `Call failed: ${err.message}`
      };
    }
  }
}

export const voiceProvider = new TwilioVoiceProvider();
