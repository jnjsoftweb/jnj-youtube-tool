import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');
  const apiKey = process.env.GOOGLE_API_KEY; // 서버 환경 변수에서 API 키 가져오기

  if (!apiKey || !playlistId) {
    return NextResponse.json(
      { error: 'API 키 또는 playlistId가 없습니다.' },
      { status: 400 }
    );
  }

  const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=25&key=${apiKey}`;
  console.log('Request URL:', url); // 요청 URL 출력

  const response = await fetch(url);
  console.log('response: ', response);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('YouTube API Error:', errorData); // 에러 데이터 출력
    return NextResponse.json(
      { error: 'YouTube API 요청 실패', details: errorData },
      { status: response.status }
    );
  }

  const data = await response.json();
  console.log('Response Data:', data); // 응답 데이터 출력
  return NextResponse.json(data.items || []); // 동영상 목록 반환
}
