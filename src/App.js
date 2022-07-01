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
  const [txs, setTxs] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let sirenInput = (e) => {
    console.log("sirenInput")
    setSiren(e.target.value)
  };

  let urlInput = (e) => {
    console.log("urlInput")
    setUrl(e.target.value)
  };

  let hashInput = (e) => {
    console.log("hashInput")
    setHash(e.target.value)
  };

  let addressInput = (e) => {
    console.log("addressInput")
    setAdresse(e.target.value)
  };

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  const setNetworkName = async () => {
    const networkBis = await window.ethereum.request({method: 'net_version'});
    if (networkBis === '1' ) { setNetwork('Ethereum (Mainnet)')}
    else if (networkBis === '3' ) { setNetwork('Ropsten (Ethereum Testnet)')}
    else if (networkBis === '5' ) { setNetwork('Goerli (Ethereum Testnet)')}
    else if (networkBis === '4' ) { setNetwork('Rinkeby (Ethereum Testnet)')}
    else if (networkBis === '42' ) { setNetwork('Kovan (Ethereum Testnet)')}
    else if (networkBis === '100' ) { setNetwork('Gnosis (Mainnet - XDai Chain)')}
    else if (networkBis === '137' ) { setNetwork('Polygon (Mainnet - Matic)')}
    else if (networkBis === '80001' ) { setNetwork('Mumbai (Polygon Testnet)')}
  }

  const setEtherscanUrl = async () => {
    const networkBis = await window.ethereum.request({method: 'net_version'});
    if (networkBis === '1' ) { setEtherscan('https://etherscan.io/address/')}
    else if (networkBis === '3' ) { setEtherscan('https://ropsten.etherscan.io/address/')}
    else if (networkBis === '5' ) { setEtherscan('https://goerli.etherscan.io/address/')}
    else if (networkBis === '4' ) { setEtherscan('https://rinkeby.etherscan.io/address/')}
    else if (networkBis === '42' ) { setEtherscan('https://kovan.etherscan.io/address/')}
    else if (networkBis === '100' ) { setEtherscan('https://blockscout.com/xdai/mainnet/address/')}
    else if (networkBis === '137' ) { setEtherscan('https://polygonscan.com/address/')}
    else if (networkBis === '80001' ) { setEtherscan('https://mumbai.polygonscan.com/address/')}
  }

  const setAdressOfTheContract= async () => {
    const networkBis = await window.ethereum.request({method: 'net_version'});
    if (networkBis === '3' ) { setContractAdress(CONTRACT_ADDRESS_V1_ROPSTEN)}
    else if (networkBis === '5' ) { setContractAdress(CONTRACT_ADDRESS_V1_GOERLI)}
    else if (networkBis === '4' ) { setContractAdress(CONTRACT_ADDRESS_V1_RINKEBY)}
    else if (networkBis === '42' ) { setContractAdress(CONTRACT_ADDRESS_V1_KOVAN)}
    else if (networkBis === '100' ) { setContractAdress(CONTRACT_ADDRESS_V1_GNOSIS)}
    else if (networkBis === '80001' ) { setContractAdress(CONTRACT_ADDRESS_V1_POLYGON_MUMBAI)}
  }

    /**
     * Implement checkIfWalletIsConnected method
     */
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        console.log("Metamask or Ethereum Object detected.")
        try {
          const accounts = await window.ethereum.request({method: "eth_accounts"});
          if (accounts.length !== 0) {
            const account = accounts[0];
            setEtherscanUrl();
            setAdressOfTheContract();
            setNetworkName();
            console.log("The account", account, "is connected on", network, "network.");
            setCurrentAccount(account);
          } else {
            console.log("No connected account.")
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Ethereum object doesn't exist or not detected, get Metamask !");
      }
    }

    const update = async () => {
      setEtherscanUrl();
      setAdressOfTheContract();
      setNetworkName();
      checkIfWalletIsConnected();
    }

    /**
     * Implement connectWallet method
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
   * Implement publish method
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
   * Implement getAllSirens method
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
   * Implement getSirenPublication method
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

  /**
   * Implement getAllPublication method
   */
  // TODO getAllPublication à refaire dans le smart contract car bug.
  const allPublication = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const megalisV1Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Liste de toutes les publications : ");
        const publications = await megalisV1Contract.getAllPublication();
        console.table(publications);

      } else {
        console.log("Ethereum object doesn't exist or not detected, get Metamask !");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Listen in for emitter events!
   */
  useEffect(() => {
    checkIfWalletIsConnected();

    if (contractInfo.address !== "-") {
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
                /*txHash: window.event.transactionHash,*/
                address: from,
                publisher_siren: String(publisher_siren),
                doc_url: String(doc_url),
                doc_hash: String(doc_hash),
                timestamp: new Date(timestamp*1000)
              }
            ])
          })

        } else {
          console.log("Ethereum object doesn't exist or not detected, get Metamask !");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, );

  /**
   * Page HTML
   */
  return (
    <div className="App">
      <header className="App-header">
        <h1>Megalis Project</h1>
        <div>
          <h3>Ecris une publication et publie la en envoyant une transaction dans la blockchain !</h3>
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
            <tr>
              <td><h4> Publier un document : </h4></td>
              <td><p>Siren : <input type="text" onChange={sirenInput}/></p></td>
              <td><p>Url : <input type="text" onChange={urlInput}/></p></td>
              <td><p>Hash : <input type="text" onChange={hashInput}/></p></td>
              <td><button onClick={post}>Publier le document</button></td>
            </tr>
          </table>
          <table>
            <tr>
              <td><h4> Lire les données du smart contract : </h4></td>
              <td><button onClick={allSiren}>Voir tous les numéros de Sirens ayant publier</button></td>
              <td><button onClick={allPublication}>Voir toutes les publications ( Ne fonctionne pas pour le moment )</button></td>
            </tr>
          </table>
          <table>
            <tr>
              <td><h4> Lire les données d'un siren : </h4></td>
              <td><p>Numéro de Siren : <input type="text"  onChange={addressInput}/></p></td>
              <td><button onClick={sirenPublication}>Voir les publications de ce siren</button></td>
            </tr>
          </table>
        </label>

        <a href={etherscan+contractAddress} target="_blank" rel="noreferrer" onClick="fonction(this.href); return false;">
          <button>
            Voir le contrat
          </button>
        </a>

        <button onClick={update}> Update </button>

        {txs.map((item) => (
            <div key={item.txHash} style={{ backgroundColor: "black", marginTop: "16px", padding: "8px" }}>
                <div>
                  {/*<div>hashTx: {item.txHash}</div>*/}
                  <div>From: {item.address}</div>
                  <div>Siren: {item.publisher_siren}</div>
                  <div>Urldoc: {item.doc_url}</div>
                  <div>Hashdoc: {item.doc_hash}</div>
                  <div>Time: {item.timestamp.toString()}</div>
                  {/*<a href={`${etherscan}+${item.txHash}`} target="_blank"><button>Voir la transaction</button></a>-->*/}
                </div>
            </div>
        ))}

      </header>
    </div>
  );
}

export default App;

//<td><p>Siren : <input type="number"/></p></td> a mettre dans le html si uint256 au lieu de string