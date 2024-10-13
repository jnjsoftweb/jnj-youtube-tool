import { google } from 'googleapis';

const youtube = google.youtube('v3');

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function getSubscribedChannels(token: string) {
  if (!token) {
    throw new Error('Access token이 없습니다.'); // 토큰이 없을 경우 에러 처리
  }

  oauth2Client.setCredentials({
    access_token: token,
    // refresh_token: /* refresh token이 있다면 여기에 추가 */,
  });

  const response = await youtube.subscriptions.list({
    part: ['snippet'], // 'string' 대신 'string[]' 형식으로 변경
    mine: true,
    auth: oauth2Client,
  });

  return response.data;
}
