# Contributing Guide

## Welcome
Welcome to the example client for demonstrating the use of the DSNP (Distributed Social Networking Protocol) SDK. Thank you for opening this file and considering contributing to the project either by reporting issues or directly contributing code to the project!

## References
In creating bug reports, feature requests, or pull requests it's important to be familiar and up to date with both: 
* [DSNP Specs](https://www.google.com/search) for how the DSNP works
* [DSNP SDK](https://www.google.com/search) for integration with the DSNP

## Reporting

### Bugs
If you are using the example client and you find a bug that you believe should be fixed, please create a new issue on our [Github Issues Page](https://www.google.com/search). Make sure to **tag it as a bug**, and follow the `Bug Report Template` found in the Templates section below. For all intents and purposes a Bug is any one of the following things:
* Broken/Nonfunctional code
* Unexpected/Unintentional results
* Code vulnerabilities
* Out of date code/packages/documentation
* Documentation/Code inconsistencies

### Features
If you are using the example client and would like to request a non-bug related change or a new feature not yet included, please create a new issue on our [Github Issues Page](https://www.google.com/search). Make sure to **tag it as a feature request**, and follow the `Feature Request Template` found in the Templates section below. For all intents and purposes a Feature Request is any one of the following things:
* New example client functionality 
* Expanded use of existing functionality
* Request use more up-to-date tools/resources
* Documentation expansion/addition

## Contributing

### Conventions
To increase the coherence of the code and establish best practices the entire codebase follows certain conventions. Luckily, many of the style conventions are enforced by the linters so that you don't have to spend hours going over every line to make sure it matches all conventions. Many IDEs can run these linters automatically but incase they don't you can run them manually with 'npm run format'.

The main conventions you'll need to be aware of are as follows:
* All code written in Typescript with as much type specificity as possible.
* Styling for visual components. [Check the Style Guide](https://www.google.com/search)
* Use of the [BEM](https://en.bem.info/methodology/quick-start/) methodolgy for CSS classes
* Use of [React Hooks](https://reactjs.org/docs/hooks-intro.html) in components
* Testing of all added components using [Jest](https://jestjs.io) and [Enzyme](https://enzymejs.github.io/enzyme/).

### Testing
As mentioned above testing is a very important part of this project. All code aditions must have tests that cover their use cases. Tests do not need to be exhaustive, but a good covering of main functionality is expected. It is highly recommeneded to view some of the already written tests to use as examples. You can run tests locally with 'npm run test'.

### Pull Requests
Once you have written your contribution and it matches all conventions and has proper testing in place you can create a Pull Request on the Github repository. All PRs must follow the `Pull Request Template` found in the Template section below. To be approved and merged there are some specific requirements that must be met:
1. The test must pass CI/CD done through Github Actions
2. A member of the DSNP team must approve the changes
3. The changes must be rebased on top of the main branch before merging.

## Templates

#### Bug Report Template
```
Issue description
---------------
A description of bug and what you believe the intended outcome should have been
Reproduce Issue
---------------
1. A list of steps
2. to recreate the
3. bug or issue
Expected result
---------------
- A detailed description of what you expected to happen
Actual result
---------------
- A detailed descrtiption of what actually happened
Additional details / screenshot
---------------
- Any suplmenental pictures or material
- ![Screenshot]()
```

#### Feature Request Template
```
Feature Description
---------------
A description of of the feature you want to add
Feature Justification
---------------
A reason for why this feature should be added
Acceptance Criteria
---------------
1. A list of steps
2. to follow that 
3. should all be true
4. if the feature is 
5. implemented properly
Additional details / screenshot
---------------
- Any suplmenental pictures or material
- ![Screenshot]()
```

#### Pull Request Template
```
Purpose
---------------
A description of the purpose for this pull request and weather it is to provide new functionality or fix a bug
Solution
---------------
A descrition of what you have done to implement/fix the above mentioned feature or bug
with @<any other developers who who worked on the PR with you>
Change summary
---------------
* A detailed list of bulleted
* changes that go into detail about
* the specifics of the changes
* to the codebase
Steps to Verify
----------------
1. A numbered list of steps
2. To verify that this feature/bug
3. is now working
Additional details / screenshot
----------------
- Any suplmenental pictures or material
- ![Screenshot]()
```

## Help
If you need any help or have any question make sure to first refer to the [DSNP Specs](https://www.google.com/search) and the [DSNP SDK](https://www.google.com/search). If you can't find you answer there feel free to join the [DSNP Forums](https://www.google.com/search) or  [DSNP Discord](https://www.google.com/search) and request assistance.

## Thanks
Thank you from the DSNP and Project Liberty team for helping contribute to the example client project!