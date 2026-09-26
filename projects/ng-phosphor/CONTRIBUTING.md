# Contributing

Use Node 24.15.0 and install dependencies with `npm ci`.
Create a branch for your change. Keep components small and use pure functions for computation.

Run these checks before opening a pull request:

```sh
npm run check:icons
npm test
npm run build
npm run build:demo
```

If you change icon generation, regenerate definitions and include the generated changes.
If you change the public API, update both the root and package README.
Include tests for rendering, input changes, and accessibility when those behaviors change.

Open an issue before a large API or compatibility change. Report missing artwork against the pinned upstream version.
The project follows the upstream Phosphor icon names and does not add application-specific business icons.

Never commit registry tokens, private package assets, or consumer application code.
