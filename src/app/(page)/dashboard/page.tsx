'use client'; // 클라이언트 컴포넌트로 변환

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardFooter } from '@/components/ui/card'; // shadcn에서 Card 컴포넌트 가져오기
import { Button } from '@/components/ui/button'; // shadcn에서 Button 컴포넌트 가져오기

export default function Dashboard() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [expandedChannelId, setExpandedChannelId] = useState<string | null>(
    null
  );
  const [playlists, setPlaylists] = useState<{ [key: string]: any[] }>({});
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const tokenCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('youtube_token='))
      ?.split('=')[1];

    if (!tokenCookie) {
      setLoading(false);
      return;
    }

    setToken(tokenCookie);

    const fetchChannels = async () => {
      try {
        const response = await fetch(`/api/youtube?token=${tokenCookie}`);
        const data = await response.json();
        setChannels(data.items);
      } catch (err) {
        setError('채널 정보를 가져오는 데 실패했습니다.');
        console.error('채널 정보 가져오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const fetchPlaylists = async (channelId: string) => {
    try {
      const response = await fetch(
        `/api/youtube/playlists?channelId=${channelId}`
      );
      const data = await response.json();
      console.log('Fetched Playlists:', data); // API 응답 확인
      return data.items ? data.items : data; // items가 있으면 data.items를, 없으면 data를 반환
    } catch (err) {
      console.error('재생목록 가져오기 실패:', err);
      return [];
    }
  };

  const handleFetchPlaylists = async (channelId: string) => {
    const fetchedPlaylists = await fetchPlaylists(channelId);
    console.log('handleFetchPlaylists Fetched Playlists:', fetchedPlaylists); // 재생목록 확인
    setPlaylists((prev) => ({ ...prev, [channelId]: fetchedPlaylists }));
    return fetchedPlaylists; // fetchedPlaylists 반환
  };

  const handleFetchVideos = async (playlistId: string) => {
    setVideos([]); // 이전 동영상 목록 초기화
    const response = await fetch(
      `/api/youtube/playlistItems?playlistId=${playlistId}`
    );
    if (!response.ok) {
      console.error('동영상 목록 가져오기 실패:', response.statusText);
      return [];
    }
    const data = await response.json();
    setVideos(data); // 동영상 목록 업데이트
  };

  const handleLogout = () => {
    document.cookie =
      'youtube_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/auth/google'; // 로그인 페이지로 리다이렉션
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!token) {
    return (
      <div>
        <h1>인증이 필요합니다</h1>
        <a href="/auth/google">Google로 로그인</a>
      </div>
    );
  }

  return (
    <div>
      <h1>구독 채널 목록</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <Card
            key={channel.id}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <h2>{channel.snippet.title}</h2>
            </CardHeader>
            <div>
              <img
                src={channel.snippet.thumbnails.default.url}
                alt={channel.snippet.title}
                className="w-full h-auto"
              />
            </div>
            <CardFooter>
              <Button
                onClick={() =>
                  setExpandedChannelId(
                    expandedChannelId === channel.id ? null : channel.id
                  )
                }
              >
                {expandedChannelId === channel.id
                  ? '상세 정보 숨기기'
                  : '상세 정보 보기'}
              </Button>
              {expandedChannelId === channel.id && (
                <div>
                  <p>Channel ID: {channel.id}</p>
                  <p>Description: {channel.snippet.description}</p>
                </div>
              )}
              <Button
                onClick={async () => {
                  const channelId = channel.snippet.resourceId.channelId;
                  // const channelId = 'UCcfz-8gGDYJfaRHYD7kkQpw';
                  const fetchedPlaylists = await handleFetchPlaylists(
                    channelId
                  );
                  console.log(
                    'Fetched Playlists for channel:',
                    fetchedPlaylists
                  ); // 재생목록 확인
                }}
              >
                재생목록
              </Button>
            </CardFooter>

            {/* 재생목록을 해당 채널 카드 아래에 표시 */}
            {playlists[channel.snippet.resourceId.channelId] && (
              <ul>
                {playlists[channel.snippet.resourceId.channelId].map(
                  (playlist) => (
                    <li key={playlist.id}>
                      <div>
                        {playlist.snippet.title}
                        <Button
                          onClick={() => {
                            setSelectedPlaylist(playlist);
                            setExpandedPlaylistId(
                              expandedPlaylistId === playlist.id
                                ? null
                                : playlist.id
                            );
                            setVideos([]); // 동영상 목록 초기화
                          }}
                        >
                          상세정보
                        </Button>
                        <Button
                          onClick={async () => {
                            setSelectedPlaylist(playlist);
                            await handleFetchVideos(playlist.id);
                            setExpandedPlaylistId(
                              expandedPlaylistId === playlist.id
                                ? null
                                : playlist.id
                            );
                          }}
                        >
                          동영상목록
                        </Button>
                      </div>

                      {/* 선택된 재생목록의 상세정보 표시 */}
                      {selectedPlaylist?.id === playlist.id && (
                        <div>
                          <p>재생목록 ID: {playlist.id}</p>
                          <p>설명: {playlist.snippet.description}</p>
                        </div>
                      )}

                      {/* 동영상 목록 아코디언 표시 */}
                      {expandedPlaylistId === playlist.id &&
                        videos.length > 0 && (
                          <ul>
                            {videos.map((video) => (
                              <li key={video.id}>
                                <img
                                  src={
                                    video.snippet.thumbnails?.default?.url ||
                                    '/default-thumbnail.jpg'
                                  }
                                  alt={video.snippet.title}
                                />
                                <p>{video.snippet.title}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  )
                )}
              </ul>
            )}
          </Card>
        ))}
      </div>
      <Button onClick={handleLogout}>로그아웃</Button>
    </div>
  );
}

// fetchVideos 함수 구현
const fetchVideos = async (playlistId: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // 환경 변수에서 API 키 가져오기
  const response = await fetch(
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=25&key=${apiKey}`
  );
  const data = await response.json();
  return data.items || []; // 동영상 목록 반환, 기본값으로 빈 배열 반환
};
