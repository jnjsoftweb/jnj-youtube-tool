import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { oauth2Client } from '@/service/youtubeService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  const token = searchParams.get('token');

  if (!token || !channelId) {
    return NextResponse.json(
      { error: 'Access token 또는 channelId가 없습니다.' },
      { status: 400 }
    );
  }

  oauth2Client.setCredentials({ access_token: token });

  const youtube = google.youtube('v3');
  const response = await youtube.playlists.list({
    part: 'snippet',
    channelId: channelId,
    maxResults: 25, // 필요한 경우 결과 수 조정
    auth: oauth2Client,
  });

  return NextResponse.json(response.data);
}
