import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

import { oauth2Client } from '@/service/youtubeService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: '인증 코드가 없습니다.' },
      { status: 400 }
    );
  }

  try {
    const { tokens } = await oauth2Client.getToken(code); // Google에서 토큰 가져오기
    const token = tokens.access_token;
    const cookieStore = cookies();
    cookieStore.set('youtube_token', token || '', { path: '/' }); // 쿠키 설정

    const redirectUrl = '/dashboard'; // 상대 경로에서 절대 경로로 변경
    return NextResponse.redirect(new URL(redirectUrl, request.url)); // 절대 URL 사용
  } catch (error) {
    console.error('인증 오류:', error);
    return NextResponse.json(
      { error: '인증 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
