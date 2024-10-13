import { Button } from '@/components/ui/button';

const PlaylistSection = ({
  playlists,
  expandedPlaylistId,
  setExpandedPlaylistId,
  handleFetchVideos,
  setSelectedPlaylist,
  videos,
}) => {
  return (
    <>
      {Object.keys(playlists).map((channelId) => (
        <ul key={channelId}>
          {playlists[channelId].map((playlist) => (
            <li key={playlist.id}>
              <div>
                {playlist.snippet.title}
                <Button
                  onClick={() => {
                    setSelectedPlaylist(playlist);
                    setExpandedPlaylistId(
                      expandedPlaylistId === playlist.id ? null : playlist.id
                    );
                  }}
                >
                  상세정보
                </Button>
                <Button
                  onClick={async () => {
                    setSelectedPlaylist(playlist);
                    await handleFetchVideos(playlist.id);
                    setExpandedPlaylistId(
                      expandedPlaylistId === playlist.id ? null : playlist.id
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
              {expandedPlaylistId === playlist.id && videos.length > 0 && (
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
          ))}
        </ul>
      ))}
    </>
  );
};

export default PlaylistSection;
