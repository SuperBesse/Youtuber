import {Video} from '../data/video';
import {useState, useEffect, useCallback} from 'react';

type useFetchVideoDataProps = {
  apiUrl: string;
  part: string;
  accessToken: string;
  videoId: string;
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
  items: Video[];
};

type useFetchVideoDataReturn = {
  data?: Video;
  isLoading: boolean;
  error: Error | null;
};

const useFetchVideo = ({
  apiUrl,
  part,
  accessToken,
  videoId,
}: useFetchVideoDataProps): useFetchVideoDataReturn => {
  const [data, setData] = useState<Video>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const getVideosUrl = useCallback(() => {
    return `${apiUrl}?part=${part}&id=${videoId}`;
  }, [apiUrl, part, videoId]);

  const loadVideo = useCallback(() => {
    setIsLoading(true);

    fetch(getVideosUrl(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ContentType: 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then((result: ApiResponse) => {
        if (result?.items.length === 1) {
          setData(result.items[0]);
        } else {
          setError(new Error());
          setIsLoading(false);
        }

        // setNextToken(prev =>
        //   prev !== result.nextPageToken ? result.nextPageToken : null,
        // );
      })
      .catch((err: Error) => {
        setError(err);
        setIsLoading(false);
      });
  }, [getVideosUrl, accessToken]);

  useEffect(() => {
    loadVideo();
  }, []);

  return {data, isLoading, error};
};

export default useFetchVideo;
