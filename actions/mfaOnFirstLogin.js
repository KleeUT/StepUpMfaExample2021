/** @type {PostLoginAction} */
module.exports = async (event, context) => {
  console.log("Stats - loginCount", event.stats.loginsCount);
    if(event.stats.loginsCount === 1) {
      return {
        command:{
          type:"multifactor",
          provider: "guardian" 
        }
      };
    }
    return {};
  };
  