# Contributing Guide

I'm excited to have you helping out. Thank you so much for your time.

## Contributing

### Setting up the environment

Considering you've forked and cloned the repo on your system, switch to the directory and install the dependencies.

```
cd terminal-in-react
npm install
```

### Submitting pull requests

*   Create a new branch for the new feature: `git checkout -b new-feature`
*   Make your changes.
*   `npm run build` for bundling the css and js.
*   Commit your changes: `git commit -m 'Add some feature'`
*   Push to the branch: `git push origin new-feature`
*   Submit a pull request with full remarks documenting your changes.

### Starting development server

To test your changes [Storybook](https://storybook.js.org) is used. This is a neat tool to test your component in an isolated state.

To start it, simply run `npm run storybook` and head to [http://localhost:6006]().

To add a new use case, just add a new story in the `stories/index.js` file.

That's it! I am excited to see your pull request.
