import {useState, useEffect, useCallback} from 'react';

type UseInfiniteLoadProps = {
  apiUrl: string;
  tokenKey: string;
};

type ApiResponse = {
  data: any[]; // Remplacez `any` par le type de données spécifique que votre API renvoie
  nextToken: string | null;
};

type UseInfiniteLoadReturn = {
  data: any[]; // Remplacez `any` par le type de données spécifique que votre API renvoie
  isLoading: boolean;
  error: Error | null;
};

const useInfiniteLoad = ({
  apiUrl,
  tokenKey,
}: UseInfiniteLoadProps): UseInfiniteLoadReturn => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const loadMore = useCallback(() => {
    if (isLoading || token === null) {
      return;
    }

    setIsLoading(true);
    fetch(`${apiUrl}?${tokenKey}=${token}`)
      .then(response => response.json())
      .then((result: ApiResponse) => {
        setData(prevData => [...prevData, ...result.data]);
        setToken(result.nextToken);
        setIsLoading(false);

        // Si un nextToken est disponible, rappeler loadMore
        if (result.nextToken) {
          loadMore();
        }
      })
      .catch((err: Error) => {
        setError(err);
        setIsLoading(false);
      });
  }, [apiUrl, token, tokenKey, isLoading]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return {data, isLoading, error, loadMore};
};

export default useInfiniteLoad;
