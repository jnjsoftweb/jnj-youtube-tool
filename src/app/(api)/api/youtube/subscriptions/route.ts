import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { oauth2Client } from '@/service/youtubeService'; // OAuth2 클라이언트 가져오기

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token'); // 요청에서 토큰 가져오기

  if (!token) {
    return NextResponse.json(
      { error: 'Access token이 없습니다.' },
      { status: 400 }
    );
  }

  oauth2Client.setCredentials({ access_token: token });

  const youtube = google.youtube('v3');
  try {
    const response = await youtube.subscriptions.list({
      part: 'snippet',
      mine: true,
      auth: oauth2Client,
    });

    return NextResponse.json(response.data); // 구독 목록 반환
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'YouTube API 요청 실패', details: error.message },
      { status: 500 }
    );
  }
}
