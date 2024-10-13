import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export async function getSubscribedChannels(pageToken?: string) {
  try {
    const response = await youtube.subscriptions.list({
      part: ['snippet'],
      mine: true,
      maxResults: 50,
      pageToken: pageToken,
    });

    return {
      channels: response.data.items?.map((item) => ({
        id: item.snippet?.resourceId?.channelId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnails: item.snippet?.thumbnails,
      })),
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error) {
    console.error('YouTube API 호출 중 오류 발생:', error);
    throw error;
  }
}
