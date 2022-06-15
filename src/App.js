import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/megalisV2.json";

function App() {
  const contractAddress = "0x530A6F3bb5c5dB2de8bd0a69B46de9b71Ec34b94";

  const [currentAccount, setCurrentAccount] = useState();
  const [siren, setSiren] = useState('Aucun siren.');
  const [url, setUrl] = useState('Aucun url.');
  const [hash, setHash] = useState('Aucun hash.');
  const [adresse, setAdresse] = useState('Aucune adresse.');
  const [allPublications, setAllPublications] = useState([]);

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
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
          } else {
            console.log("No authorized account found")
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("MetaMask not detected !");
      }
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
        alert("MetaMask not detected !");
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
        const megalisV2Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Initialisation d'une publication : ");
        const tx = await megalisV2Contract.publish(siren, url, hash);
        console.log("Mining...", tx.hash);
        await tx.wait();
        console.log("Mined -- ", tx.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
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
        const megalisV2Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Liste des adresses ayant publié quelque chose : ");
        const sirens = await megalisV2Contract.getAllSirens();
        console.table(sirens);

      } else {
        console.log("Ethereum object doesn't exist!");
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
        const megalisV2Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Liste des publications de l'adresse %s : ", adresse);
        const publications = await megalisV2Contract.getSirenPublications(adresse);
        console.table(publications);
      } else {
        console.log("Ethereum object doesn't exist!");
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
        const megalisV2Contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Liste de toutes les publications : ");
        const publications = await megalisV2Contract.getAllPublication();
        console.table(publications);

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let publisCleaned = [];
        publications.forEach(publi => {
          publisCleaned.push({
            //address: publi.Publisher,
            siren: publi.Publisher_siren,
            url: publi.Doc_url,
            hash: publi.Doc_hash,
            timestamp: new Date(publi.timestamp * 1000),
            etat: publi.State
          });
        });

        /*
         * Store our data in React State
         */
        setAllPublications(publisCleaned);

      } else {
        console.log("Ethereum object doesn't exist!");
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
    let megalisV2Contract;

    const onNewPublication = (_publisher, _siren, _url, _hash, _timestamp, _state) => {
      console.log("NewPublication", _publisher, _siren, _url, _hash, _timestamp, _state);
      setAllPublications(prevState => [
        ...prevState,
        {
          address: _publisher,
          siren: _siren,
          url: _url,
          hash: _hash,
          timestamp: new Date(_timestamp * 1000),
          etat: _state
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      megalisV2Contract = new ethers.Contract(contractAddress, contractABI, signer);
      megalisV2Contract.on("NewPublication", onNewPublication);
    }

    return () => {
      if (megalisV2Contract) {
        megalisV2Contract.off("NewPublication", onNewPublication);
      }
    };
  }, );

  /**
   * Page HTML
   */
  return (
    <div className="App">
      <header className="App-header">
        <h1>Megalis Project</h1>
        <div>
          <h3>Ecrit une publication en publie la en envoyant une transaction dans la blockchain !</h3>
        </div>

        <label>
          <table>
            <tr>
              <td><h4> Publier un document : </h4></td>
              <td><p>Siren : <input type="text"  onChange={sirenInput}/></p></td>
              <td><p>Url : <input type="text" onChange={urlInput}/></p></td>
              <td><p>Hash : <input type="text" onChange={hashInput}/></p></td>
              <td><button onClick={post}>Publier le document</button></td>
            </tr>
          </table>
          <table>
            <tr>
              <td><h4> Lire les données du smart contract : </h4></td>
              <td><button onClick={allSiren}>Voir toutes les adresses ayant publier</button></td>
              <td><button onClick={allPublication}>Voir toutes les publications</button></td>
            </tr>
          </table>
          <table>
            <tr>
              <td><h4> Lire les données d'un siren : </h4></td>
              <td><p>Adresse : <input type="text"  onChange={addressInput}/></p></td>
              <td><button onClick={sirenPublication}>Voir les publications de cette adresse</button></td>
            </tr>
          </table>
        </label>

        {!currentAccount && (
            <button onClick={connectWallet}>
              Connect Wallet
            </button>
        )}

        {allPublications.map((publi, index) => {
          return (
              <div key={index}>
                <div>Siren: {publi.Publisher_siren}</div>
                <div>URL: {publi.Doc_url}</div>
                <div>Hash: {publi.Doc_hash}</div>
                <div>Time: {publi.timestamp.toString()}</div>
                <div>etat: {publi.State}</div>
              </div>)
        })
        }

        <a href={"https://ropsten.etherscan.io/address/0x530A6F3bb5c5dB2de8bd0a69B46de9b71Ec34b94"} target="_blank" onClick="fonction(this.href); return false;">
          <button>
            Voir le contrat sur Etherscan
          </button>
        </a>

      </header>
    </div>
  );
}

export default App;
