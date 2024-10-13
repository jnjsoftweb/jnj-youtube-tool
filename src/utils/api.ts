import { NextResponse } from 'next/server';

export async function fetchAll(url: string) {
  const apiKey = process.env.GOOGLE_API_KEY; // 서버 환경 변수에서 API 키 가져오기

  if (!apiKey) {
    throw new Error('API 키가 없습니다.');
  }

  let allItems = [];
  let nextPageToken = '';

  do {
    const requestUrl = nextPageToken
      ? `${url}&key=${apiKey}&pageToken=${nextPageToken}`
      : `${url}&key=${apiKey}`; // API 키 추가

    console.log('Request URL:', requestUrl); // 요청 URL 출력

    const response = await fetch(requestUrl);
    console.log('response: ', response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData); // 에러 데이터 출력
      throw new Error('YouTube API 요청 실패');
    }

    const data = await response.json();
    console.log('Response Data:', data); // 응답 데이터 출력

    allItems = allItems.concat(data.items); // 현재 페이지의 항목을 모두 추가
    nextPageToken = data.nextPageToken; // 다음 페이지 토큰 업데이트
  } while (nextPageToken); // 다음 페이지가 있을 때까지 반복

  return allItems; // 모든 동영상 목록 반환
}
