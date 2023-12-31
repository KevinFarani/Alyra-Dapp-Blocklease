import React, { useState, useEffect  } from "react";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Meta from "../../components/Meta";
import { getMinted, mint } from "../../queries/rentablenfts-queries";
import { CONTRACT_RENTABLENFTS_ADDR } from "../../constants/contracts";
import { Toaster } from 'react-hot-toast';

const Mint = () => {
  
  // -- States
  const [copied, setCopied] = useState(false);
  const [minted, setMinted] = useState(null);

  // -- Functions
  const updateMinted = async () => {
    const minted = Number(await getMinted());
    await setMinted(minted);
  };
  const buttonMint = async () => {
    await mint();
    updateMinted();
  };  

  // -- Effects
  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  useEffect(() => {
    updateMinted();
  });


  return (
    <>
      <div><Toaster/></div>
      <Meta title="RentableNFTs Collection for testing purposes | Blocklease.io" />

      <div className="pt-[5.5rem] lg:pt-24">
        {/* <!-- Banner --> */}
        <div className="relative h-[300px]">
          <Image
            src="/images/collections/collection_banner.jpg"
            alt="banner"
            width={1519}
            height={300}
            className="w-full h-full object-center object-cover"
          />
        </div>
        {/* <!-- end banner --> */}

        {/* <!-- Profile --> */}
              <section
                key={1}
                className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28"
              >
                {/* <!-- Avatar --> */}
                <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <Image
                      width={141}
                      height={141}
                      src="/images/collections/collection_avatar.jpg"
                      alt="Crazy Cat"
                      className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
                    />
                </div>

                <div className="container">
                  <div className="text-center">
                    <h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white">
                      RentableNFTs
                    </h2>
                    <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex items-center justify-center rounded-full border bg-white py-1.5 px-4">
                      <Tippy
                        hideOnClick={false}
                        content={
                          copied ? <span>copied</span> : <span>copy</span>
                        }
                      >
                        <button className="js-copy-clipboard dark:text-jacarta-200 max-w-[10rem] select-none overflow-hidden text-ellipsis whitespace-nowrap">
                          <CopyToClipboard
                            text={CONTRACT_RENTABLENFTS_ADDR}
                            onCopy={() => setCopied(true)}
                          >
                            <span>{CONTRACT_RENTABLENFTS_ADDR}</span>
                          </CopyToClipboard>
                        </button>
                      </Tippy>
                    </div>
                    
                    <div className="mb-8">
                      <span className="text-jacarta-400 text-sm font-bold">
                        Created by{" "}
                      </span>
                      <Link
                        href="https://www.alyra.fr/"
                        className="text-accent text-sm font-bold"
                      >
                        Alyra Labs
                      </Link>
                    </div>

                    <div className="dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex flex-wrap items-center justify-center rounded-xl border bg-white">
                      <Link
                        href="#"
                        className="dark:border-jacarta-600 border-jacarta-100 w-1/2 rounded-l-xl border-r py-4 hover:shadow-md sm:w-32"
                      >
                        <div className="text-jacarta-700 mb-1 text-base font-bold dark:text-white">
                          {minted}
                        </div>
                        <div className="text-2xs dark:text-jacarta-400 font-medium tracking-tight">
                          Total Minted
                        </div>
                      </Link>

                    </div>

                    <p className="dark:text-jacarta-300 mx-auto max-w-xl text-lg">
                      Collection of ERC-4907 NFTs, made for tests of Blocklease.io
                    </p>

                    <button
                      className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-50 mt-10 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                      onClick={() => buttonMint()}
                    >
                      Mint
                    </button>
                  </div>
                </div>

                <div className="text-center">

                </div>

              </section>

        {/* <!-- end profile --> */}
      </div>
    </>
  );
};

export default Mint;
