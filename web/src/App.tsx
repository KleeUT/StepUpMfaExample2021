import React, { useCallback, useEffect, useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import "./App.css";
// import { DataFetchAndDisplay } from "./DataFetcher";
import { OnLoadDataFetchAndDisplay } from "./OnLoadDataFetcher";

const baseurl = "http://localhost:8080";
const publicPath = "public";
const privatePath = "private";
const stepUpEndpoint = "stepUpMfaEndpoint";
// function AuthedThing(): JSX.Element {
//   const [accessToken, setAccessToken] = useState("");
//   const {
//     loginWithRedirect,
//     isAuthenticated,
//     logout,
//     user,
//     getAccessTokenSilently,
//   } = useAuth0();

//   async function getAnAccessToken() {
//     const newAccessToken = await getAccessTokenSilently();
//     console.log("Setting accesstoken", newAccessToken === accessToken);
//     setAccessToken(newAccessToken);
//   }

//   useEffect(() => {
//     if (isAuthenticated) {
//       getAnAccessToken();
//     }
//   }, [isAuthenticated, getAccessTokenSilently, setAccessToken]);

//   if (isAuthenticated) {
//     return (
//       <div>
//         <h1>Logged In: {user.name}</h1>
//         <button onClick={() => logout({ returnTo: window.location.origin })}>
//           Logout
//         </button>
//         <button onClick={getAnAccessToken}>GetAccessToken</button>
//         <div>
//           <textarea value={accessToken} />
//         </div>
//         <DataFetchAndDisplay url={`${baseurl}/${publicPath}`} />
//         <DataFetchAndDisplay url={`${baseurl}/${privatePath}`} />
//         <DataFetchAndDisplay url={`${baseurl}/${stepUpEndpoint}`} />
//       </div>
//     );
//   }
//   return (
//     <div>
//       <h1>Not Logged in</h1>
//       <button
//         onClick={() => loginWithRedirect({ scope: "version1 openid profile" })}
//       >
//         Login
//       </button>
//       <button onClick={() => logout({ returnTo: window.location.origin })}>
//         Logout
//       </button>
//     </div>
//   );
// }

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

  // const token = useCallback(async () => {
  //   const newAccessToken = await getAccessTokenSilently();
  //   console.log("Setting accesstoken", newAccessToken === accessToken);
  //   setAccessToken(newAccessToken);
  // }, [
  //   getAccessTokenSilently,
  //   setAccessToken,
  //   accessToken
  // ]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     token()
  //   }
  // }, [
  //   isAuthenticated,
  //   getAccessTokenSilently,
  //   setAccessToken,
  //   token
  // ]);

  // if (isAuthenticated) {
  return (
    <div>
      <h1>{isAuthenticated ? `Logged In: ${user.name}` : "Not Logged In"}</h1>
      <button
        onClick={() => loginWithRedirect({ scope: "version1 openid profile" })}
      >
        Login
      </button>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </button>
      <button onClick={getAnAccessToken}>GetAccessToken</button>
      <button
        onClick={() =>
          loginWithRedirect({ scope: "version1 openid profile mfa:required" })
        }
      >
        MFA Login
      </button>
      <div>
        <textarea value={accessToken} />
      </div>
      <OnLoadDataFetchAndDisplay
        url={`${baseurl}/${publicPath}`}
        accessToken={accessToken}
      />
      <OnLoadDataFetchAndDisplay
        url={`${baseurl}/${privatePath}`}
        accessToken={accessToken}
      />
      <OnLoadDataFetchAndDisplay
        url={`${baseurl}/${stepUpEndpoint}`}
        accessToken={accessToken}
      />
    </div>
  );
  // }
  // return (
  //   <div>
  //     <h1>Not Logged in</h1>
  // <button
  //   onClick={() => loginWithRedirect({ scope: "version1 openid profile" })}
  // >
  //   Login
  // </button>;
  //     <button onClick={() => logout({ returnTo: window.location.origin })}>
  //       Logout
  //     </button>
  //   </div>
  // );
}

function App() {
  return (
    <div className="App">
      <Auth0Provider
        domain="kleeut-stepup-example.au.auth0.com"
        clientId="RPY4q7p3tkVNrG5Kq5V0hqEojYhAMwzA"
        redirectUri={window.location.origin}
        audience="https://kleeut-stepup-example.au.auth0.com/api/v2/"
      >
        <header className="App-header">
          <AuthedThing />
        </header>
      </Auth0Provider>
    </div>
  );
}

export default App;
