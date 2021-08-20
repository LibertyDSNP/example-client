# Example Client

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
  - My Feed
  - A specific user's posts
  - Main Feed

#### Note
The features of the Example Client are subject to change with future versions and as decisions are made on the DSNP SDK.

***
## Project Setup
Follow this quick start guide to get up and running. This guide assumes a working knowledge of npm and git. Make sure to check out [CONTRIBUTING.md](CONTRIBUTING.md) as well.
* Clone the example-client repository: `git clone git@github.com:LibertyDSNP/example-client.git`
* Install the correct npm and node version. Recommend using asdf: `asdf install`
* Install modules: `npm install`
  * Install Static Server modules `cd ./static-server && npm install`
* Copy `.env.example` to `.env` and edit as needed.
* Start the Static Server `cd ./static-server && npm run start`
* Start up site locally: `npm run start`
* Visit http://localhost:3000 (or you configured port)

## Development Troubleshooting and FAQ
* **Transactions rejected due to invalid nonce** - If you've restarted the chain, you probably need to reset your test accounts. In Metamask, click on the **Account** icon from the extension.  Then go to **Settings --> Advanced**, scroll down a little and click **Reset Account**. Do this for each connected account.
* **Still seeing old events after resetting chain** - If you're running static-server, it needs to be stopped.  Then delete all the batch files it stored with `rm static-server/public/0x*`
* **How do I restart example-app with an empty chain and no events?** - For best results, in this order, do the following:
    1. Logout of the app from your browser.
    1. Kill the example-app with ^C (If you haven't changed the code and just want to delete and recreate all posts, you can skip this step.)
    1. Kill static-server same way
    1. Delete static-server batch files with `rm static-server/public/0x*`
    1. Go to the contracts repo and kill hardhat node (^C)
    1. Restart hardhat node: `npx hardhat node`
    1. Redeploy the contracts: `npm run deploy:localhost`
    1. Reset your test accounts in Metamask
    1. Restart example-app/static server: `npm run start` from within static-server
    1. Optionally, rerun populate script from example-app, if you want to quickly populate some accounts and events: `node script/populate`
    1. If you stopped the example-app, restart it: `npm run start`

    You should now be able to login to the app, and view and create posts.
* **How do I connect to some external chain instead of the local dev chain?** - In general, we recommend against connecting to an external chain, because this Example Client is deliberately not scalable: it just reads all of whatever chain it connects to.  That's fine when you're using a local development chain that has only your own posts, but things won't be so pleasant if you connect to a much larger and more active chain.  However, if there is some external chain that you know is small enough for the Example Client to handle, then give it a try.  [The instructions here](https://forums.projectliberty.io/t/testnet-is-now-live/93) might help.

## Miscellaneous Information

__Contributing Guide:__
To contribute to this project please read our [CONTRIBUTING.md](CONTRIBUTING.md) file.
It provides the details on everything from requesting features, to reporting bugs, to making your own PR requests.

__Style Guide:__
The layout of this project adheres to a specific style guide that you can find in [STYLING.md](STYLING.md).
This file provides the details on the many different facets of the look and feel of this project. It is required to adhere to this style guide when making contributions to the project.

__Code of Conduct:__
In all interactions we request everyone review, understand, and follow our [CODE OF CONDUCT](https://www.projectliberty.io/codeOfConduct.html).

__Licensing:__
Before doing anything beyond reading through the project please take a moment to view our [LICENSE](LICENSE).
