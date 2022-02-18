import { Route, Routes } from "react-router-dom";
import { DataContext } from "./DataContext";

import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
import { isMobile } from "react-device-detect";
import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import Home from "./pages/Home";
import Buy from "./pages/Buy";

import About from "./pages/About";
import MobileDetected from "./pages/MobileDetected";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  injected,
  walletconnect,
  resetWalletConnector,
  walletlink,
} from "./components/connectors";

const MyContext = React.createContext();

function App() {
  const [userAccountAddress, setUserAccountAddress] = useState("");
  const [connectedAddrValue, setConnectedAddrValue] = useState("");

  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
  const web3 = useWeb3React();

  const handleConnect = () => {
    try {
      web3.activate(injected, undefined, true);
    } catch (error) {
      console.error(error);
    }
  };

  const connectCoinbaseSimple = async () => {
    try {
      await web3.activate(walletlink);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleConnectMetamask = async () => {
    let that = this;
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const network = await web3.eth.net.getNetworkType();
    await window.ethereum.enable();
    //Fetch account data:
    const accountFromMetaMask = await web3.eth.getAccounts();
    console.log(accountFromMetaMask, "account in app.js before set state");
    setUserAccountAddress(accountFromMetaMask);
    setConnectedAddrValue(
      String(accountFromMetaMask).substr(0, 5) +
        "..." +
        String(accountFromMetaMask).substr(38, 4)
    );

    console.log(userAccountAddress, "user metamask address after set state");
  };

  return (
    <DataContext.Provider value={{ userAccountAddress: userAccountAddress }}>
      {isMobile ? (
        ""
      ) : (
        <Navbar
          handleConnectMetamask={handleConnectMetamask}
          connectedAddrValue={connectedAddrValue}
        />
      )}
      <main>
        <div>
          <button onClick={handleConnect}>Connect Metamask Wallet</button>
          <p>
            <span>Status: {web3.active ? "🟢" : web3.error ? "🔴" : "🟠"}</span>
          </p>
          <pre>{(console.log(web3), account)}</pre>
        </div>

        <div>
          <button onClick={connectCoinbaseSimple}>
            Connect Coinbase Wallet
          </button>
          <p>
            <span>Status: {web3.active ? "🟢" : web3.error ? "🔴" : "🟠"}</span>
          </p>
          <pre>{(console.log(web3), account)}</pre>
        </div>

        {isMobile ? (
          <MobileDetected />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/about" element={<About />} />
            <Route path="/error" element={<MobileDetected />} />
          </Routes>
        )}
      </main>

      <Footer />
    </DataContext.Provider>
  );
}

export default App;
