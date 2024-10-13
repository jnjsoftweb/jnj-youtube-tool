import { NextResponse } from 'next/server';
import { fetchAll } from '@/utils/api'; // api.ts에서 함수 가져오기

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');

  const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`;

  try {
    const allItems = await fetchAll(url); // 모든 playlistItems 가져오기
    return NextResponse.json(allItems); // 모든 동영상 목록 반환
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return NextResponse.json(
      { error: 'YouTube API 요청 실패', details: error.message },
      { status: 500 }
    );
  }
}
