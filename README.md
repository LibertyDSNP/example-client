# DSNP Example Client

[![Latest release](https://img.shields.io/github/release/LibertyDSNP/example-client)](https://github.com/LibertyDSNP/example-client/releases)

[![example workflow](https://github.com/LibertyDSNP/example-client/actions/workflows/main.yml/badge.svg)](https://github.com/LibertyDSNP/example-client/actions)

This is an example client to help developers learn how to work with the [Distributed Social Networking Protocol(DSNP)](https://spec.dsnp.org/) and its [SDK](https://github.com/LibertyDSNP/sdk-ts).
This client's purpose is to be  simple and comprehensible for developers, not to have all the functionality and user-interface polish of an application intended for widespread general usage.

This repo also provides a server ('static-server') that is run concurrently with example-client.
The static-server stores and serves ActivityContent.
Please note that the  Example Client is not designed for scalability and would not be able to handle a live blockchain with lots of activity.
Later in this document there is information about how to connect to an external chain if you really want to.

The DSNP Example Client is [open source software](LICENSE), like the rest of the DSNP development ecosystem.

## Versions

- DSNP Core: v1.0.0
- DSNP on Ethereum: v1.0.0

## Table of Contents

- [DSNP Example Client](#dsnp-example-client)
  - [Versions](#versions)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Dependencies and Design](#dependencies-and-design)
  - [Deployment](#deployment)
    - [Local deployment](#local-deployment)
    - [Docker-based deployment](#docker-based-deployment)
      - [Environment Variable Definitions](#environment-variable-definitions)
      - [Docker Builds](#docker-builds)
  - [Development Troubleshooting and FAQ](#development-troubleshooting-and-faq)
  - [Participating](#participating)

## Features

The Example Client's current features include:

* User Profiles
  - Create a new profile
  - Edit your profile
  - See other users' profiles
  - Publicly follow/unfollow other users
  - Display list of followers/following

* Posts
  - Create a public post
  - View a public post in the feed
  - Comment on a public post (note: only to one degree of depth)
  - React to posts
  - Filter and navigate through the feed
    + My Posts
    + My Feed
    + Another user's posts
    + Main Feed

This list of features may change as [DSNP](https://spec.dsnp.org/) evolves, of course.

## Dependencies and Design

Below is a list of important libraries and dependencies for the Example Client and what their purpose is.

* Package Management: [Node Package Manager](https://www.npmjs.com) (npm)

* State Management: [React Redux](https://react-redux.js.org) for easier context passing of state

* Network Request: [Web3.js](https://web3js.readthedocs.io/en/v1.3.4/) for Ethereum blockchain interaction

* Frontend Framework:
  - [ReactJS](https://reactjs.org) with [Typescript](https://www.typescriptlang.org)
  - [SCSS](https://sass-lang.com) with [BEM](https://en.bem.info/methodology/css/) methodology
  - Responsive with Desktop first priority
  - Utilize media queries, SCSS mixing
  - [Ant Design](https://ant.design) Library of pre-built React components

* Testing:
  - Tests written in [Jest](https://jestjs.io) and [Enzyme](https://enzymejs.github.io/enzyme/)
  - CI/CD done with [Github Actions](https://github.com/features/actions)

*Note: Enzyme is [not ready for React 17 yet](https://github.com/enzymejs/enzyme/issues/2429), so we're using an unofficial version and installing packages with `npm i --legacy-peer-deps` if using node v7.
We will change to an official version of Enzyme when a compatible released version is available.*

## Deployment

The following steps should get you up and running quickly (assuming a working knowledge of NPM and Git):

* Clone the example-client repository: `git clone git@github.com:LibertyDSNP/example-client.git`.

* Install the correct npm and node version, which can be found in the `.tool-versions` file.  The maintainers use `asdf` for managing node and npm versions.

* Install the modules: `npm install`.
  * Install Static Server modules `cd ./static-server && npm install`.

* Copy `.env.example` to `.env` and edit as needed.

* Switch to a separate terminal and start the Static Server: `cd ./static-server && npm run start`.

* Start up site locally: `npm run start`.

* Visit http://localhost:3000 (or whatever your configured port is).

* Follow Example Client's MetaMask Setup Instructions shown at the above URL.

You can run the test suite with 'npm run test'.

### Local deployment

**Use local deployment for development of the Example Client and testing the code.**

For local deployment, you will be running the Example Client, Static Server, and Contracts.

To launch it, follow the instructions below:

  * Clone the Contracts repository: `git clone git@github.com:LibertyDSNP/contracts.git`.
  * Follow contracts/README.md to Deploy Hardhat Network Locally.
  * Follow the Example Client Deployment instructions above.
  * Connect to the `http://localhost:8545` RPC URL through MetaMask.


### Docker-based deployment

**Use Docker-based deployment for development of the Example Client and testing the code.**

To launch it, run the following commands:

* `docker build --build-arg REACT_APP_UPLOAD_HOST="" --build-arg REACT_APP_CHAIN_ID={REACT_APP_CHAIN_ID_VALUE} --build-arg  REACT_APP_CHAIN_NAME={REACT_APP_CHAIN_NAME_VALUE}  --build-arg REACT_APP_CHAIN_HOST={REACT_APP_CHAIN_HOST} . -t example-client`

* `docker run  --init --rm  -p 8080:8080 -v {name_for_volume}:/app/static-server/public example-client`

#### Environment Variable Definitions

* `REACT_APP_CHAIN_ID_VALUE` : 31337 or 0x7a69
* `REACT_APP_CHAIN_NAME_VALUE` : (user's choice)
* `REACT_APP_CHAIN_HOST` : http://localhost:8545
* `name_for_volume` : ??

#### Docker Builds

A new Docker image will be pushed from our [GitHub repository](https://github.com/LibertyDSNP/example-client) to our [Docker hub](https://hub.docker.com/r/dsnp/example-client) when a new Git tag is created.  Tags have the format `docker/*`, e.g.,`docker/v1.0.0`.

## Development Troubleshooting and FAQ

* **How to reset Metamask after restarting the chain** - Perform the following:
    1. You should first sign out of your account through the account icon on the top right.
    2. Then in the Metamask extension, click on the **Account** icon and go through **Settings --> Advanced**. Reset your transaction history through the **Reset Account** button.
    3. Afterwards, reconnect with the **Connect** button using Metamask. The client should be fully reset and ready to go.

* **Transactions rejected due to invalid nonce** - If you've restarted the chain, you probably need to reset your test accounts.
In Metamask, click on the **Account** icon from the extension.
Then go to **Settings --> Advanced**, scroll down a little and click **Reset Account**. Do this for each connected account.

* **Still seeing old events after resetting chain** - If you're running static-server, it needs to be stopped.
Then delete all the batch files it stored with `rm static-server/public/0x*`.

* **How do I restart example-app with an empty chain and no events?** - For best results, in this order, do the following:
    1. Logout of the app from your browser.
    1. Kill the example-app with ^C (If you haven't changed the code and just want to delete and recreate all posts, you can skip this step.).
    1. Kill the static-server same way.
    1. Delete the static-server batch files with `rm static-server/public/0x*`.
    1. Go to the contracts repo and kill the hardhat node (^C).
    1. Restart the hardhat node: `npx hardhat node`.
    1. Redeploy the contracts: `npm run deploy:localhost`.
    1. Reset your test accounts in Metamask.
    1. Restart example-app/static server: `npm run start` from within static-server.
    1. Optionally, rerun populate script from example-app, if you want to quickly populate some accounts and events: `node script/populate`.
    1. If you stopped the example-app, restart it: `npm run start`.

    You should now be able to login to the app, and view and create posts.

* **How do I connect to some external chain instead of the local dev chain?** - In general, we recommend against connecting to an external chain, because this Example Client is deliberately not scalable: it just reads all of whatever chain it connects to.
That's fine when you're using a local development chain that has only your own posts, but things won't be so pleasant if you connect to a much larger and more active chain.
On the other hand, if there is some external chain that you know is small enough for the Example Client to handle, then give it a try.
* [The testnet instructions](https://forums.projectliberty.io/t/testnet-is-now-live/93) might help.

## Participating

Please feel free to ask questions or offer suggestions here in the [issue tracker](https://github.com/LibertyDSNP/example-client/issues)
or in the [DSNP Discussion Forums](https://forums.projectliberty.io), whichever you think is more appropriate.

The [Contribution Guide](CONTRIBUTING.md) has details on how to  interact with the project, including reporting bugs, requesting features, and sending changes (PRs).

Please note that this project adheres to the [Project Liberty Code of Conduct](https://www.projectliberty.io/codeOfConduct.html).
