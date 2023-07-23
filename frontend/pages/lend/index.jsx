import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Meta from "../../components/Meta";
import { prepareWriteContract, writeContract } from "@wagmi/core";

const Lend = () => {

  const [file, setFile] = useState("");

  const dispatch = useDispatch();

  const handleChange = (file) => {
    setFile(file.name);
  };

  return (
    <div>
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
                Collection Contract Address <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="item-name"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="0x9b16c0ee25aA4C1b1D4ea873ce6d79a4ec42b89e"
                required
              />
            </div>

            {/* <!-- Token ID --> */}
            <div className="mb-6">
              <label
                htmlFor="item-name"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Collection Contract Address <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="item-name"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="1"
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
              />
            </div>

            {/* <!-- Rental Boundaries --> */}
            <div className="mb-6">
              <label
                htmlFor="item-external-link"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Rental Boundaries <span className="text-red">*</span>
              </label>
              <input
                type="url"
                id="item-external-link"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="1"
              />
              <input
                type="url"
                id="item-external-link"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="1"
              />
            </div>

            {/* <!-- Max Days --> */}
            <div className="mb-6">
              <label
                htmlFor="item-external-link"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Minimum rental days <span className="text-red">*</span>
              </label>
              <input
                type="url"
                id="item-external-link"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="1"
              />
            </div>


            <button
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full mt-10 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                onClick={() => mint()}
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
