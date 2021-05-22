// Auth0 Action
exports.onExecutePostLogin = async (event, api) => {
  const enabledMfa = event.user.app_metadata.guardian;
  if(!enabledMfa){
    // Require the user to do an MFA.
    api.multifactor.enable("guardian");
    // Update the user's metadata to represent that they've enabled MFA.
    api.user.setAppMetadata("guardian", true);
  }
};
