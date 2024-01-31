import {SearchResult} from '../data/searchResults';
import {Channel} from '../data/channel';
import {useState, useEffect, useCallback} from 'react';

type useFetchChannelVideoDataProps = {
  apiUrl: string;
  part: string;
  channelId: string;
  maxResults: number;
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
  items: SearchResult[];
};

type useFetchChannelVideoDataReturn = {
  data: SearchResult[];
  isLoading: boolean;
  error: Error | null;
};

const useFetchChannelVideo = ({
  apiUrl,
  part,
  maxResults,
  accessToken,
  channelId,
}: useFetchChannelVideoDataProps): useFetchChannelVideoDataReturn => {
  const [data, setData] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const getChannelsUrl = useCallback(() => {
    if (nextToken) {
      return `${apiUrl}?part=${part}&maxResults=${maxResults}&pageToken=${nextToken}&channelId=${channelId}&order=date`;
    } else {
      return `${apiUrl}?part=${part}&maxResults=${maxResults}&channelId=${channelId}&order=date`;
    }
  }, [apiUrl, channelId, maxResults, nextToken, part]);

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
        setData(prevData => [...prevData, ...result.items]);
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
    if (data.length === 0) {
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

  return {data, isLoading, error};
};

export default useFetchChannelVideo;
