import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ItemsTabs } from "../../components/component";
import Meta from "../../components/Meta";
import { useDispatch } from "react-redux";
import { bidsModalShow } from "../../redux/counterSlice";
import Image from "next/image";
import { ethers } from "ethers";
import { getListing, book, getBookings } from "../../queries/marketplace-queries";
import { getName } from "../../queries/erc721-queries";
import { Toaster } from 'react-hot-toast';


const Item = () => {
  const dispatch = useDispatch();
  const { asPath }  = useRouter();
  const pid = asPath.split("/").pop();

  // -- States
  const [imageModal, setImageModal] = useState(false);
  const [listing, setListing] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [collectionName, setCollectionName] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // -- Functions
  const getBookingsInfo = async () => {
    const tokenInfo = pid.split("_");
    const bookingsInfo = await getBookings([tokenInfo[0], tokenInfo[1]]);
    await setBookings(bookingsInfo);
  };

  const getListingInfo = async () => {
    const tokenInfo = pid.split("_");
    const listingInfo = await getListing([tokenInfo[0], tokenInfo[1]]);
    await setCollectionName(await getName(tokenInfo[0]));
    await setListing(listingInfo);
  };

  const buttonBook = async () => {
    const startDateUNIX = Math.floor(startDate.getTime() / 1000);
    const endDateUNIX = Math.floor(endDate.getTime() / 1000);
    const bookingPrice = ethers.formatEther(listing.pricePerDay) * Math.ceil((endDate.getTime() - startDate.getTime() + 1) / (1000 * 60 * 60 * 24));
    await book([listing.nft.tokenContract, listing.nft.tokenId, startDateUNIX, endDateUNIX], bookingPrice.toString());
    await getBookingsInfo();
  };

  // -- Effects
  useEffect(() => {
    getListingInfo();
    getBookingsInfo();
  }, []);

  return (
    <>
      <div><Toaster/></div>

      <Meta title={`Rent NFT | Blocklease.io`} />
      {/*  <!-- Item --> */}
      <section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <Image
            width={1519}
            height={773}
            priority
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="container">

                <div className="md:flex md:flex-wrap" key="1">
                  {/* <!-- Image --> */}
                  <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
                    <button
                      className=" w-full"
                      onClick={() => setImageModal(true)}
                    >
                      <Image
                        width={585}
                        height={726}
                        src="/images/collections/collection_avatar.jpg"
                        className="rounded-2xl cursor-pointer h-full object-cover w-full"
                      />
                    </button>

                    {/* <!-- Modal --> */}
                    <div
                      className={
                        imageModal ? "modal fade show block" : "modal fade"
                      }
                    >
                      <div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
                        <Image
                          width={582}
                          height={722}
                          src="/images/collections/collection_avatar.jpg"
                          className="h-full object-cover w-full rounded-2xl"
                        />
                      </div>

                      <button
                        type="button"
                        className="btn-close absolute top-6 right-6"
                        onClick={() => setImageModal(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="h-6 w-6 fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                        </svg>
                      </button>
                    </div>
                    {/* <!-- end modal --> */}
                  </figure>

                  {/* <!-- Details --> */}
                  <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
                    <div className="mb-3 flex">
                      {/* <!-- Collection --> */}
                      <div className="flex items-center">
                        <Link
                          href="/mint"
                          className="text-accent mr-2 text-sm font-bold"
                        >
                         {collectionName && collectionName}
                        </Link>
                      </div>


                    </div>

                    <h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
                      {listing && collectionName + "#" + listing.nft.tokenId}
                    </h1>

                    {/* <!-- Creator / Owner --> */}
                    <div className="mb-3 flex flex-wrap">
                      <div className="mb-1 flex">
                        <div className="flex flex-col justify-center">
                          <span className="text-jacarta-400 block text-sm dark:text-white">
                            Contract Address
                          </span>
                          <Link
                            href="/mint"
                            className="text-accent block disabled-link"
                          >
                            <span className="text-sm font-bold">
                              {listing && listing.nft.tokenContract}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8 flex flex-wrap">
                      <div className="mb-4 flex">
                        <div className="flex flex-col justify-center">
                          <span className="text-jacarta-400 block text-sm dark:text-white">
                            Lended by
                          </span>
                          <Link
                            href="#"
                            className="text-accent block disabled-link"
                          >
                            <span className="text-sm font-bold">
                              {listing && listing.lender}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8">
                      <div className="mb-8 sm:flex sm:flex-wrap">
                        <div className="sm:w-1/2 sm:pr-4 lg:pr-8">
                          <div className="mt-3 flex">
       
                            <div>
                              <div className="flex items-center whitespace-nowrap">
                                <Tippy content={<span>ETH</span>}>
                                  <span className="-ml-1">
                                    <svg className="icon mr-1 h-4 w-4">
                                      <use xlinkHref="/icons.svg#icon-ETH"></use>
                                    </svg>
                                  </span>
                                </Tippy>
                                <span className="text-green text-lg font-medium leading-tight tracking-tight">
                                  {listing && ethers.formatEther(listing.pricePerDay)} ETH / Day
                                </span>
                              </div>
                              <span className="flex items-center whitespace-nowrap mt-3">
                                Min Days : {listing && Number(listing.minRentalDays)}
                              </span>
                              <span className="flex items-center whitespace-nowrap mt-3">
                                Max Days : {listing && Number(listing.maxRentalDays)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="dark:border-jacarta-600 sm:border-jacarta-100 mt-4 sm:mt-0 sm:w-1/2 sm:border-l sm:pl-4 lg:pl-8">
                          <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
                            From
                            <DatePicker dateFormat="dd/MM/yyyy" selected={startDate} onChange={(date) => setStartDate(date)} />
                          </span>
                          <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
                            To
                            <DatePicker dateFormat="dd/MM/yyyy" selected={endDate} onChange={(date) => setEndDate(date)} />
                          </span>
                        </div>
                      </div>

                        <button
                          className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                          onClick={() => buttonBook()}
                        >
                          Book  {listing && " for " + ethers.formatEther(listing.pricePerDay) * Math.ceil((endDate.getTime() - startDate.getTime() + 1) / (1000 * 60 * 60 * 24)) + " ETH"} 
                        </button>
                    </div>
                    {/* <!-- end bid --> */}
                  </div>
                  {/* <!-- end details --> */}
                </div>
          <ItemsTabs bookings={bookings} />
        </div>
      </section>
      {/* <!-- end item --> */}
    </>
  );
};

export default Item;
