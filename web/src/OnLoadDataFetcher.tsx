import React, { useState, useEffect } from "react";

function useAuthenticatedCall({
  url,
  accessToken,
}: {
  url: string;
  accessToken: string;
}): { data: unknown; error: string | null } {
  const [data, setData] = useState<unknown>({}); // return value from the request
  const [error, setError] = useState<string | null>(null); // an error message for failed requests
  const [shouldFetch, setShouldFetch] = useState(true); // an indicator of if a fetch should be started
  const [fetching, setFetching] = useState(false); // an indication of if a fetch is in progress
  const [lastAccessToken, setLastAccessToken] = useState("");
  useEffect((): void => {
    const makeAsyncFetchCall = async (): Promise<void> => {
      setFetching(true);
      // setShouldFetch(false);

      const headers: HeadersInit = {};
      try {
        if (accessToken) {
          // if there is an access token send it as a Bearer token in the Authorization header.
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const response = await fetch(url, { headers });
        if (response.ok) {
          // handle the successful response
          const data = await response.json();
          setData(data);
          return;
        }

        if (response.status === 401) {
          // is the response is unauthorized execute the auth failure callback.
          try {
            const body = (await response.json()) as {
              code: string;
              message: string;
            };
            setData(body);
            return;
          } catch (e) {
            console.error(e);
            setError(JSON.stringify(e));
          }
          return;
        }

        setError(`${response.status} - ${response.statusText}`);
        return;
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        // setShouldFetch(false);
        setFetching(false);
      }
    };

    if (!fetching && accessToken !== lastAccessToken) {
      makeAsyncFetchCall();
      setLastAccessToken(accessToken);
    }
  }, [
    setData,
    setError,
    fetching,
    setFetching,
    url,
    accessToken,
    lastAccessToken,
  ]);

  return {
    data,
    error,
  };
}

export function OnLoadDataFetchAndDisplay({
  url,
  accessToken,
}: {
  url: string;
  accessToken: string;
}): JSX.Element {
  const { data, error } = useAuthenticatedCall({ url, accessToken });
  return (
    <div className="dataFetchingSection">
      <h2 className="dataFetcher--heading">{url}</h2>
      <p>{error ? error : JSON.stringify(data)}</p>
    </div>
  );
}

//https://hire.lever.co/signatures/9435cba3-2e80-4767-9cd7-112fdfbb26e1?sigId=ba24f179-2f18-418c-abcd-8f72ddc10c91&documentType=offer
