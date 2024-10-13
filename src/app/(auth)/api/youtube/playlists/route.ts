import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  const apiKey = process.env.GOOGLE_API_KEY; // 환경 변수에서 API 키 가져오기

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: 'API 키 또는 channelId가 없습니다.' },
      { status: 400 }
    );
  }

  const youtube = google.youtube('v3');
  const response = await youtube.playlists.list({
    part: 'snippet',
    channelId: channelId,
    maxResults: 25, // 필요한 경우 결과 수 조정
    key: apiKey, // API 키 사용
  });

  //   console.log('response: ', response.data);

  return NextResponse.json(response.data);
}
