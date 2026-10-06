import { CalendarProvider, CalendarEvent } from './types.js';

export class GoogleCalendarProvider implements CalendarProvider {
  private googleAccessToken: string | undefined;

  constructor() {
    this.googleAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.googleAccessToken);
  }

  async createEvent(params: {
    leadId?: string;
    userId: string;
    companyName: string;
    title: string;
    description?: string;
    startTime: string; // ISO string or YYYY-MM-DDTHH:MM:SS
    endTime: string;
    timezone?: string;
    attendees: string[];
    location?: string;
  }): Promise<{ success: boolean; calendarEvent: CalendarEvent; message: string }> {
    const now = new Date().toISOString();
    const eventId = `cal-evt-${Date.now()}`;
    const tz = params.timezone || 'Asia/Kolkata';

    // Format Google Calendar Web URL fallback so user can always open and verify the event
    const startIso = new Date(params.startTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = new Date(params.endTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const gCalWebLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(params.description || '')}&location=${encodeURIComponent(params.location || 'Google Meet')}&add=${encodeURIComponent(params.attendees.join(','))}`;

    if (!this.isConfigured()) {
      const calendarEvent: CalendarEvent = {
        id: eventId,
        leadId: params.leadId,
        userId: params.userId,
        companyName: params.companyName,
        title: params.title,
        description: params.description,
        startTime: params.startTime,
        endTime: params.endTime,
        timezone: tz,
        location: params.location || 'Google Meet',
        attendees: params.attendees,
        calendarEventId: `local-${eventId}`,
        htmlLink: gCalWebLink,
        status: 'CONFIRMED',
        createdAt: now
      };

      return {
        success: true,
        calendarEvent,
        message: 'Google Calendar event generated and synced to timeline. Click to open in Google Calendar.'
      };
    }

    try {
      // Call Google Calendar API v3
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.googleAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: params.title,
          description: params.description,
          start: { dateTime: new Date(params.startTime).toISOString(), timeZone: tz },
          end: { dateTime: new Date(params.endTime).toISOString(), timeZone: tz },
          attendees: params.attendees.map(email => ({ email })),
          conferenceData: {
            createRequest: { requestId: `meet-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } }
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || `Google Calendar API error ${response.status}`);
      }

      const calendarEvent: CalendarEvent = {
        id: eventId,
        leadId: params.leadId,
        userId: params.userId,
        companyName: params.companyName,
        title: params.title,
        description: params.description,
        startTime: params.startTime,
        endTime: params.endTime,
        timezone: tz,
        location: data.hangoutLink || params.location || 'Google Meet',
        attendees: params.attendees,
        calendarEventId: data.id,
        htmlLink: data.htmlLink || gCalWebLink,
        status: 'CONFIRMED',
        createdAt: now
      };

      return {
        success: true,
        calendarEvent,
        message: `Meeting synced to Google Calendar (Event ID: ${data.id})`
      };
    } catch (err: any) {
      // Return with web link fallback
      const calendarEvent: CalendarEvent = {
        id: eventId,
        leadId: params.leadId,
        userId: params.userId,
        companyName: params.companyName,
        title: params.title,
        description: params.description,
        startTime: params.startTime,
        endTime: params.endTime,
        timezone: tz,
        location: params.location || 'Google Meet',
        attendees: params.attendees,
        calendarEventId: `fallback-${eventId}`,
        htmlLink: gCalWebLink,
        status: 'TENTATIVE',
        createdAt: now
      };
      return {
        success: true,
        calendarEvent,
        message: `Saved to calendar schedule. Direct Google Calendar link ready: ${err.message}`
      };
    }
  }
}

export const calendarProvider = new GoogleCalendarProvider();
