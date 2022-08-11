import Head from "next/head";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Profile from "../components/Profile";
import SendEth from "../components/SendEth";
import Transactions from "../components/Transactions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import History from "./history";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [condition, setCondition] = useState(false);
  const [open, setOpen] = useState(false);
  const [buttonText, setButtonText] = useState('show History')
  const [hash, setHash] = useState([]);

  const [address, setAddress] = useState();
  const [amount, setAmount] = useState();

  const [txs, setTxs] = useState();

  const showToastMessage = () => {
    toast.success("Transaction Successfull !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessage2 = () => {
    toast.error("Transaction Failed !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleAddress = (e) => {
    setErrorMessage("");
    setAddress(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          console.log(result, "mud result");
          setDefaultAccount(result[0]);
          getAccountBalance(result[0].toString());
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  useEffect(() => {
    connectWalletHandler();
    if (typeof window !== "undefined") {
      if (window.ethereum) {
        console.log("MetaMask Here!");
        window.ethereum.on("accountsChanged", (newAcc) => {
          setDefaultAccount(newAcc);
          getAccountBalance(newAcc.toString());
        });
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      } else {
        console.log("Need to install MetaMask");
        setErrorMessage(
          "Please install MetaMask browser extension to interact"
        );
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCondition(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    try {
      ethers.utils.getAddress(address);
      setErrorMessage("");

      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(amount),
      });
      await provider.waitForTransaction(tx.hash);
      const receipt = await provider.getTransactionReceipt(tx.hash);
      const price = ethers.utils.formatEther(tx.value);
      setHash([...hash, receipt.transactionHash]);
      const oldData = JSON.parse(localStorage.getItem("hash"));
      const obj = {
        hash: receipt.transactionHash,
        value: price,
      };
      if (oldData == null) {
        localStorage.setItem("hash", JSON.stringify([obj]));
      } else {
        localStorage.setItem("hash", JSON.stringify([...oldData, obj]));
      }

      showToastMessage();

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setDefaultAccount(result[0]);
          getAccountBalance(result[0].toString());
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
      setTxs([tx]);
      setCondition(false);
    } catch (err) {
      setErrorMessage(err.message);
      showToastMessage2();
    }
  };

  const show = ()=>{
    if(buttonText === 'show History'){
    setOpen(true);
    setButtonText('hide History')

  }else{
    if(buttonText === 'hide History'){
      setOpen(false);
      setButtonText('show History')
    
  }}}
  return (
    <div className="min-h-screen flex-col flex justify-center items-center">
      {errorMessage && (
        <div className="alert alert-error mt-4">
          <div className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 mx-2 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              ></path>
            </svg>
            <label>{errorMessage}</label>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center w-full container p-4  ">
        <div className="w-full  ">
          <div className="flex justify-center flex-col w-full  ">

            <div className=" w-full mx-auto mb-5">

            <Profile  className="mb-5"
              defaultAccount={defaultAccount}
              userBalance={userBalance}
              errorMessage={errorMessage}
              connectWalletHandler={connectWalletHandler}
              connButtonText={connButtonText}
            />
            </div>

            <div className="w-full mx-auto mt-5 ">

            <SendEth
              txs={txs}
              handleAddress={handleAddress}
              handleAmount={handleAmount}
              handleSubmit={handleSubmit}
              errorMessage={errorMessage}
              defaultAccount={defaultAccount}
            />
            </div>

          </div>

          <div className=" border-2 mt-[100px] mx-auto flex">
            <button  className="btn w-full btn-outline btn-warning mt-8 " onClick={show}>{buttonText}</button>
          </div>

          {open ? (<div className="mt-8 ">
            <Transactions txs={txs} hash={hash} />
          </div>) : null} 

          
          {/* <div className="mt-10">
            <History hash={hash} tsx={txs} />
          </div> */}
        </div>
        <ToastContainer />
      </div>

      {/* <footer className="fixed bottom-0 p-4 footer bg-base-100 border-t-2 border-base-200 text-base-content footer-center"></footer> */}
    </div>
  );
}
