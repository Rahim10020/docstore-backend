import { google } from 'googleapis';

export function getDrive() {
    // Récupère les credentials depuis la variable d'environnement Vercel
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/drive"],
    });

    return google.drive({ version: "v3", auth });
}