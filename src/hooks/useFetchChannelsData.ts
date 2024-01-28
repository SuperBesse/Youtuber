import {Channel} from '../data/channel';
import {useState, useEffect, useCallback} from 'react';

type useFetchChannelsDataProps = {
  apiUrl: string;
  part: string;
  mine: boolean;
  maxResults: number;
  accessToken: string;
};

type ApiResponse = {
  items: Channel[];
  nextPageToken: string | null;
};

type useFetchChannelsDataReturn = {
  data: Channel[];
  isLoading: boolean;
  error: Error | null;
};

const useFetchChannelsData = ({
  apiUrl,
  part,
  mine,
  maxResults,
  accessToken,
}: useFetchChannelsDataProps): useFetchChannelsDataReturn => {
  const [data, setData] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const getChannelsUrl = useCallback(() => {
    if (nextToken) {
      return `${apiUrl}?part=${part}&mine=${mine}&maxResults=${maxResults}&pageToken=${nextToken}`;
    } else {
      return `${apiUrl}?part=${part}&mine=${mine}&maxResults=${maxResults}`;
    }
  }, [apiUrl, maxResults, mine, nextToken, part]);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    fetch(getChannelsUrl(), {
      headers: {Authorization: `Bearer ${accessToken}`},
    })
      .then(response => response.json())
      .then((result: ApiResponse) => {
        setData(prevData => [...prevData, ...result.items]);
        setNextToken(prev =>
          prev !== result.nextPageToken ? result.nextPageToken : null,
        );
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

  useEffect(() => {
    if (nextToken !== undefined && nextToken !== null) {
      loadMore();
    } else {
      setIsLoading(false);
    }
  }, [loadMore, nextToken]);

  return {data, isLoading, error};
};

export default useFetchChannelsData;
