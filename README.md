# commit-context
Gives context to commit messages from branch name

- Supports Git flow branch naming conventions
- Builds commit message based on conventional commits

## How it works?

After properly configured with git hooks, your commit messages will be concatenated with informations based in your branch name.
The default configuration is set to expect a branch naming with `type/ticket` (example: *feature/ID-1249*), and have the following template message: `{{type}}: [{{ticket}}] {{message}}`.

So, from this branch, when you commit with the message:

`"My awesome commits"`

The final commit message will be:

`"feat: [ID-1249] My awesome commits"`

Note that "feature" was converted to "feat" to match the conventional commits specifications.

You can customize these options to follow any pattern.

## Setup with Husky

1. Install commit-context and husky
```
npm install husky commit-context
```

2. Init husky
```
npx husky-init && npm install 
```
Note: This step will create a pre-commit git hook. You can remove it from `.husky/pre-commit`.

3. Add a commit-msg git hook
```
npx husky add .husky/commit-msg 'npx commit-context $1' 
```

## Customization

You can add custom configurations in your package.json:

```json
{
  "commitContext": {
     "branchVars": ["type", "ticketId"],
     "messageTemplate": "{{type}}: [{{ticketId}}] {{message}}",
     "separator": "/",
     "useConventionalTypes": true,
  }
}
```

### Options

prop | type | descrption | default value
:-- | :-- | :-- | :-- 
**branchVars** | array | set the name of each item in your branch name (split by the separator) | ["type", "ticketId"]
**messageTemplate** | string | set the template for the commit messages (gets variables from branchVars) | "{{type}}: [{{ticketId}}] {{message}}"
**separator** | string | separator to split values from branch name | "/"
**useConventionalTypes** | boolean | converts types from branch name to match conventional commits | true 