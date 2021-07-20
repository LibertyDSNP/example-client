# DSNP Contracts

The official DSNP interface and implementations.

## Overview

### Installation

```console
$ npm install @dsnp/contracts
```

### JavaScript ABI Usage

```javascript
const publisher = require("@dsnp/contracts/abi/Publisher.json");
const publisherABI = publisher.abi;

```
### TypeScript ABI Usage

```typescript
// Requires "resolveJsonModule": true in [tsconfig](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
import { abi as publisherABI } from "@dsnp/contracts/abi/Publisher.json";
```

#### TypeScript Contract Types

To maintain types, it is suggested to use [TypeChain](https://github.com/ethereum-ts/Typechain).

1. Follow the [install directions](https://github.com/ethereum-ts/Typechain#installation) and add the correct package for your toolset.
2. Add a postinstall or other step to run typechain:
  - `"postinstall": "typechain --target=(ethers-v5|web3-v1|other...) ./node_modules/@dsnp/contracts/**/*.json --outDir ./types/typechain"`
  - `"build:web3types": "typechain --target=web3-v1 ./node_modules/@dsnp/contracts/**/*.json --outDir ./types/typechain"`
3. Make sure your `--outDir` is in [tsconfig typeRoots](https://www.typescriptlang.org/tsconfig#typeRoots).
4. Use the types:
```typescript
// web3 example
import web3 from "web3";
import { Publisher } from "./types/typechain/Publisher";
import { abi as publisherABI } from "@dsnp/contracts/abi/Publisher.json";

const getPublisherContract = (contractAddress: string) => {
  // web3 requires the type casts
  return (new web3.eth.Contract(publisherABI, contractAddress) as any) as Publisher;
}
```

```typescript
// ethersjsv5 example
import { Provider } from "@ethersproject/providers";
import { Publisher } from "./types/typechain/Publisher";

const getPublisherContract = (contractAddress: string, provider: Provider) => {
  // TypeChain for Ethers provides factories
  return Publisher__factory.connect(contractAddress, provider);
}
```

### Contract Usage

Once installed, you can use the contracts in the library by importing them:

```solidity
pragma solidity ^0.8.0;

import "@dsnp/contracts/IPublish.sol";

contract MyPublisher is IPublish {
    // ...
}
```

## Running a Testing Chain

Version matching may matter when working with the the contracts package or the SDK package.
Docker images are tagged in the same way as the npm package, so you can match the npm package version to the image version.
To find out what version of the contracts package you are using:

```bash
$ npm ls --all | grep "@dsnp/contracts"
```

### Ganache Based Docker

Our Ganache Based Docker Image has the contracts pre-setup on the [ganache-cli](https://github.com/trufflesuite/ganache-cli/) chain.
It is a small image designed for CI contexts.
https://hub.docker.com/r/dsnp/ganache/tags

Exposed Port: 8545

#### Build Arguments

As the Ganache image comes with the chain pre-started (for the small image size), accounts are pre-set.
If you need to use a different mnemonic or chain id, please use the ganache.Dockerfile to build a new image.

```
MNEMONIC="test test test test test test test test test test test junk"
DEPLOY_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
CHAINID="31337"
```

### Hardhat Based Docker

Our Hardhat Based Docker Image will run the [Hardhat Network](https://hardhat.org/hardhat-network/) and deploys the contracts at run time.
The Hardhat network has various advantages such as better stack traces, but is a much larger image and designed for local development.

https://hub.docker.com/r/dsnp/hardhat/tags

Exposed Port: 8545

#### Accounts 

These are setup in the [hardhat.config.ts](https://hardhat.org/config/#hardhat-network) file.
If you need different accounts, please build a different image.

```
MNEMONIC="test test test test test test test test test test test junk"
CHAINID="31337"
```

### Deploy Hardhat Network Locally
1. Spin up a hardhat node by running `npx hardhat node`
1. Once node is up - run `npm run deploy:localhost`

### evm_snapshot/evm_revert

Both Hardhat and Ganache based test chains support snapshot and revert. Learn more in the [ganache docs](https://github.com/trufflesuite/ganache-cli/#custom-methods).

Remember:
> A snapshot can only be used once. After a successful evm_revert, the same snapshot id cannot be used again.
> Consider creating a new snapshot after each evm_revert if you need to revert to the same point multiple times.


## Development

We are using [hardhat](https://hardhat.org/) to compile and deploy the contracts
 
## Key Commands and Tasks
Basic Command List:
- `npm install`
- `npm run clean` - clears the cache and deletes all artifacts
- `npm run compile` - compiles the entire project, building all artifacts
- `npm run console` - opens a hardhat console
- `npm run test` - runs mocha tests
- `npm run lint` - to run the linter
- `npm run format` - to trigger formatting 
- `npm run deploy:testnet` - deploys our `deploy.ts` script to our POA testnet defined in the `hardhat.config.ts`
- `npm run deploy:localhost` - deploys our `deploy.ts` script to our hardhat network defined in the `hardhat.config.ts`

Environment Variables
1. create a `.env` file and set values for all variables in `.env.sample`

|Env Variable Name      | Description | 
| ------------- | -----------  | 
| LOCAL_PRIVATE_KEY         | private key for an account we have on our local network that has eth.         | 
| STAGENET_PRIVATE_KEY       | private key for an account we have on our staging network that has eth.         |
| STAGENET_CHAIN_URL     | Url to connect to staging network        |     
| VALIDATOR1 | hex prefixed address for validator running on node called liberty-chain |
| VALIDATOR2 | hex prefixed address for validator running on node called liberty-chain1
| BOOTNODE | enode address of the node our node would like to connect to |
    
## Accounts

## Deployments

## Ports

## Development
* This repo uses [Hardhat](https://hardhat.org/getting-started/) + [ethers](https://docs.ethers.io/v5/) for interfacing with Ethereum,
* [Waffle](https://ethereum-waffle.readthedocs.io/en/latest/index.html) for testing,
