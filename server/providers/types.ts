// Provider Abstraction Layer for Telephony, Messaging, Email, and Calendar

export interface CallLog {
  id: string;
  leadId?: string;
  userId: string;
  providerCallId?: string;
  phoneNumber: string;
  purpose?: string;
  status: 'QUEUED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'BUSY' | 'NO_ANSWER' | 'FAILED' | 'CONFIG_REQUIRED';
  durationSeconds: number;
  startedAt: string;
  endedAt?: string;
  recordingUrl?: string;
  transcription?: string;
  notes?: string;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  leadId?: string;
  userId: string;
  recipient: string;
  subject: string;
  body: string;
  providerMessageId?: string;
  status: 'SENT' | 'DELIVERED' | 'BOUNCED' | 'FAILED' | 'CONFIG_REQUIRED';
  sentAt: string;
}

export interface MessageLog {
  id: string;
  leadId?: string;
  userId: string;
  channel: 'WHATSAPP' | 'SMS';
  recipient: string;
  content: string;
  providerMessageId?: string;
  optInStatus: 'OPTED_IN' | 'OPTED_OUT' | 'UNKNOWN';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'CONFIG_REQUIRED';
  sentAt: string;
}

export interface CalendarEvent {
  id: string;
  leadId?: string;
  userId: string;
  companyName: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  attendees: string[];
  calendarEventId?: string;
  htmlLink?: string;
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  createdAt: string;
}

// 1. Voice Provider Interface
export interface VoiceProvider {
  initiateCall(params: {
    leadId?: string;
    userId: string;
    phoneNumber: string;
    purpose?: string;
    script?: string;
  }): Promise<{
    success: boolean;
    callLog: CallLog;
    message: string;
  }>;
}

// 2. Email Provider Interface
export interface EmailProvider {
  sendEmail(params: {
    leadId?: string;
    userId: string;
    to: string;
    subject: string;
    body: string;
  }): Promise<{
    success: boolean;
    emailLog: EmailLog;
    message: string;
  }>;
}

// 3. WhatsApp Provider Interface
export interface WhatsAppProvider {
  sendMessage(params: {
    leadId?: string;
    userId: string;
    to: string;
    message: string;
    optInStatus?: 'OPTED_IN' | 'OPTED_OUT' | 'UNKNOWN';
  }): Promise<{
    success: boolean;
    messageLog: MessageLog;
    message: string;
  }>;
}

// 4. SMS Provider Interface
export interface MessagingProvider {
  sendSMS(params: {
    leadId?: string;
    userId: string;
    to: string;
    text: string;
  }): Promise<{
    success: boolean;
    messageLog: MessageLog;
    message: string;
  }>;
}

// 5. Calendar Provider Interface
export interface CalendarProvider {
  createEvent(params: {
    leadId?: string;
    userId: string;
    companyName: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    timezone?: string;
    attendees: string[];
    location?: string;
  }): Promise<{
    success: boolean;
    calendarEvent: CalendarEvent;
    message: string;
  }>;
}
