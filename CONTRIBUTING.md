# DSNP Example Client: Contribution Guide

Thank you for considering contributing, whether by reporting issues,
improving documentation, or contributing code.

First, please see the [Contribution
Guide](https://github.com/LibertyDSNP/liberty-web/blob/main/CONTRIBUTING.md)
for Project Liberty as a whole.  Below are specifics about the Example
Client project.

## References

DSNP is a fast-moving environment.  When creating bug reports, feature
requests, or pull requests, it's important to be familiar and
up-to-date with:

* [DSNP Specs](https://github.com/LibertyDSNP/spec) for how the DSNP works.

* [DSNP SDK](https://github.com/LibertyDSNP/sdk-ts) for integration with the DSNP.

## Reporting

### Bugs

If you are using the Example Client and you find a bug that you
believe should be fixed, please [create a new issue
ticket](https://github.com/LibertyDSNP/example-client/issues/new/choose)
(after first [looking to see if there is an existing
issue](https://github.com/LibertyDSNP/example-client/issues) about it,
of course).  Make sure to **tag the new issue as a bug**, and follow
the `Bug Report` template.

### Features

To suggest an enhancement or new feature, please [create a new issue
ticket](https://github.com/LibertyDSNP/example-client/issues/new/choose)
(after first [looking to see if anyone else has suggested the same
thing](https://github.com/LibertyDSNP/example-client/issues)).  Make
sure to **tag it as a feature request**, and follow the `Feature
Request` template.

## Contributing

### Conventions

The codebase follows certain conventions (including some inherited
from the [Project Liberty Contribution
Standards](https://github.com/LibertyDSNP/liberty-web/blob/main/CONTRIBUTING.md).
Many of the style conventions are enforced by the automated linters so
that you don't have to spend hours going over every line to make sure
it matches all conventions.  Many IDEs can run these linters
automatically, but if yours doesn't, you can run them manually with
'npm run format'.

The main conventions you need to know about are:

* All code is written in Typescript with as much type specificity as possible.

* Styling for visual components. [Check the Style Guide](https://github.com/LibertyDSNP/example-client/blob/main/STYLING.md).

* Use of the [BEM](https://en.bem.info/methodology/quick-start/) methodology for CSS classes.

* Use of [React Hooks](https://reactjs.org/docs/hooks-intro.html) in components.

* Testing of all added components using [Jest](https://jestjs.io) and [Enzyme](https://enzymejs.github.io/enzyme/).

### Testing

All code additions must have tests that cover their use cases.  Tests
do not need to be exhaustive, but a good covering of main
functionality is expected.  We recommend viewing some of the
already-written tests as examples.

Run tests locally with 'npm run test'.

### Pull Requests

All PRs must follow the `Pull Request` template.  To be approved and
merged, a PR must meet these requirements:

1. The test must pass CI/CD done through Github Actions.
2. The changes must be rebased on the `main` branch before merging.

## Help

Please feel free to ask questions in the [DSNP
Forums](https://forums.projectliberty.io).
