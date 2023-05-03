const defaultConfig = {
  branchVars: ["type", "ticketId"],
  messageTemplate: "{{type}}: [{{ticketId}}] {{message}}",
  separator: "/",
  useConventionalTypes: true,
  typesMap: {
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
  type: (value) => defaultConfig.typesMap[value] ?? value
}

module.exports = {
  defaultConfig,
  varAdapters
}