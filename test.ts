import { GoogleAPI } from "https://deno.land/x/google_deno_integration@v1.1/mod.ts";

const serviceAccountKey = JSON.parse(Deno.readTextFileSync(".service.json"));
// Create the auth client
const client = new GoogleAPI({
  email: serviceAccountKey.client_email,
  scope: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.readonly"],
  key: serviceAccountKey.private_key,
});
// List all calendars
async function listCalendars() {
  console.log(
    await client.get(
      "https://www.googleapis.com/calendar/v3/calendars/g6v807dat650qi09ig4317muso@group.calendar.google.com/events",
    ),
  );
}
// Run the function
await listCalendars();
