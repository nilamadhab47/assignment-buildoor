/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletList from "./components/UserList";

const { formatEther } = ethers.utils;

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "chat-app", // Required
      infuraId: "775970655dd8499fbc335ca9008938bc", // Required unless you provide a JSON RPC url; see `rpc` below
    },
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      appName: "chat-app", // Required
      infuraId: "775970655dd8499fbc335ca9008938bc", // required
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

function App() {
  const [wallets, setWallets] = useState([
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x7890abcdef1234567890abcdef1234567890abcd",
  ]);
  const [provider, setProvider] = useState();
  const [wallet, setWallet] = useState("");
  const [connection, setConnection] = useState();
  const [balance, setBalance] = useState("");
  const Users = [];

  const connectWallet = async () => {
    if (!window.ethereum) {
      window.alert(
        "To interact with this platform, please install the MetaMask browser extension."
      );
    }
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection, "any");
      const signer = provider.getSigner(0);
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      if (wallet === address) {
        window.alert("add a different acount");
      } else {
        setWallet(address);
        setConnection(connection);
        setProvider(provider);
        setBalance(formatEther(balance));
        setWallets([...wallets, address]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  function removeWallet(walletToRemove) {
    setWallets(wallets.filter((wallet) => wallet !== walletToRemove));
  }

  const disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    setWallet();
    setProvider(undefined);
    setWallets(wallets.filter((walletss) => walletss !== wallet));
  };

  useEffect(() => {
    if (connection && provider) {
      connection.on("accountsChanged", async ([currentAccount]) => {
        console.log("accountsChanged: ", currentAccount);
        const balance = await provider.getBalance(currentAccount);
        setWallet(currentAccount);
        setBalance(formatEther(balance));
        setWallets([...wallets, currentAccount]);
      });
      connection.on("chainChanged", () => {
        window.location.reload();
      });

      connection.on("connect", (info) => {
        console.log(info);
      });

      connection.on("disconnect", (error) => {
        console.log(error);
      });
    }
  }, [connection, provider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  // console.log(Users)
  // console.log(Users.length)
  // console.log(Users.wallet)
  function addWallet() {
    Users.push(...wallets, wallet);
  }

  return (
    <div className="App">
      <header className="App-header">
      <div className="content">
    <h2 className="heading-h">Dapp Chat app</h2>
    <h2 className="heading-h">Dapp Chat app</h2>
  </div>
        {/* <h1 className="heading text-center text-xl mb-7 p-4">Dapp Chat app</h1> */}
      </header>
      <div className="usersList">
        <div className="button-group">
        <button onClick={connectWallet} id="connect-button" className="glow-on-hover">
          Connect
        </button>

        <button onClick={disconnectWallet} className="glow-on-hover">Disconnect</button>
        </div>
       
        <div className="list">
          <h2 className="title">USERS ONLINE :</h2>

          <p className="noUsers">Total Users online: {wallets.length}</p>
          <WalletList wallets={wallets} removeWallet={removeWallet} />
        </div>
      </div>
    </div>
  );
}

export default App;
