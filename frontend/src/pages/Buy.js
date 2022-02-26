import EthLogo from "../assets/svg/eth_logo.svg";
import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import {
  ABI,
  CONTRACT_ADDRESS,
  ELECTRICKEEPER_ABI,
  ELECTRICKEEPER_CONTRACT_ADDRESS,
  BUY_DEMO_EIGHT_MINUTES_ABI,
  BUY_DEMO_EIGHT_MINUTES_CONTRACT_ADDRESS,
} from "../config";
import { BUTTON_OBJECT_4_LAST, BUTTON_OBJECT_4_FIRST } from "./ButtonData";
import ErrorModal from "../components/ErrorModal";
import FlashSuccess from "../components/flashSuccess";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";

import { DataContext } from "../DataContext";

//TODO: add ErrorModal
//MetaMask wallet shown/button if connect
//Dropdown for network switch statements

export default function Buy({ degree, userLocation, basic }) {
  const [maticPriceFeedContract, setMaticPriceFeedContract] = useState(null);
  const [electricKeeperContract, setElectricKeeperContract] = useState(null);
  const [buyDemoEightMinutesContract, setBuyDemoEightMinutesContract] =
    useState(null);
  const [inputAmount, setInputAmount] = useState("");
  const [latestPriceOfMatic_1p, setLatestPriceOfMatic_1p] = useState("");
  const [showToast, setShowToast] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { userAccountAddress, setUserAccountAddress } =
    React.useContext(DataContext);

  const { account } = useWeb3React();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      //const network = await web3.eth.net.getNetworkType();
      //await window.ethereum.enable();
      //const addressFromMetamask = await web3.eth.getAccounts();
      const chainId = await web3.eth.getChainId();
      console.log(chainId);
      if (chainId !== 80001) {
        setErrorMsg("Must be on the Mumbai test network");
      }

      //Load the smart contract(s)
      const maticPriceFeedContract = new web3.eth.Contract(
        ABI,
        CONTRACT_ADDRESS
      );
      const electricKeeperContract = new web3.eth.Contract(
        ELECTRICKEEPER_ABI,
        ELECTRICKEEPER_CONTRACT_ADDRESS
      );
      const buyDemoEightMinutesContract = new web3.eth.Contract(
        BUY_DEMO_EIGHT_MINUTES_ABI,
        BUY_DEMO_EIGHT_MINUTES_CONTRACT_ADDRESS
      );
      //Save smart contract(s) in react state
      setElectricKeeperContract(electricKeeperContract);
      setMaticPriceFeedContract(maticPriceFeedContract);
      setBuyDemoEightMinutesContract(buyDemoEightMinutesContract);

      console.log(buyDemoEightMinutesContract, "This is DEMO contract");

      if (maticPriceFeedContract !== null) {
        maticPriceFeedContract.methods
          .getLatestPrice()
          .call()
          .then((data) => {
            setLatestPriceOfMatic_1p(web3.utils.fromWei(data));
            console.log(data);
            console.log(web3.utils.fromWei(data));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    loadBlockchainData();
  }, [account]);

  const estimatedMatic = () => {
    return latestPriceOfMatic_1p && inputAmount !== ""
      ? (latestPriceOfMatic_1p * (10 * inputAmount)).toFixed(3).toString()
      : "0";
  };

  const colorNumberToColor = (colorNumber) => {
    switch (colorNumber) {
      case 0:
        return "blue";
        break;
      case 1:
        return "green";
        break;
      case 2:
        return "yellow";
        break;
      case 3:
        return "red";
        break;
      case 4:
        return "orange";
        break;
      case 5:
        return "purple";
        break;
      case 6:
        return "grey";
        break;
      case 7:
        return "white";
        break;
      default:
        console.log("not a valid num");
    }
  }

  const handleBuyButtonClick = (colorNumber) => {
    console.log("You chose the color:", colorNumber);
    console.log(account, "account in BUY handle click");
    try {
      let web3 = new Web3(window.web3.currentProvider);
      let amountOfMaticToPay = estimatedMatic();
      console.log(amountOfMaticToPay);
      web3.eth.sendTransaction({
        to: ELECTRICKEEPER_CONTRACT_ADDRESS,
        data: electricKeeperContract.methods
          .BuyElectricityTimeOn(
            colorNumber,
            web3.utils.toWei(amountOfMaticToPay)
          )
          .encodeABI(),
        value: web3.utils.toWei(amountOfMaticToPay),
        from: account,
      }).then(() => {
        setSuccessMsg(
          `Bought ${inputAmount === '1' ? '1' + " min" : inputAmount + " mins" } of electricity 
          for the ${colorNumberToColor(colorNumber)} LED`
          );
      });
    } catch (err) {
      const msg = "Connect your wallet to buy";
      console.log(err, msg);
      setErrorMsg(msg);
    }
  };

  const handleBuyDemoEightMinutes = () => {
    console.log(account, "account in BUY handle click");
    try {
      let web3 = new Web3(window.web3.currentProvider);
      let amountOfMaticToPay = estimatedMatic();
      console.log(amountOfMaticToPay);
      web3.eth.sendTransaction({
        to: BUY_DEMO_EIGHT_MINUTES_CONTRACT_ADDRESS,
        data: buyDemoEightMinutesContract.methods
          .BuyTestEightMinuteCountdown()
          .encodeABI(),
        value: 36,
        from: account,
      }).then(() => {
        setSuccessMsg("8 Minute Demo Starting!");
      });
    } catch (err) {
      const msg = "Connect your wallet to buy";
      console.log(err, msg);
      setErrorMsg(msg);
    }
  };

  const renderInputBox = () => {
    return (
      <>
        <div
          style={{
            marginBottom: 150,
            marginTop: 50,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "50%" }}
          >
            <label
              style={{
                color: "#ffdd9a",
                marginRight: "20px",
                fontSize: "13px",
              }}
              htmlFor="minutes"
            >
              price: $0.10/minute
            </label>
            <input
              type="number"
              class="input-matic"
              min="0"
              step="1"
              placeholder="enter amount of minutes"
              data-name="minutes"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              style={{ width: "100%" }}
            ></input>
          </div>
          <br />
          <label
            style={{
              color: "#ffdd9a",
              fontSize: "13px",
            }}
            htmlFor="minutes"
          >
            pick LED color to buy
          </label>
          <div style={{ width: "80%" }}>
            {BUTTON_OBJECT_4_FIRST.map((i) => (
              <button
                className={i.styleClass}
                onClick={() => handleBuyButtonClick(i.buttonClickValue)}
              >
                {i.title}
              </button>
            ))}
            <br></br>
            {BUTTON_OBJECT_4_LAST.map((i) => (
              <button
                className={i.styleClass}
                onClick={() => handleBuyButtonClick(i.buttonClickValue)}
              >
                {i.title}
              </button>
            ))}
          </div>
          <br />
          <p>
            <b>Amount: </b> &nbsp;&nbsp;&nbsp;&nbsp; ≈ &nbsp; {estimatedMatic()}{" "}
            matic
          </p>
          <button
            style={{ width: 400 }}
            className="btn-hover color-electric"
            onClick={() => handleBuyDemoEightMinutes()}
          >
            buy 8 minute demo
          </button>
        </div>
      </>
    );
  };

  return (
    <div class="container">
      <div class="row">
        <div>
          <h1>
            <br></br>
            buy electricity
          </h1>
          <p>enter the amount of minutes of electricity you want to buy </p>
          <div className="row">{renderInputBox()}</div>
        </div>
      </div>
      {errorMsg !== "" ? (
        <ErrorModal
          showToastFromProp={errorMsg !== ""}
          onClose={() => setErrorMsg("")}
          errorMsg={errorMsg}
        ></ErrorModal>
      ) : null}

        {successMsg? (
        <FlashSuccess show msg={successMsg} onClose={() => setSuccessMsg("")}/>
      ): ""}
    </div>
  );
}
