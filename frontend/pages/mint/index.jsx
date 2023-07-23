import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Meta from "../../components/Meta";

const Mint = () => {
  const [likesImage, setLikesImage] = useState(false);
  const router = useRouter();
  const pid = router.query.collection;

  const handleLikes = () => {
    if (!likesImage) {
      setLikesImage(true);
    } else {
      setLikesImage(false);
    }
  };

  return (
    <>
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
                                        <div
                      className="dark:border-jacarta-600 bg-green absolute -right-3 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                      data-tippy-content="Verified Collection"
                    >
                    </div>
                </div>

                <div className="container">
                  <div className="text-center">
                    <h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white">
                      RentableNFTs
                    </h2>
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
                          {0}
                        </div>
                        <div className="text-2xs dark:text-jacarta-400 font-medium tracking-tight">
                          Minted
                        </div>
                      </Link>
                      <Link
                        href="#"
                        className="dark:border-jacarta-600 border-jacarta-100 w-1/2 rounded-l-xl border-r py-4 hover:shadow-md sm:w-32"
                      >
                        <div className="text-jacarta-700 mb-1 text-base font-bold dark:text-white">
                          {0}
                        </div>
                        <div className="text-2xs dark:text-jacarta-400 font-medium tracking-tight">
                          Listed
                        </div>
                      </Link>
                      <Link
                        href="#"
                        className="dark:border-jacarta-600 border-jacarta-100 w-1/2 rounded-l-xl border-r py-4 hover:shadow-md sm:w-32"
                      >
                        <div className="text-jacarta-700 mb-1 text-base font-bold dark:text-white">
                          {0}
                        </div>
                        <div className="text-2xs dark:text-jacarta-400 font-medium tracking-tight">
                          Rented
                        </div>
                      </Link>
                    </div>

                    <p className="dark:text-jacarta-300 mx-auto max-w-xl text-lg">
                      Collection of ERC-4907 NFTs, made for tests of Blocklease.io
                    </p>

                    <button
                      className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-50 mt-10 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                      onClick={() => dispatch(bidsModalShow())}
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
