import {Channel} from '../data/channel';
import {useState, useEffect, useCallback} from 'react';

type useFetchChannelVideoDataProps = {
  apiUrl: string;
  part: string;
  channelId: string;
  accessToken: string;
};

type ApiResponse = {
  kind: string;
  etag: string;
  nextPageToken: string | null;
  prevPageToken: string | null;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Channel[];
};

type useFetchChannelVideoDataReturn = {
  channel?: Channel;
  isLoading: boolean;
  error: Error | null;
};

const useFetchChannelVideo = ({
  apiUrl,
  part,
  accessToken,
  channelId,
}: useFetchChannelVideoDataProps): useFetchChannelVideoDataReturn => {
  const [channel, setChannel] = useState<Channel | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const getChannelsUrl = useCallback(() => {
    if (nextToken) {
      return `${apiUrl}?part=${part}&pageToken=${nextToken}&id=${channelId}`;
    } else {
      return `${apiUrl}?part=${part}&id=${channelId}`;
    }
  }, [apiUrl, channelId, nextToken, part]);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    fetch(getChannelsUrl(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ContentType: 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then((result: ApiResponse) => {
        const foundChannel =
          result.items.length > 0 ? result.items[0] : undefined;
        setChannel(foundChannel);
        // setNextToken(prev =>
        //   prev !== result.nextPageToken ? result.nextPageToken : null,
        // );
      })
      .catch((err: Error) => {
        setError(err);
        setIsLoading(false);
      });
  }, [getChannelsUrl, accessToken]);

  useEffect(() => {
    if (!channel) {
      loadMore();
    }
  }, []);

  //   useEffect(() => {
  //     if (nextToken !== undefined && nextToken !== null) {
  //       loadMore();
  //     } else {
  //       setIsLoading(false);
  //     }
  //   }, [loadMore, nextToken]);

  return {channel, isLoading, error};
};

export default useFetchChannelVideo;
