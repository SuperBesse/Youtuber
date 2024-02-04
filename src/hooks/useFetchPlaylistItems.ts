import {PlaylistItem} from '../data/playlistItem';
import {useState, useEffect, useCallback} from 'react';

type useFetchPlaylistItemsDataProps = {
  apiUrl: string;
  part: string;
  playlistId: string;
  accessToken: string;
  maxResults: number;
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
  items: PlaylistItem[];
};

type useFetchPlaylistItemVideoDataReturn = {
  playlistItems: PlaylistItem[];
  isLoading: boolean;
  error: Error | null;
};

const useFetchPlaylistItemVideo = ({
  apiUrl,
  part,
  accessToken,
  playlistId,
  maxResults,
}: useFetchPlaylistItemsDataProps): useFetchPlaylistItemVideoDataReturn => {

  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);

  const getPlaylistItemsUrl = useCallback(() => {
    if (nextToken) {
      return `${apiUrl}?part=${part}&pageToken=${nextToken}&playlistId=${playlistId}&maxResults=${maxResults}`;
    } else {
      return `${apiUrl}?part=${part}&playlistId=${playlistId}&maxResults=${maxResults}`;
    }
  }, [nextToken, apiUrl, part, playlistId, maxResults]);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    fetch(getPlaylistItemsUrl(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ContentType: 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then((result: ApiResponse) => {
          setPlaylistItems(result.items);
        // setNextToken(prev =>
        //   prev !== result.nextPageToken ? result.nextPageToken : null,
        // );
      })
      .catch((err: Error) => {
        setError(err);
        setIsLoading(false);
      });
  }, [getPlaylistItemsUrl, accessToken]);

  useEffect(() => {
    if (playlistItems.length === 0) {
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

  return {playlistItems, isLoading, error};
};

export default useFetchPlaylistItemVideo;
