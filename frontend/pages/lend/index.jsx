import React, { useState } from "react";
import Meta from "../../components/Meta";
import { ethers } from "ethers";
import { getApproval, setApproval } from "../../queries/erc721-queries";
import { lend } from "../../queries/marketplace-queries";
import { CONTRACT_MARKETPLACE_ADDR } from "../../constants/contracts";
import { useAccount } from 'wagmi';
import { CONTRACT_RENTABLENFTS_ADDR } from "../../constants/contracts";

import { Toaster } from 'react-hot-toast';

const Lend = () => {

  const { account, isConnected, address } = useAccount();

  // -- States
  const [nftAddress, setNftAddress] = useState(null);
  const [nftId, setNftId] = useState(null);
  const [pricePerDay, setPricePerDay] = useState(null);
  const [minDays, setMinDays] = useState(null);
  const [maxDays, setMaxDays] = useState(null);
  
  // -- Functions
  const buttonLend = async () => {
    const isApproved = await getApproval(nftAddress, [address, CONTRACT_MARKETPLACE_ADDR]);
    if(!isApproved){
      await setApproval(nftAddress, [CONTRACT_MARKETPLACE_ADDR, true]);
    }
    await lend([nftAddress, nftId, ethers.parseEther(pricePerDay), minDays, maxDays]);
  };

  return (
    <div>
      <div><Toaster/></div>
      <Meta title="Lend your NFTs to generate earnings | Blocklease.io" />
      {/* <!-- Create --> */}
      <section className="relative py-24">

        <div className="container">
          <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
            Lend
          </h1>

            {/* <!-- Collection Input --> */}
            <div className="mb-6">
              <label
                htmlFor="item-name"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                NFT Address <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="item-name"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder={CONTRACT_RENTABLENFTS_ADDR}
                onChange={e => setNftAddress(e.target.value)}
                required
              />
            </div>

            {/* <!-- Token ID --> */}
            <div className="mb-6">
              <label
                htmlFor="item-name"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                NFT ID <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="item-name"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="1"
                onChange={e => setNftId(e.target.value)}
                required
              />
            </div>

            {/* <!-- Renting Price --> */}
            <div className="mb-6">
              <label
                htmlFor="item-external-link"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Price / Days in ETH <span className="text-red">*</span>
              </label>
              <p className="dark:text-jacarta-300 text-2xs mb-3">
                Please note that a 5% fee will apply on the amount of each rental
              </p>
              <input
                type="url"
                id="item-external-link"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="0.001"
                onChange={e => setPricePerDay(e.target.value)}
                required
              />
            </div>

            {/* <!-- Rental Boundaries --> */}
            <div className="mb-6">
              <label
                htmlFor="item-external-link"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Minimum Days <span className="text-red">*</span>
              </label>
              <input
                type="url"
                id="item-external-link"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="1"
                onChange={e => setMinDays(e.target.value)}
              />
              <label
                htmlFor="item-external-link"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Maximum Days <span className="text-red">*</span>
              </label>
              <input
                type="url"
                id="item-external-link"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="10"
                onChange={e => setMaxDays(e.target.value)}
              />
            </div>
            
            <button
                className={!nftAddress || !nftId || !pricePerDay || !minDays || !maxDays ? (
                  "shadow-accent-volume inline-block w-full mt-10 rounded-full py-3 px-8 text-center font-semibold transition-all"
                ) : (
                  "bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full mt-10 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                )}
                disabled={!nftAddress || !nftId || !pricePerDay || !minDays || !maxDays ? (
                  true
                ) : (
                  false
                )}
                onClick={() => buttonLend()}
              >
              Lend
            </button>
        </div>
      </section>
      {/* <!-- end create --> */}
    </div>
  );
};

export default Lend;
