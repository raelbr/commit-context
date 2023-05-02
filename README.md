# commit-context
Gives context to commit messages from branch name

- Supports Git flow branch naming conventions
- Builds commit message based on conventional commits

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