import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class EventoServer {

    constructor() {
        const filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(filename);

        this.SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
        this.TOKEN_PATH = path.join(__dirname, '..', '..', 'token.json');
        this.CREDENTIALS_PATH = path.join(__dirname, '..', '..', 'credentials.json');
    }

    async loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(this.TOKEN_PATH);
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    async saveCredentials(client) {
        const content = await fs.readFile(this.CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(this.TOKEN_PATH, payload);
    }

    async authorize() {
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: this.SCOPES,
            keyfilePath: this.CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }

    async listEvents(nextSaturday, nextMonday) {
        const auth = await this.authorize();
        const calendar = google.calendar({ version: 'v3', auth });
    
        return new Promise((resolve, reject) => {
            calendar.events.list({
                calendarId: 'primary',
                timeMin: nextSaturday,
                timeMax: nextMonday,
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            }, (err, res) => {
                if (err) {
                    console.error('The API returned an error: ' + err);
                    return reject(err);
                }
                const events = res.data.items;
                if (events.length) {
                    console.log(`Upcoming ${events.length} events`);
                    resolve(events);
                } else {
                    console.log('No upcoming events found.');
                    resolve([]);
                }
            });
        });
    }
}

export default new EventoServer();