const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =process.env.REFRESH_TOKEN ;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function getAccessToken() {
    try {
        const { token } = await oAuth2Client.getAccessToken();
        console.log("✅ Access Token obtenido:", token);
    } catch (error) {
        console.error("❌ Error al obtener Access Token:", error.message);
    }
}

getAccessToken();
