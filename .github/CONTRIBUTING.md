# Contributing Guide

## Welcome
Welcome to the example client for demonstrating the use of the DSNP (Distributed Social Networking Protocol) SDK. Thank you for opening this file and considering contributing to the project either by reporting issues or directly contributing code to the project! First, check out our project wide [Contributing Standards](https://github.com/LibertyDSNP/liberty-web/blob/main/CONTRIBUTING.md) and then read on below for specifics about this project.

## References
In creating bug reports, feature requests, or pull requests it's important to be familiar and up to date with both: 
* [DSNP Specs](https://github.com/LibertyDSNP/spec) for how the DSNP works
* [DSNP SDK](https://github.com/LibertyDSNP/sdk-ts) for integration with the DSNP

## Reporting

### Bugs
If you are using the example client and you find a bug that you believe should be fixed, please create a new issue on our [Github Issues Page](https://github.com/LibertyDSNP/example-client/issues). Make sure to **tag it as a bug**, and follow the `Bug Report Template`. For all intents and purposes a Bug is any one of the following things:
* Broken/Nonfunctional code
* Unexpected/Unintentional results
* Code vulnerabilities
* Out of date code/packages/documentation
* Documentation/Code inconsistencies

### Features
If you are using the example client and would like to request a non-bug related change or a new feature not yet included, please create a new issue on our [Github Issues Page](https://github.com/LibertyDSNP/example-client/issues). Make sure to **tag it as a feature request**, and follow the `Feature Request Template`. For all intents and purposes a Feature Request is any one of the following things:
* New example client functionality 
* Expanded use of existing functionality
* Request use more up-to-date tools/resources
* Documentation expansion/addition

## Contributing

### Conventions
To increase the coherence of the code and establish best practices the entire codebase follows certain conventions. Luckily, many of the style conventions are enforced by the linters so that you don't have to spend hours going over every line to make sure it matches all conventions. A few more standards come from our project wide [Contributing Standards](https://github.com/LibertyDSNP/liberty-web/blob/main/CONTRIBUTING.md). Many IDEs can run these linters automatically but incase they don't you can run them manually with 'npm run format'.

The main conventions you'll need to be aware of are as follows:
* All code written in Typescript with as much type specificity as possible.
* Styling for visual components. [Check the Style Guide](https://github.com/LibertyDSNP/example-client/blob/main/STYLING.md)
* Use of the [BEM](https://en.bem.info/methodology/quick-start/) methodolgy for CSS classes
* Use of [React Hooks](https://reactjs.org/docs/hooks-intro.html) in components
* Testing of all added components using [Jest](https://jestjs.io) and [Enzyme](https://enzymejs.github.io/enzyme/).

### Testing
As mentioned above testing is a very important part of this project. All code aditions must have tests that cover their use cases. Tests do not need to be exhaustive, but a good covering of main functionality is expected. It is highly recommeneded to view some of the already written tests to use as examples. You can run tests locally with 'npm run test'.

### Pull Requests
Once you have written your contribution and it matches all conventions and has proper testing in place you can create a Pull Request on the Github repository. All PRs must follow the `Pull Request Template`. To be approved and merged there are some specific requirements that must be met:
1. The test must pass CI/CD done through Github Actions
2. A member of the DSNP team must approve the changes
3. The changes must be rebased on top of the main branch before merging.

## Help
If you need any help or have any question make sure to first refer to the [DSNP Specs](https://github.com/LibertyDSNP/spec) and the [DSNP SDK](https://github.com/LibertyDSNP/sdk-ts). If you can't find you answer there feel free to join the [DSNP Forums](https://forum.projectliberty.io) or [DSNP Discord](https://www.google.com/search) (not created yet) and request assistance.

## Thanks
Thank you from the DSNP and Project Liberty team for helping contribute to the example client project!