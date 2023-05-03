const fs = require('fs');
const branchName = require('branch-name');
const {
  defaultConfig,
  varAdapters
} = require("./constants.js");
const findPackage = require('find-package-json');

const getConfigFromPackage = () => new Promise((res, rej) => {
  try {
    const finder = findPackage(__dirname);
    const package = finder.next().value;
    res(package.commitContext ?? {});
  } catch (error) {
    rej(error);
  }
});

const getFullConfig = (providedConfig = {}) => ({
  ...defaultConfig,
  ...providedConfig
})

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

const getVarsFromBranchName = (branchName, config) => branchName.split(config.separator);

const replaceTemplateVar = (templateMessage, targetVar, value) => templateMessage.replace(`{{${targetVar}}}`, value); 

const getMessageWithVars = (message, vars, config) => {
  let commitMessage = replaceTemplateVar(config.messageTemplate, "message", message);
  config.branchVars.forEach((varName, index) => {
    const getVarValue = varAdapters[varName] ?? varAdapters.default; 
    commitMessage = replaceTemplateVar(commitMessage, varName, getVarValue(vars[index]));
  });
  return commitMessage;
}

module.exports = {
  getConfigFromPackage,
  getFullConfig,
  getMessageWithVars,
  replaceTemplateVar,
  getVarsFromBranchName,
  saveMessageFile,
  getMessageFromFile,
  getBranchName,
  throwError
}