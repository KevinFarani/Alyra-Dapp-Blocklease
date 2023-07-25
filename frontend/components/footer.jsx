import Link from "next/link";
import { footerMenuList, socialIcons } from "../data/footer_data";
import Image from "next/image";
import { CONTRACT_MARKETPLACE_ADDR } from "../constants/contracts";

const footer = () => {
  return (
    <>
      {/* <!-- Footer --> */}

      <footer className="dark:bg-jacarta-900 page-footer bg-white">
        <div className="container">
          <div className="grid grid-cols-6 gap-x-7 gap-y-14 pt-24 pb-12 md:grid-cols-12">
            <div className="col-span-3 md:col-span-4">
              {/* <!-- Logo --> */}
              <Link href="#" className="mb-6 inline-block">
                <Image
                  width={130}
                  height={28}
                  src="/images/logo.png"
                  className="max-h-7 dark:hidden"
                  alt="Blocklease.io | NFT Rental Marketplace"
                />
              </Link>

              <Link href="#" className=" mb-6 inline-block">
                <Image
                  width={130}
                  height={28}
                  src="/images/logo_white.png"
                  className="hidden max-h-7 dark:block mb-6"
                  alt="Blocklease.io | NFT Rental Marketplace"
                />
              </Link>
              <p className="dark:text-jacarta-300 mb-12">
                Rent NFTs that implements ERC-4907 standards. 
                Powered by Goerli Testnet.
              </p>
              <p>
                Contract : {" " + CONTRACT_MARKETPLACE_ADDR}
              </p>
            </div>

            {footerMenuList.map((single) => (
              <div
                className={`col-span-full sm:col-span-3 md:col-span-2 ${single.diffClass}`}
                key={single.id}
              >
                <h3 className="font-display text-jacarta-700 mb-6 text-sm dark:text-white">
                  {single.title}
                </h3>
                <ul className="dark:text-jacarta-300 flex flex-col space-y-1">
                  {single.list.map((item) => {
                    const { id, href, text } = item;
                    return (
                      <li key={id}>
                        <Link
                          target="_blank"
                          href={href}
                          className="hover:text-accent dark:hover:text-white"
                        >
                          {text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between space-y-2 py-8 sm:flex-row sm:space-y-0">
            <span className="dark:text-jacarta-400 text-sm">
              <span>© {new Date().getFullYear()} Blocklease.io — Made by</span>
              <Link
                target="_blank"
                href="https://github.com/KevinFarani"
                className="hover:text-accent dark:hover:text-white"
              >
                {" "}
                KevinFarani
              </Link>
            </span>

            <ul className="dark:text-jacarta-400 flex flex-wrap space-x-4 text-sm">
              <li>
                <Link
                  target="_blank"
                  href="/tarms"
                  className="hover:text-accent dark:hover:text-white"
                >
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default footer;
