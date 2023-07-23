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
import { useEffect, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header01() {
  const [toggle, setToggle] = useState(false);
  const [isCollapse, setCollapse] = useState(null);

  // window resize
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        setToggle(false);
      }
    });
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
            <ConnectButton />
            <DarkMode />
          </div>
          {/* End header right content (metamask and other) for desktop */}
        </div>
        {/* header menu conent end for desktop */}

        <div className="ml-auto flex lg:hidden">
          <Link
            href="/profile/user_avatar"
            className="border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
            aria-label="profile"
            >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" />
            </svg>

          </Link>
          <DarkMode />
          <button
            className="js-mobile-toggle border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
            aria-label="open mobile menu"
            onClick={() => setToggle(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" />
            </svg>
          </button>
        </div>
        {/* End header right content  for mobile */}
      </div>
      {/* End flex item */}
    </header>
    {/* main desktop menu end */}
  </>;
}
