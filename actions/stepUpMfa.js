function extractScopesFromEvent(event) {
  return event.transaction ? event.transaction.requested_scopes || "" : "";
}

exports.onExecutePostLogin = async (event, api) => {
  const scopes = extractScopesFromEvent(event);
  if (scopes.includes("mfa:required")) {
    console.log("Requiring MFA");
    // Force the user to do a Guardian MFA.
    api.multifactor.enable("guardian");
    // Set to custom claim for when the MFA is complete.
    api.accessToken.setCustomClaim(`https://kleeut.com:mfaTime`, Date.now());
  }
};
