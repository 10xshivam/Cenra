"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleUserProfile = void 0;
const getGoogleUserProfile = async (code) => {
    try {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            }),
        });
        const tokens = await tokenResponse.json();
        if (!tokenResponse.ok) {
            console.error("Failed to fetch token:", tokens);
            return null;
        }
        const profileResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });
        const profile = await profileResponse.json();
        if (!profileResponse.ok) {
            console.error("Failed to fetch profile:", profile);
            return null;
        }
        return profile;
    }
    catch (error) {
        console.error("Error in getGoogleUserProfile:", error);
        return null;
    }
};
exports.getGoogleUserProfile = getGoogleUserProfile;
