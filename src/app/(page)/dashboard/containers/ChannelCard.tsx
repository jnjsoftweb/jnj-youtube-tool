import { Card, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ChannelCard = ({
  channel,
  onFetchPlaylists,
  expandedChannelId,
  setExpandedChannelId,
}) => {
  return (
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
            await onFetchPlaylists(channelId);
          }}
        >
          재생목록
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChannelCard;
