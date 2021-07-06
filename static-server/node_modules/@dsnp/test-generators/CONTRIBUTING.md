# Test Generators TypeScript Development

## Library Development Notes
- Update the docs folder as needed by running `npm run doc:markdown`

### Local Development Library Use

1. test-generators: `npm install`
2. test-generators: `npm run build`
3. test-generators: `npm link`
4. In other project: `npm link @dsnp/test-generators`
5. The other project now uses the test-generators folder as the node_modules folder
6. test-generators: `npm run watch`

### Documentation Generation Notes

- `npm run docs` generates HTML documentation in `dist`
- `npm run docs:markdown` generates markdown documentation in `docs`
- Edit the list of excluded files in `tsconfig.json` -> `typedocOptions` -> `exclude`

### How to Release

1. Draft New Release on GitHub.com
2. Set tag to v0.0.0 following [Semver 2.0](https://semver.org/)
3. Set title to "v0.0.0 Major Feature Name"
4. Set contents to follow [KeepAChangeLog.com 1.0](https://keepachangelog.com/en/1.0.0/), but limited to just the new release information
    ```markdown
    ## [0.1.0] - 2017-06-20
    ### Added
    - New thing
    ### Changed
    - Different thing
    ### Removed
    - Not a thing anymore
    ```
5. Publish
6. TODO: CI will build and publish to the npm repository
