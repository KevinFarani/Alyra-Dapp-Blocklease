import Image from "next/image";
import Link from "next/link";
import DarkMode from "../mode/DarkMode";
import Logo from "./../../public/images/logo.png";
import WhiteLogo from "./../../public/images/logo_white.png";
import { useRouter } from "next/router";
import {
  isChildrenPageActive,
  isParentPageActive,
} from "../../utils/daynamicNavigation";
import { ethers } from "ethers";
import { getEarnings, getRefunds, redeemEarnings, redeemRefunds } from "../../queries/marketplace-queries";
import { useEffect, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Header01() {
  const { account, isConnected, address } = useAccount();

  // -- States
  const [earningsRedeemable, setEarningsRedeemable] = useState("0");
  const [earningsNotRedeemable, setEarningsNotRedeemable] = useState("0");
  const [refunds, setRefunds] = useState("0");

  const updateEarnings = async () => {
    const earningsList = await getEarnings(address);
    let earningsRedeemableAmount = 0;
    let earningsNotRedeemableAmount = 0;
    let dateNowUNIX = Math.floor(Date.now() / 1000);
    if(!(earningsList=== undefined)) {
      for (let i = 0; i < earningsList.length; i++) {
        if(!earningsList[i].redeemed && !earningsList[i].cancelled) {
          if(Number(earningsList[i].redeemableDate) <= dateNowUNIX) {
            earningsRedeemableAmount += Number(ethers.formatEther(earningsList[i].amount));
          } else {
            earningsNotRedeemableAmount += Number(ethers.formatEther(earningsList[i].amount));
          }
        }
      }
    }
    await setEarningsRedeemable(earningsRedeemableAmount);
    await setEarningsNotRedeemable(earningsNotRedeemableAmount);
  };
  const updateRefunds = async () => {
    const refundsAmount = Number(ethers.formatEther(await getRefunds(address)));
    await setRefunds(refundsAmount);
  };
  const buttonRedeemEarnings = async () => {
    await redeemEarnings();
    updateEarnings();
  };  
  const buttonRedeemRefunds = async () => {
    await redeemRefunds();
    updateRefunds();
  };  

  useEffect(() => {
    updateEarnings();
    updateRefunds();
  });

  const route = useRouter();
  /* -------------------------------------------------------------------------- */
  /*                            daynamic navigations                            */
  /* -------------------------------------------------------------------------- */
  
  return <>
    {/* main desktop menu sart*/}
    <header className="js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors">
      <div className="flex items-center px-6 py-6 xl:px-24 ">
        <Link className="shrink-0" href="/" >
          <div className="dark:hidden">
            <Image
              src={Logo}
              height={50}
              width={232}
              alt="Blocklease.io | NFT Rental Marketplace"
              className="max-h-7 h-auto "
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src={WhiteLogo}
              height={50}
              width={232}
              alt="Blocklease.io | NFT Rental Marketplace"
            />
          </div>

        </Link>
        {/* End  logo */}

        <div className="js-mobile-menu dark:bg-jacarta-800 invisible fixed inset-0 z-10 ml-auto items-center bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:flex lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent">
          <nav className="navbar w-full">
            <ul className="flex flex-col lg:flex-row">
          
              {/* Home */}
              <li className="group">
                <Link href="/" >

                  <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                    <span
                      className={
                        isChildrenPageActive(route.asPath, "/")
                          ? "text-accent dark:text-accent"
                          : ""
                      }
                    >
                      Home
                    </span>
                  </button>
                </Link>
              </li>

              {/* Rent */}
              <li className="group">
                <Link href="/rent" >

                  <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                    <span
                      className={
                        isChildrenPageActive(route.asPath, "/rent")
                          ? "text-accent dark:text-accent"
                          : ""
                      }
                    >
                      Rent
                    </span>
                  </button>
                </Link>
              </li>

              {/* Lend */}
              <li className="group">
                <Link href="/lend" >

                  <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                    <span
                      className={
                        isChildrenPageActive(route.asPath, "/lend")
                          ? "text-accent dark:text-accent"
                          : ""
                      }
                    >
                      Lend
                    </span>
                  </button>
                </Link>
              </li>

              {/* Mint */}
              <li className="group">
                <Link href="/mint" >

                  <button className="text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5">
                    <span
                      className={
                        isChildrenPageActive(route.asPath, "/mint")
                          ? "text-accent dark:text-accent"
                          : ""
                      }
                    >
                      Mint
                    </span>
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
          {/* End menu for desktop */}
          <div className="ml-8 hidden items-center lg:flex xl:ml-12">
            {/* End metamask Wallet */}
            {isConnected &&
              <div className="js-nav-dropdown group-dropdown relative">
                <button className="dropdown-toggle border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]">
                <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-piggy-bank">
                  <path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm1.138-1.496A6.613 6.613 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.602 7.602 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962z"/>
                  <path fill-rule="evenodd" d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069c0-.145-.007-.29-.02-.431.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a.95.95 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.735.735 0 0 0-.375.562c-.024.243.082.48.32.654a2.112 2.112 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595zM2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.558 6.558 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.649 4.649 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393zm12.621-.857a.565.565 0 0 1-.098.21.704.704 0 0 1-.044-.025c-.146-.09-.157-.175-.152-.223a.236.236 0 0 1 .117-.173c.049-.027.08-.021.113.012a.202.202 0 0 1 .064.199z"/>
                </svg>              
                </button>
                <div className="dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl hidden lg:invisible lg:opacity-0">
                  <div className="dark:border-jacarta-600 border-jacarta-100 mx-5 mb-5 rounded-lg border p-4">
                    <div>
                      <span className="dark:text-jacarta-200 text-sm font-medium tracking-tight">
                        Earnings Available
                      </span>
                      <div className="flex items-center">
                        <svg className="icon icon-ETH -ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
                          <use xlinkHref="/icons.svg#icon-ETH" />
                        </svg>
                        <span className="text-green text-lg font-bold">
                          {earningsRedeemable + " ETH"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5">
                      <span className="dark:text-jacarta-200 text-sm font-medium tracking-tight">
                        Earnings to come
                      </span>
                      <div className="flex items-center">
                        <svg className="icon icon-ETH -ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
                          <use xlinkHref="/icons.svg#icon-ETH" />
                        </svg>
                        <span className="text-gray text-lg font-bold">
                          {earningsNotRedeemable + " ETH"}
                        </span>
                      </div>
                    </div>
                    <button
                      className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex text-center items-center space-x-2 rounded-xl mt-3 px-5 py-2 transition-colors"
                      onClick={() => buttonRedeemEarnings()}
                    >
                      <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                        Redeem
                      </span>
                    </button>
                  </div>
                
                  <div className="dark:border-jacarta-600 border-jacarta-100 mx-5 mb-5 rounded-lg border p-4">
                    <span className="dark:text-jacarta-200 text-sm font-medium tracking-tight">
                      Refunds
                    </span>
                    <div className="flex items-center">
                      <svg className="icon icon-ETH -ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
                        <use xlinkHref="/icons.svg#icon-ETH" />
                      </svg>
                      <span className="text-red text-lg font-bold">
                        {refunds + " ETH"}
                      </span>
                    </div>
                    <button
                      className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex text-center items-center space-x-2 rounded-xl mt-3 px-5 py-2 transition-colors"
                      onClick={() => buttonRedeemRefunds()}
                    >
                      <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                        Redeem
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            }
            <DarkMode />
          </div>

          <div className="ml-8 hidden items-center lg:flex xl:ml-12 w-full">
            <ConnectButton />
          </div>

          {/* End header right content (metamask and other) for desktop */}
        </div>
        {/* header menu conent end for desktop */}

      </div>
      {/* End flex item */}
    </header>
    {/* main desktop menu end */}
  </>;
}



