import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";

function useAuthenticatedCall({
  url,
}: {
  url: string;
}): { data: unknown; error: string | null; startRequest: () => void } {
  const { loginWithRedirect, getAccessTokenSilently } = useAuth0(); // get needed actions from the Auth0 sdk
  const [data, setData] = useState<unknown>({}); // return value from the request
  const [error, setError] = useState<string | null>(null); // an error message for failed requests
  const [shouldFetch, setShouldFetch] = useState(false); // an indicator of if a fetch should be started
  const [fetching, setFetching] = useState(false); // an indication of if a fetch is in progress

  useEffect((): void => {
    const makeAsyncFetchCall = async (): Promise<void> => {
      setFetching(true);
      setShouldFetch(false);

      const accessToken = await getAccessTokenSilently();
      const headers: HeadersInit = {};
      try {
        if (accessToken) {
          // if there is an access token send it as a Bearer token in the Authorization header.
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const response = await fetch(url, { headers });
        if (!response.ok) {
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
            if (body.code === "mfaRequired") {
              loginWithRedirect({ scope: "mfa:required" }); // add additional scope
              return;
            }
          } catch (e) {}
          loginWithRedirect(); // use scope from initial login
          return;
        }

        setError(`${response.status} - ${response.statusText}`);
        return;
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setShouldFetch(false);
        setFetching(false);
      }
    };

    if (!fetching && shouldFetch) {
      makeAsyncFetchCall();
    }
  }, [
    setData,
    setError,
    shouldFetch,
    setShouldFetch,
    fetching,
    setFetching,
    url,
    getAccessTokenSilently,
    loginWithRedirect,
  ]);

  return {
    data,
    error,
    startRequest: () => setShouldFetch(true),
  };
}

export function DataFetchAndDisplay({ url }: { url: string }): JSX.Element {
  const { startRequest, data, error } = useAuthenticatedCall({ url });
  return (
    <div>
      <hr />
      <h2>{url}</h2>
      <button onClick={() => startRequest()}>Get Data</button>
      <p>{error ? error : JSON.stringify(data)}</p>
    </div>
  );
}
