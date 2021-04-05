import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import { DataFetchAndDisplay } from "./DataFetcher";

const baseurl = "http://localhost:8080";
const publicPath = "public";
const privatePath = "private";
const stepUpEndpoint = "stepUpMfaEndpoint";
function AuthedThing(): JSX.Element {
  const [accessToken, setAccessToken] = useState("");
  const {
    loginWithRedirect,
    isAuthenticated,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  async function getAnAccessToken() {
    const newAccessToken = await getAccessTokenSilently();
    console.log("Setting accesstoken", newAccessToken === accessToken);
    setAccessToken(newAccessToken);
  }

  useEffect(() => {
    if (isAuthenticated) {
      getAnAccessToken();
    }
  }, [isAuthenticated, getAccessTokenSilently, setAccessToken]);

  if (isAuthenticated) {
    return (
      <div>
        <h1>Logged In: {user.name}</h1>
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Logout
        </button>
        <button onClick={getAnAccessToken}>GetAccessToken</button>
        <div>
          <textarea value={accessToken} />
        </div>
        <DataFetchAndDisplay url={`${baseurl}/${publicPath}`} />
        <DataFetchAndDisplay url={`${baseurl}/${privatePath}`} />
        <DataFetchAndDisplay url={`${baseurl}/${stepUpEndpoint}`} />
      </div>
    );
  }
  return (
    <div>
      <h1>Not Logged in</h1>
      <button
        onClick={() => loginWithRedirect({ scope: "version1 openid profile" })}
      >
        Login
      </button>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Auth0Provider
        domain="kleeut-blastfurnace.au.auth0.com"
        clientId="zf8tN3Q290OkKxakrABrxeDpWTjks1Rp"
        redirectUri={window.location.origin}
        audience="BlastfurnaceAPI"
        scope="fish:sticks"
      >
        <header className="App-header">
          <AuthedThing />
        </header>
      </Auth0Provider>
    </div>
  );
}

export default App;
