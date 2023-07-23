import Image from "next/image";
import Link from "next/link";
import { listingData } from "../../../data/listing_data";

const DataTable = () => {
  // Array of objects representing the table data

  return <>
    {listingData.length == 0 
    ? <p className="dark:text-jacarta-200 mb-8 mt-8 text-center text-lg">No NFT listed</p> 
    : listingData.map((item) => (
      (<Link
      href="/collection/explore_collection"
      key={item.id}
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
              src={item.imageSrc}
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
            {item.name}
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
  </>;
};

export default DataTable;
