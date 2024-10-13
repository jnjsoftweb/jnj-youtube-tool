import { NextResponse } from 'next/server';
import { oauth2Client } from '@/service/youtubeService';

export async function GET() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  });
  return NextResponse.redirect(authUrl);
}
