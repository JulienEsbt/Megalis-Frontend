# Megalis Frontend

> **Status: Learning project (2022)** — historical interface for a Solidity
> prototype. The original public testnet deployments are no longer maintained.

This React application is the companion interface for the
[Megalis smart contracts](https://github.com/JulienEsbt/Megalis-Smart-Contract).
It explores a document-timestamping workflow in which a user connects a wallet,
publishes a document reference and reads publications associated with an
organisation identifier.

## Demonstrated features

- injected wallet detection and connection;
- network detection for several EVM networks;
- contract calls with ethers.js;
- publication of a SIREN, document URL and document hash;
- lookup of publications for a SIREN;
- listing of identifiers recorded by the contract;
- transaction event display;
- Material UI form and accordion components.

## Stack

- React 18 and Create React App
- Material UI
- ethers.js and Web3.js
- JavaScript and CSS

## Run the interface locally

```bash
git clone https://github.com/JulienEsbt/Megalis-Frontend.git
cd Megalis-Frontend
npm ci
npm start
```

This starts the interface at `http://localhost:3000`. Blockchain interactions
will not work without deploying a compatible contract and replacing the
historical network addresses in the application.

## Current limitations

- the configured Ropsten, Rinkeby, Kovan and Mumbai deployments are historical;
- the project has no maintained end-to-end environment;
- the included test is the original Create React App smoke test;
- most read results are written to the browser console rather than rendered;
- event subscriptions and error handling need refinement;
- the related contracts are unaudited learning code.

This repository is kept public to document an early full-stack Web3 experiment.
It is not an active service or a production dApp.

## License

No open-source license has been selected for this learning repository.

