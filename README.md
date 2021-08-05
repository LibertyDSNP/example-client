# Foodee Example Client
This is a fork of [LibertyDSNP/example-client](https://github.com/LibertyDSNP/example-client) for demo purposes.

### Note:
Enzyme is not ready for react 17 yet, so using an unofficial version and installing
packages with `npm i --legacy-peer-deps` if using node v7.
#### Goal:
* Change to official version of enzyme when correct version is available.
* Issue: https://github.com/enzymejs/enzyme/issues/2429

## Project Library and Design Choices
Below is a list of important libraries and dependecies for the project and what their purpose is.

__Package Management:__ [Node Package Manager](https://www.npmjs.com) (npm)

__State Management:__ [React Redux](https://react-redux.js.org) for easier context passing of state

__Network Request:__ [Web3.js](https://web3js.readthedocs.io/en/v1.3.4/) for etherium blockchain interaction

__Frontend Framework:__
* [ReactJS](https://reactjs.org) with [Typescript](https://www.typescriptlang.org)
* [SCSS](https://sass-lang.com) with [BEM](https://en.bem.info/methodology/css/) methodology
* Responsive with Desktop first priority
* Utilize media queries, SCSS mixing
* [Ant Design](https://ant.design) Library for Prebuilt React Components

__Testing:__
* Tests written in [Jest](https://jestjs.io) and [Enzyme](https://enzymejs.github.io/enzyme/)
* CI/CD done with [Github Actions](https://github.com/features/actions)

***

## Example Client Features
### Profile
* Create a new profile
* Edit your profile
* See other users' profiles
  - Publicly follow/unfollow other users
* Display list of followers/following

### Posts
* Create a public post
* View a public post in the feed
* Comment on a public post
  - Note: only to one degree of depth
* React to posts
* Filter and navigate through the feed
  - My Posts
  - My FeedNavigation
  - A specific user's posts
  - Main FeedNavigation

#### Note
The features of the Example Client are subject to change with future versions and as decisions are made on the DSNP SDK.

***
## Project Setup
Follow this quick start guide to get up and running. This guide assumes a working knowledge of npm and git. Make sure to check out the __CONTRIBUTING.md__ as well.
* Clone the example-client repository: `git clone git@github.com:LibertyDSNP/example-client.git`
* Install the correct npm and node version. Recommend using asdf: `asdf install`
* Install modules: `npm install`
* Copy `.env.example` to `.env` and edit as needed.
* Start up site locally: `npm run start`
* Visit http://localhost:3000 (or you configured port)

## Miscellaneous Information

__Contributing Guide:__
To contribute to this project please read our __CONTRIBUTING.md__
This files will provide the details on everything from requesting features, to reporting bugs, to making your own PR requests.

__Style Guide:__
The layout of this project adheres to a specific style guide that you can find in __STYLING.md__
This file will provide the details on the many different facets of the look and feel of this project. It is required to adhere to this style guide when making contributions to the project.

__Code of Conduct:__
In all interactions we request everyone review, understand, and follow our [CODE OF CONDUCT](https://www.projectliberty.io/codeOfConduct.html)

__Licensing:__
Before doing anything beyond reading through the project please take a moment to view our __LICENSE.md__
