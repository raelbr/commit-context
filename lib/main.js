const fs = require('fs');
const branchName = require('branch-name');

/**
 * Config
 * TODO: Get custom config from package.json
 */
const config = {
  branchVars: ["type", "ticketId"],
  messageTemplate: "{{type}}: [{{ticketId}}] {{message}}",
  separator: "/",
  useConventionalTypes: true,
  conventionalTypesMap: {
    feature: "feat",
    features: "feat",
    bug: "fix",
    bugs: "fix",
    bugfix: "fix",
    bugfixes: "fix",
    fixes: "fix",
  }
}

const varAdapters = {
  default: (value) => value,
  type: (value) => config.conventionalTypesMap[value] ?? value
}

/**
 * Helpers 
 */
const throwError = (message = "Unknown error happened") => {
  console.error(message);
  process.exit(1);
}

const getBranchName = () => branchName.get();

const getMessageFromFile = (fileUrl) => new Promise((res, rej) => {
  fs.readFile(fileUrl, 'utf8', (err, message) => {
  if (err) {
    rej("Error while trying to read commit message");
    return;
  }
  res(message);
})});

const saveMessageFile = (fileUrl, message) => new Promise((res, rej) => {
  fs.writeFile(fileUrl, message, {encoding:'utf8'}, (err) => {
  if (err) {
    rej("Error while trying to save commit message");
    return;
  }
  res();
})});

const getVarsFromBranchName = (branchName) => branchName.split(config.separator);

const replaceTemplateVar = (templateMessage, targetVar, value) => templateMessage.replace(`{{${targetVar}}}`, value); 

const getMessageWithVars = (message, vars) => {
  let commitMessage = replaceTemplateVar(config.messageTemplate, "message", message);
  config.branchVars.forEach((varName, index) => {
    const getVarValue = varAdapters[varName] ?? varAdapters.default; 
    commitMessage = replaceTemplateVar(commitMessage, varName, getVarValue(vars[index]));
  });
  return commitMessage;
}

/**
 * MAIN
 */
const main = async () => {
  try {
    
    // Get Commit Message:
    const messageFileUrl = process.argv[2];
    if (!messageFileUrl) {
      throwError("Couldn't find your commit message");
    }
    const message = await getMessageFromFile(messageFileUrl);

    // Get Branch Name:
    const branchName = await getBranchName();

    // Get variables from branch name:
    const vars = getVarsFromBranchName(branchName);

    // Save the new message:
    const parsedMessage = getMessageWithVars(message, vars);
    await saveMessageFile(messageFileUrl, parsedMessage);
    process.exit(0);

  } catch(error) {  
    throwError(error)
  }
}

module.exports = main;