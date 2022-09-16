import './App.css';
import { ethers } from "ethers";
import { useState, useEffect } from 'react';
import { GoCheck } from "react-icons/go";
import abi from "./abi/abi.json";
import data from "./data/data.json";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [nfts, setNfts] = useState(data);

  const balance = async (nft) => {
    const contract = new ethers.Contract(nft.address, abi, provider);
    const tempBalance = await contract.balanceOf(account);
    const tempNfts = [nft];
    const tempNft = tempNfts[tempNfts.findIndex((obj) => obj.id == nft.id)];
    tempNft.owner = tempBalance > 0;
    tempNft.count = tempBalance.toString();
    setNfts({
      "list": tempNfts,
    })
  };

  const checkCollection = () => {
    data.list.forEach((nft) => {
      balance(nft);
    });
  };

  const initConnection = async () => {
    if(typeof window.ethereum !== "undefined"){
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);
      setAccount(accounts[0]);
    } else {
      console.log("Please install Metamask!");
    }
  }

  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {checkCollection();
  }, [account]);

  return (
    <div  className='page'>
      <div className='header'>
        <img src={require('./assets/images/logo-avo.png')} className="logoIcon"/>
        <p>
          Verify Ownership
          <span>
            <GoCheck style={{marginLeft: "5px"}}/>
          </span>
          </p>
        {account == "" ? (
          <button onClick={initConnection} className="connectButton">
            Connect Wallet
          </button>
        ) : (
      <p>...{account.substring(account.length - 7)}</p>
      )}
      </div>
      <div className='main'>
        {nfts.list.map((nft, index) => {
          return (
            <div key={index} className="card">
              <div style={{position:"relative"}}>
                <a 
                  target={"_blank"} 
                  href={ `https://opensea.io/collection/${nft.link}`}
                >
                  <img 
                    src={require(`./assets/images/logo-opensea.png`)}
                    className="cardImage"
                  />
                </a>
                <img 
                  src={require(`./assets/images/verify.png`)}
                  className="cardImage" 
                  style={{ opacity: nft.owner ? 1 : 0.2 }}
                />
                <p className="counter">{nft.count}</p>
              </div>
              <img 
                src={require(`./assets/images/${nft.id}.${nft.type}`)} 
                className="nftImage" 
                style={{ opacity: nft.owner ? 1 :0.2 }}
              />
              <p className='nftText'>{nft.name}</p>
            </div>
            );
         })}
      </div>
    </div>
  );
}

export default App;
