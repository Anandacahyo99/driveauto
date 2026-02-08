// lib/gdrive.ts
import { google } from "googleapis";

// Debug: Cek apakah variabel masuk (Hapus setelah berhasil!)
console.log("CLIENT_ID ada:", !!process.env.GDRIVE_CLIENT_ID);
console.log("REFRESH_TOKEN ada:", !!process.env.GDRIVE_REFRESH_TOKEN);

const oauth2Client = new google.auth.OAuth2(
  process.env.GDRIVE_CLIENT_ID,
  process.env.GDRIVE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GDRIVE_REFRESH_TOKEN,
});

export const drive = google.drive({ version: "v3", auth: oauth2Client });