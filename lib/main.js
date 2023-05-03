const {
  getConfigFromPackage,
  getFullConfig,
  getMessageWithVars,
  getVarsFromBranchName,
  saveMessageFile,
  getMessageFromFile,
  getBranchName,
  throwError
} = require("./utils/helpers.js");

const main = async () => {
  try {
    // Get Config:
    const packageConfig = await getConfigFromPackage();
    const config = getFullConfig(packageConfig);
    
    // Get Commit Message:
    const messageFileUrl = process.argv[2];
    if (!messageFileUrl) {
      throwError("Couldn't find your commit message");
    }
    const message = await getMessageFromFile(messageFileUrl);

    // Get Branch Name:
    const branchName = await getBranchName();

    // Get variables from branch name:
    const vars = getVarsFromBranchName(branchName, config);

    // Save the new message:
    const parsedMessage = getMessageWithVars(message, vars, config);
    console.log(parsedMessage)
    await saveMessageFile(messageFileUrl, parsedMessage);
    process.exit(0);

  } catch(error) {  
    throwError(error)
  }
}

module.exports = main;