import { NextResponse } from 'next/server';
import { fetchAll } from '@/utils/api'; // api.ts에서 함수 가져오기

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (!channelId) {
    return NextResponse.json(
      { error: 'channelId가 없습니다.' },
      { status: 400 }
    );
  }

  const url = `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=25`;

  try {
    const allPlaylists = await fetchAll(url); // 모든 playlists 가져오기
    return NextResponse.json(allPlaylists); // 모든 재생목록 반환
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json(
      { error: 'YouTube API 요청 실패', details: error.message },
      { status: 500 }
    );
  }
}
