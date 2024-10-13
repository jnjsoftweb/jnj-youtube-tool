import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { oauth2Client } from '@/service/youtubeService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Access token이 없습니다.' },
      { status: 400 }
    );
  }

  oauth2Client.setCredentials({ access_token: token });

  const youtube = google.youtube('v3');
  const response = await youtube.subscriptions.list({
    part: 'snippet',
    mine: true,
    auth: oauth2Client,
  });

  return NextResponse.json(response.data);
}
