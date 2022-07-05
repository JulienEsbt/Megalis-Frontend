import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/megalisV1.json";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/esm/ExpandMore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function App() {

  const CONTRACT_ADDRESS_V1_ROPSTEN = "0x67F1F01A24E5f2B8dD574f7e9C86b94B2e0E917F";
  const CONTRACT_ADDRESS_V1_GOERLI = "0xD1A36e0d2f7AC156593E6a243918C722e7b81B8c";
  const CONTRACT_ADDRESS_V1_RINKEBY = "0x690C8AACb965Ca2A567dc89287D504De1137f19c";
  const CONTRACT_ADDRESS_V1_KOVAN = "0xD1A36e0d2f7AC156593E6a243918C722e7b81B8c";
  const CONTRACT_ADDRESS_V1_GNOSIS = "0xD3D67E39E3399fC28242BAC053Fb63c4A0bfbe48";
  const CONTRACT_ADDRESS_V1_POLYGON_MUMBAI = "0xcb00c34B9B5687CCb44AfA332EF78BD6d423F598";

  const [currentAccount, setCurrentAccount] = useState();
  const [siren, setSiren] = useState('Aucun siren.');
  const [url, setUrl] = useState('Aucun url.');
  const [hash, setHash] = useState('Aucun hash.');
  const [adresse, setAdresse] = useState('Aucune adresse.');
  const [expanded, setExpanded] = React.useState(false);
  const [network, setNetwork] = useState('Unknow network');
  const [etherscan, setEtherscan] = useState('Pas dexplorer disponible pour le moment');
  const [contractAddress, setContractAdress] = useState('Le contrat n`a pas été déployer sur ce réseau');
  const [contractInfo, setContractInfo] = useState({address: "-",});
  const [contractInfoBis, setContractInfoBis] = useState();
  const [txs, setTxs] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => { setExpanded(isExpanded ? panel : false); };

  let sirenInput = (e) => { console.log("sirenInput"); setSiren(e.target.value) };

  let urlInput = (e) => { console.log("urlInput"); setUrl(e.target.value) };

  let hashInput = (e) => { console.log("hashInput"); setHash(e.target.value) };

  let addressInput = (e) => { console.log("addressInput"); setAdresse(e.target.value) };

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  const updateNetwork = async () => {
    const networkBis = await window.ethereum.request({method: 'net_version'});
    if (networkBis === '1' ) { setNetwork('Ethereum (Mainnet)'); setEtherscan('https://etherscan.io/')}
    else if (networkBis === '3' ) { setNetwork('Ropsten (Ethereum Testnet)'); setEtherscan('https://ropsten.etherscan.io/'); setContractAdress(CONTRACT_ADDRESS_V1_ROPSTEN)}
    else if (networkBis === '5' ) { setNetwork('Goerli (Ethereum Testnet)'); setEtherscan('https://goerli.etherscan.io/'); setContractAdress(CONTRACT_ADDRESS_V1_GOERLI)}
    else if (networkBis === '4' ) { setNetwork('Rinkeby (Ethereum Testnet)'); setEtherscan('https://rinkeby.etherscan.io/'); setContractAdress(CONTRACT_ADDRESS_V1_RINKEBY)}
    else if (networkBis === '42' ) { setNetwork('Kovan (Ethereum Testnet)'); setEtherscan('https://kovan.etherscan.io/'); setContractAdress(CONTRACT_ADDRESS_V1_KOVAN)}
    else if (networkBis === '100' ) { setNetwork('Gnosis (Mainnet - XDai Chain)'); setEtherscan('https://blockscout.com/xdai/mainnet/'); setContractAdress(CONTRACT_ADDRESS_V1_GNOSIS)}
    else if (networkBis === '137' ) { setNetwork('Polygon (Mainnet - Matic)'); setEtherscan('https://polygonscan.com/')}
    else if (networkBis === '80001' ) { setNetwork('Mumbai (Polygon Testnet)'); setEtherscan('https://mumbai.polygonscan.com/'); setContractAdress(CONTRACT_ADDRESS_V1_POLYGON_MUMBAI)}
  }

  /**
   * Implement checkIfWalletIsConnected method, async function to see if Metamask (or other object) is connected to our App.
   */
  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        await updateNetwork();
        const accounts = await window.ethereum.request({method: "eth_accounts"});
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("The account", account, "is connected on", network, "network.");
          setCurrentAccount(account);
        } else {
          console.log("Metamask or Ethereum Object detected, but connection failed or not yet established.")
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Ethereum object doesn't exist or not detected, get Metamask !");
    }
  }

  /**
   * Implement connectWallet method, async function to connect Metamask (or other object) to our App.
   */
  const connectWallet = async () => {
    console.log("Requesting account...");
    // Check if Metamask extension or other browser extension exists
    if (window.ethereum) {
      console.log("Metamask or Ethereum Object detected.")
      try {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        console.log("Connected to %s", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Ethereum object doesn't exist or not detected, get Metamask !");
    }
  }

  /**
   * Implement publish method from the smart contract, to put a publication on the blockchain
   */
  const post = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const megalisV1Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Initialisation d'une publication : ");
        const tx = await megalisV1Contract.publish(siren, url, hash);
        console.log("Mining...", tx.hash);
        await tx.wait();
        console.log("Mined -- ", tx.hash);
        setContractInfo({address: tx.hash})

      } else {
        console.log("Ethereum object doesn't exist or not detected, get Metamask !");
      }

    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Implement getAllSirens method from the smart contract
   */
  const allSiren = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const megalisV1Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Liste des adresses ayant publié quelque chose : ");
        const sirens = await megalisV1Contract.getAllSirens();
        console.table(sirens);

      } else {
        console.log("Ethereum object doesn't exist or not detected, get Metamask !");
      }

    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Implement getSirenPublication method from the smart contract
   */
  const sirenPublication = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const megalisV1Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Liste des publications de l'adresse %s : ", adresse);
        const publications = await megalisV1Contract.getSirenPublications(adresse);
        console.table(publications);
      } else {
        console.log("Ethereum object doesn't exist or not detected, get Metamask !");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateTransaction = async () => {
    if (contractInfo.address !== contractInfoBis) {
      try {
        const {ethereum} = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const megalisV1Contract = new ethers.Contract(contractAddress, contractABI, signer);

          megalisV1Contract.on("NewPublication", (from, publisher_siren, doc_url, doc_hash, timestamp) => {
            console.log({from, publisher_siren, doc_url, doc_hash, timestamp});
            setTxs((currentTxs) => [
              ...currentTxs,
              {
                txHash: contractInfo.address,
                address: from,
                publisher_siren: String(publisher_siren),
                doc_url: String(doc_url),
                doc_hash: String(doc_hash),
                timestamp: new Date(timestamp*1000)
              }
            ])
          })
          setContractInfoBis(contractInfo.address);
        } else {
          console.log("Ethereum object doesn't exist or not detected, get Metamask !");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const update = async () => {
    await checkIfWalletIsConnected();
    await updateTransaction();
  }

  /**
   * Listen in for emitter events!
   */
  useEffect(() => {
    checkIfWalletIsConnected();
    updateTransaction();
  }, );

  /**
   * Page HTML
   */
  return (
      <header className="App-header">
        <h1>Megalis Project</h1>
        <div>
          <h3>Prouve l'horodatage de tes documents en les publiant sur la blockchain !</h3>
        </div>

        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography sx={{ width: '33%', flexShrink: 0 }}>Réseau :</Typography>
            {currentAccount && (<Typography sx={{ color: 'text.secondary' }}>{network}</Typography>)}
            {!currentAccount && (<Button variant="outlined" onClick={connectWallet}>Non connecté : Connecte ton Wallet</Button>)}
          </AccordionSummary>
          <AccordionDetails>
            {currentAccount && (<Typography>
              Adresse connecté : {currentAccount}
            </Typography>)}
            <Typography>Pour changer de réseau, changer de réseau sur votre extension Metamask.</Typography>
          </AccordionDetails>
        </Accordion>

        <label>
          <table>
            <tbody>
            <tr>
              <Box sx={{ '& button': { m: 1 } }}>
                <td><h4> Publier un document : </h4></td>
                <td><TextField helperText="Entrez votre numéro de Siren." label="Siren" variant="outlined" onChange={sirenInput}/></td>
                <td><TextField helperText="Entrez l'url du document." label="Url" variant="outlined" onChange={urlInput}/></td>
                <td><TextField helperText="Entrez le Hash du document." label="Hash" variant="outlined" onChange={hashInput}/></td>
                <td><Button variant="contained" onClick={post}>Publier le document</Button></td>
              </Box>
            </tr></tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <td><h4> Lire les données du smart contract : </h4></td>
              <td><Button variant="contained" onClick={allSiren}>Voir tous les numéros de Sirens ayant publier</Button></td>
            </tr></tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <Box sx={{ '& button': { m: 1 } }}>
                <td><h4> Lire les données d'un siren : </h4></td>
                <td><TextField helperText="Entrez un numéro de Siren." label="Siren" variant="outlined" onChange={addressInput}/></td>
                <td><Button variant="contained" onClick={sirenPublication}>Voir les publications de ce siren</Button></td>
              </Box>
            </tr></tbody>
          </table>
        </label>

        <a href={etherscan+'address/'+contractAddress} target="_blank" rel="noreferrer">
          <Button variant="contained">
            Voir le contrat
          </Button>
        </a>
        <p></p>
        <Button variant="contained" onClick={update}> Rafraîchit la page </Button>

        {txs.map((item) => (
          <div key={item.txHash} style={{ backgroundColor: "mistyrose", marginTop: "16px", padding: "8px", border: "solid", borderRadius: "25px" }}>
            <div>
              {/*<div>Transaction Hash: {item.txHash}</div>*/}
              {/*<div>From : {item.address}</div>*/}
              <div>Numéro de Siren : {item.publisher_siren}</div>
              <div>Url du document : {item.doc_url}</div>
              <div>Hash du document : {item.doc_hash}</div>
              <div>Heure de publication : {item.timestamp.toString()}</div>
              <a href={`${etherscan}tx/${item.txHash}`} target="_blank" rel="noreferrer"><button>Voir la transaction</button></a>
            </div>
          </div>
        ))}
      </header>
  );
}

export default App;