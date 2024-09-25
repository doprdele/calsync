const API_BASE_URL = "https://www.googleapis.com/calendar/v3";

export interface IGetCalendarEventsParams {
  /** Breakup recurring events into instances */
  singleEvents: boolean;
  /** ISO Date string */
  timeMin: Date;
  /** ISO Date string */
  timeMax: Date;
  /** Number of events to return */
  maxResults: number;
  /** Sort events by startTime or updated (last modification time) */
  orderBy: "startTime" | "updated";
}

import { GoogleAPI } from "https://deno.land/x/google_deno_integration@v1.1/mod.ts";


export class GoogleCalendarClient {
  #calendarId: string;
  #serviceAccountKey: { client_email: string, private_key: string };
  #client: GoogleAPI;

  constructor({ calendarId, serviceAccountKeyFile }: { calendarId: string; serviceAccountKeyFile: string }) {
    this.#calendarId = calendarId;
    this.#serviceAccountKey = JSON.parse(Deno.readTextFileSync(serviceAccountKeyFile));
    this.#client = new GoogleAPI({
      email: this.#serviceAccountKey.client_email,
      scope:  ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.readonly"],
      key: this.#serviceAccountKey.private_key,
    });
  }

  public async getEvents(
    { singleEvents, timeMax, timeMin, maxResults, orderBy }: IGetCalendarEventsParams,
  ) {
    try {
      const calendarRequestParams = {
        singleEvents: singleEvents.toString(),
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: `${maxResults}`,
        orderBy,
      };
      const calendarResponse = await this.#client.get(
        `${API_BASE_URL}/calendars/${this.#calendarId}/events?${
          (new URLSearchParams(calendarRequestParams)).toString()
        }`,
      );

      return calendarResponse;
    } catch (e) {
      console.error(
        `Error getting events from Google Calendar API.`,
      );
      throw e;
    }
  }
}
