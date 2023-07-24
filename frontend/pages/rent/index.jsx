import React, { useState, useEffect } from "react";
import Meta from "../../components/Meta";
import Image from "next/image";
import Link from "next/link";
import { Tab, TabList, Tabs } from "react-tabs";
import Hero from "../../components/hero/hero-rent";
import { ethers } from "ethers";
import { getAllListings } from "../../queries/marketplace-queries";
import { getName } from "../../queries/erc721-queries";


const Rent = () => {
  // -- States
  const [listings, setListings] = useState([]);

  // -- Functions
  const updateListings = async () => {
    const listingResults = await getAllListings();
    var listingsTable = [];
    var listing;
    for (let i = 0; i < listingResults.length; i++) {
      listing = {
        collection_name : (await getName(listingResults[i].nft.tokenContract)),
        contract : listingResults[i].nft.tokenContract,
        id : listingResults[i].nft.tokenId,
        price : ethers.formatEther(listingResults[i].pricePerDay),
        min_days : Number(listingResults[i].minRentalDays),
        max_days : Number(listingResults[i].maxRentalDays)
      };
      listingsTable.push(listing);
    }
    await setListings(listingsTable);
  };
  
  // -- Effects
  useEffect(() => {
    updateListings();
  }, []);

  return (
    <>
   <Meta title="Rent the best NFTs to make use them | Blocklease.io" />
      <Hero />
      <section className="pb-24">
      <div className="container">
        <Tabs
          className="scrollbar-custom "
        >
          {/* Tab List */}
          <TabList className="nav nav-tabs mb-4 flex items-center space-x-1 sm:space-x-6">
            <Tab className="nav-item">
              <button
                className="nav-link nav-link--style-4 relative flex items-center whitespace-nowrap py-1.5 px-4 font-display font-semibold text-jacarta-400 hover:text-jacarta-700 dark:text-jacarta-200 dark:hover:text-white active"
                disabled="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className="mr-1 h-5 w-5 fill-orange"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M13 10h7l-9 13v-9H4l9-13z" />
                </svg>
                <span className="font-display text-base font-medium">
                  ERC-4907 NFTs
                </span>
              </button>
            </Tab>
            {/* End tab */}
          </TabList>
          {/* End TabList */}

    <div
      role="table"
      className="rounded-2lg border border-jacarta-100 bg-white text-sm dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white"
    >
        <div className="flex flex-col justify-between gap-4 rounded-t-2lg border-b border-jacarta-100 bg-jacarta-50 p-4 dark:border-jacarta-600 dark:bg-jacarta-800 md:flex-row md:items-center md:gap-6">
      <div className="hidden flex-shrink-0 items-center gap-3 md:flex">
        <div className="flex flex-shrink-0 flex-col">
          <div className="text-base font-medium text-jacarta-500 dark:text-jacarta-300 md:whitespace-nowrap">
            {listings.length} results
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-shrink-0 items-center gap-3 md:hidden">
          <div className="flex h-10 w-10 group cursor-pointer items-center justify-center rounded-2lg dark:bg-jacarta-700 dark:border-jacarta-600 border border-jacarta-100 bg-white dark:hover:bg-accent hover:bg-accent hover:border-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={16}
              height={16}
              className="h-4 w-4 fill-jacarta-700 dark:fill-white group-hover:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div
      className="flex items-center bg-jacarta-50 py-5 px-4 text-jacarta-700 dark:bg-jacarta-800 dark:text-jacarta-100"
      role="row"
    >
      <div
        className="w-6/12 truncate text-left md:w-6/12 lg:w-4/12"
        role="columnheader"
      >
        NFT
      </div>
      <div
        className="hidden w-2/12 cursor-pointer items-center justify-end text-right md:flex"
        role="columnheader"
      >
        {" "}
      </div>
      <div
        className="hidden w-2/12 cursor-pointer items-center justify-end text-right md:flex"
        role="columnheader"
      >
      </div>
      <div
        className="flex w-3/12 cursor-pointer items-center justify-end text-accent md:w-2/12"
        role="columnheader"
      >
        Price / Day
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={16}
          height={16}
          className="ml-1 flex-shrink-0 fill-accent"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
        </svg>
      </div>
      <div
        className="hidden w-1/12 cursor-pointer items-center justify-end text-right lg:flex"
        role="columnheader"
      >
        Min Days
        <svg
          width={16}
          height={25}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1"
        >
          <g clipPath="url(#clip0_2135_22855)">
            <path
              d="M8 7.219l-3.3 3.3-.942-.943L8 5.333l4.243 4.243-.943.943-3.3-3.3z"
              fill="currentColor"
            />
          </g>
          <g clipPath="url(#clip1_2135_22855)">
            <path
              d="M8 17.781l3.3-3.3.943.943L8 19.667l-4.242-4.243.942-.943 3.3 3.3z"
              fill="currentColor"
            />
          </g>

        </svg>
      </div>
      <div
        className="hidden w-1/12 cursor-pointer items-center justify-end text-right lg:flex"
        role="columnheader"
      >
        Max Days
        <svg
          width={16}
          height={25}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1"
        >
          <g clipPath="url(#clip0_2135_22855)">
            <path
              d="M8 7.219l-3.3 3.3-.942-.943L8 5.333l4.243 4.243-.943.943-3.3-3.3z"
              fill="currentColor"
            />
          </g>
          <g clipPath="url(#clip1_2135_22855)">
            <path
              d="M8 17.781l3.3-3.3.943.943L8 19.667l-4.242-4.243.942-.943 3.3 3.3z"
              fill="currentColor"
            />
          </g>

        </svg>
      </div>
    </div>

    {listings.length == 0
    ? <p className="dark:text-jacarta-200 mb-8 mt-8 text-center text-lg">No NFT available for rent. Come back later !</p> 
    : listings.map((item) => (
      (<Link
      href={"/item/" + item.contract + "_" + item.id}
      key={item.collection_name + "#" + item.id}
      className="flex border-t border-jacarta-100 py-2 px-4 transition-shadow hover:shadow-lg dark:border-jacarta-600 dark:bg-jacarta-900"
      role="row"
      >
        <div
          className="flex w-6/12 items-center md:w-6/12 lg:w-4/12"
          role="cell"
        >
          <figure className="relative mr-5 w-8 shrink-0 self-start lg:w-10">
            <Image
              width={40}
              height={40}
              src="/images/collections/collection_avatar.jpg"
              alt="items"
              className="rounded-2lg"
              loading="lazy"
            />
            {item.isVerified && (
              <div
                className="absolute -right-3 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green dark:border-jacarta-600"
                title="Verified Collection"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className="h-[.875rem] w-[.875rem] fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
                </svg>
              </div>
            )}
          </figure>
          <span className="text-sm text-jacarta-700 dark:text-white">
            {item.collection_name + "#" + item.id}
          </span>
        </div>
        <div
          className="flex w-3/12 items-center justify-end whitespace-nowrap md:w-2/12"
          role="cell"
        >
          <span>{item.rentings}</span>
        </div>
        <div
          className="hidden w-2/12 items-center justify-end md:flex"
          role="cell"
        >
        </div>
        <div
          className="flex w-3/12 items-center justify-end md:w-2/12"
          role="cell"
        >
          <span>{item.price}</span>
          <span title="ETH">
            <Image
              width={14}
              height={14}
              src="/images/chains/eth-icon.svg"
              alt="items"
              className="ml-0.5 h-4 w-4"
            />
          </span>
        </div>
        <div
          className="hidden w-1/12 items-center justify-end lg:flex"
          role="cell"
        >
          <span>{item.min_days}</span>
        </div>
        <div
          className="hidden w-1/12 items-center justify-end lg:flex"
          role="cell"
        >
          <span>{item.max_days}</span>
        </div>

      </Link>)
    ))}

    </div>
          {/* End Trending content */}
        </Tabs>
      </div>
    </section>
    </>
);
};

export default Rent;
