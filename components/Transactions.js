import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
const Transactions = ({ txs }) => {
  const [value, setValue] = useState([]);

  const getData = async () => {
    const local = JSON.parse(localStorage.getItem("hash"));
    setValue(local);
  };


  useEffect(() => {
    getData();
    console.log(value);
  }, [txs]);

  return (
    <div className="card bg-base-200 p-8 shadow-xl mr-4 w-full mb-24 lg:mb-8 border border-success">
      <h1 className="text-3xl mb-5 font-bold">Recent Transactions History</h1>
      {/* <button onClick={getData}>Show History</button> */}
      {value ? (
        <>
          {value.map((item, index) => {
            return (
              <div key={index} className="alert alert-success m-1 flex flex-col space-y-5">
                <h1 className="font-bold"> Amount: {item.value} ETH</h1>
                <div className=" flex flex-col w-full">
                  <p className="flex  flex-col  md:flex-row mx-auto">
                  Hash: {item.hash}

                  </p>
        
                  <a className = "border border-blue-500 p-1 rounded-md w-full md:w-[30%] mt-3 mx-auto text-center hover:bg-sky-300  "
                    // className="pl-10"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://rinkeby.etherscan.io/tx/${item.hash}`}
                  >
                   Transaction Details
                  </a>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <p className="stat-desc">No Transactions yet...</p>
      )}
    </div>
  );
};

export default Transactions;
