/** @type {PostLoginAction} */
module.exports = async (event, context) => {
  const scopes = event.actor.query.scope || "";
  const splitScopes = scopes.split(" ");

  if(splitScopes.includes("mfa:required")){
    return {
      accessToken: {
        customClaims:{
          "https://kleeut.com:mfaTime": Date.now(),
        }
      },
      command: {
        type: "multifactor",
        provider: "guardian"
      }
    };
  }
  
  const authMethods = (event.authentication || {}).methods || [];
  return {
    accessToken:{
      customClaims:{
          "https://kleeut.com:mfaTime":  (authMethods.filter(x => x.name === "mfa")[0] || {}).timestamp
      }
    }
  };
};
