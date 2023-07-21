const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("Marketplace", () => {
  let marketplace, rentableNFTs;
  let marketplaceAddress, rentableNFTsAddress;
  let MARKETPLACE_OWNER, NFT_LENDER_1, NFT_LENDER_2, NFT_RENTER_1, NFT_RENTER_2;
  let rentableNFT1, rentableNFT2;

  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

  const TODAY = Math.floor(Date.now()/1000);
  const YESTERDAY = TODAY - (24*60*60);
  const TOMORROW = TODAY + (24*60*60);
  const IN_TWO_DAYS = TODAY + (24*60*60*2);
  const IN_FIVE_DAYS = TODAY + (24*60*60*5);
  const IN_TWENTY_DAYS = TODAY + (24*60*60*20);

  const PRICE_PER_DAY = 1;
  const PRICE_PER_DAY_BN = ethers.parseEther(PRICE_PER_DAY.toString());
  const BIG_ETH_AMOUNT = 10;
  const BIG_ETH_AMOUNT_BN = ethers.parseEther(BIG_ETH_AMOUNT.toString());
  const MIN_RENTAL_DAYS = 3;
  const MAX_RENTAL_DAYS = 10;

  beforeEach(async () => {
    [MARKETPLACE_OWNER, NFT_LENDER_1, NFT_LENDER_2, NFT_RENTER_1, NFT_RENTER_2] = await ethers.getSigners();
    let contract_marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await contract_marketplace.deploy();
    marketplaceAddress = await marketplace.getAddress();
    let contract_rentableNFTs = await ethers.getContractFactory("RentableNFTs");
    rentableNFTs = await contract_rentableNFTs.deploy();
    rentableNFTsAddress = await rentableNFTs.getAddress();
  });

  // ------------------------------------------------------------- Deployment

  describe("Deployment", () => {
    it("...expect contract to be successfully deployed", async () => {
      let rentingFees = await marketplace.getRentingFees();
      let expectedRentingFees = 5;
      assert.equal(rentingFees, expectedRentingFees);
    });
    it("...expect the good owner", async () => {
      let _owner = await marketplace.owner();
      expect(_owner).to.equal(MARKETPLACE_OWNER.address);
    });
  });

  // ------------------------------------------------------------- Listing

  describe("Listing", () => {
    beforeEach(async () => {
      rentableNFT1 = Number((await (await rentableNFTs.connect(NFT_LENDER_1).mint("fakeURI")).wait()).logs[0].args.tokenId);
      rentableNFT2 = Number((await (await rentableNFTs.connect(NFT_LENDER_1).mint("fakeURI")).wait()).logs[0].args.tokenId);
      rentableNFT3 = Number((await (await rentableNFTs.connect(NFT_LENDER_2).mint("fakeURI")).wait()).logs[0].args.tokenId);
      await rentableNFTs.connect(NFT_LENDER_1).setApprovalForAll(marketplaceAddress, true);
      await rentableNFTs.connect(NFT_LENDER_2).setApprovalForAll(marketplaceAddress, true);
    });

    it("...expect correct event to be emitted", async () => {
      await expect(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS))
        .to.emit(marketplace, "NFTListed");
    });
    it("...expect to list NFT collection", async () => {
      let listedCollections_beforeListing = await marketplace.getListedCollections();
      expect(listedCollections_beforeListing.length).to.equal(0);
      await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      let listedCollections_afterListing = await marketplace.getListedCollections();
      expect(listedCollections_afterListing[0]).to.equal(rentableNFTsAddress);
    });
    it("...expect to list NFT ID", async () => {
      let listedNFTIDs_beforeListing = await marketplace.getListedNftsByCollection(rentableNFTsAddress);
      expect(listedNFTIDs_beforeListing.length).to.equal(0);
      await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      let listedNFTIDs_afterListing = await marketplace.getListedNftsByCollection(rentableNFTsAddress);
      expect(listedNFTIDs_afterListing[0]).to.equal(rentableNFT1);
    });
    it("...expect to initiate listing info", async () => {
      let listedCollections_beforeListing = await marketplace.getListedCollections();
      expect(listedCollections_beforeListing.length).to.equal(0);
      await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      let listedCollections_afterListing = await marketplace.getListedCollections();
      expect(listedCollections_afterListing[0]).to.equal(rentableNFTsAddress);
      let nftListing = await marketplace.getListing(rentableNFTsAddress, rentableNFT1);
      expect(nftListing.lender).to.equal(NFT_LENDER_1.address);
      expect(nftListing.nft.tokenContract).to.equal(rentableNFTsAddress);
      expect(Number(nftListing.nft.tokenId)).to.equal(rentableNFT1);
      expect(nftListing.pricePerDay.toString()).to.equal(PRICE_PER_DAY_BN.toString());
      expect(Number(nftListing.minRentalDays)).to.equal(MIN_RENTAL_DAYS);
      expect(Number(nftListing.maxRentalDays)).to.equal(MAX_RENTAL_DAYS);
    });
    it("...expect marketplace to become the NFT owner", async () => {
      await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      let nftOwner = await rentableNFTs.ownerOf(rentableNFT1);
      expect(nftOwner).to.equal(marketplaceAddress);
    });
    it("...expect to get all marketplace listings", async () => {
      await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      await marketplace.connect(NFT_LENDER_2).listNFT(rentableNFTsAddress, rentableNFT3, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      let allListings = await marketplace.getAllListings();
      expect(allListings.length).to.equal(2);
      expect(allListings[0].lender).to.equal(NFT_LENDER_1.address);
      expect(allListings[1].lender).to.equal(NFT_LENDER_2.address);
    });
    it("...expect to get user listings", async () => {
      await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      await marketplace.connect(NFT_LENDER_2).listNFT(rentableNFTsAddress, rentableNFT3, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      let userListings = await marketplace.connect(NFT_LENDER_1).getMyListings();
      expect(userListings.length).to.equal(1);
      expect(userListings[0].lender).to.equal(NFT_LENDER_1.address);
    });
    it("...expect revert if the NFT is not ERC4907", async () => {
      let contract_notRentableNFTs = await ethers.getContractFactory("NotRentableNFTs");
      let notRentableNFTs = await contract_notRentableNFTs.deploy();
      let notRentableNFTsAddress = await notRentableNFTs.getAddress();
      let notRentableNFT1 = Number((await (await notRentableNFTs.connect(NFT_LENDER_1).mint("fakeURI")).wait()).logs[0].args.tokenId);
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(notRentableNFTsAddress, notRentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "NFT contract is not ERC4907");
    });
    it("...expect revert if the NFT is already listed", async () => {
      await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "NFT is already listed");
    });
    it("...expect revert if the caller is not the owner of the NFT", async () => {
      await expectRevert(marketplace.connect(NFT_RENTER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "Not the owner of the NFT");
    });
    it("...expect revert if marketplace is not approved on NFT contract", async () => {
      await rentableNFTs.connect(NFT_LENDER_1).setApprovalForAll(marketplaceAddress, false);
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "Marketplace must be approved on NFT contract");
    });
    it("...expect revert if NFT User role is already assigned", async () => {
      await rentableNFTs.connect(NFT_LENDER_1).setUser(rentableNFT1, NFT_RENTER_1, TOMORROW);
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "NFT is already being rented, user role must be available to list");
    });
    it("...expect revert if rental price is not greater than 0", async () => {
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, 0, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "Rental price should be greater than 0");
    });
    it("...expect revert if rental boundaries are invalid", async () => {
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, 0, MAX_RENTAL_DAYS), "Invalid rental boundaries");
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, 0), "Invalid rental boundaries");
      await expectRevert(marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MAX_RENTAL_DAYS, MIN_RENTAL_DAYS), "Invalid rental boundaries");
    });

    // ------------------------------------------------------------- Booking

    describe("Booking", () => {
      beforeEach(async () => {
        await marketplace.connect(NFT_LENDER_1).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
        await marketplace.connect(NFT_LENDER_2).listNFT(rentableNFTsAddress, rentableNFT3, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      });
  
      it("...expect correct event to be emitted", async () => {
        await expect(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}))
          .to.emit(marketplace, "NFTBooked");
      });
      it("...expect initiate booking info", async () => {
        await marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        let nftBookings = await marketplace.getBookings(rentableNFTsAddress, rentableNFT1);
        expect(nftBookings[0].renter).to.equal(NFT_RENTER_1.address);
        expect(nftBookings[0].startRentalDate).to.equal(TOMORROW);
        expect(nftBookings[0].endRentalDate).to.equal(IN_FIVE_DAYS);
        expect(nftBookings[0].earningIndex).to.equal(0);
        expect(nftBookings[0].feesIndex).to.equal(0);
      });
      it("...expect to refund renter if too much ETH sent for booking", async () => {
        let rentalDays = (IN_FIVE_DAYS - TOMORROW) / 60 / 60 / 24 + 1;
        let rentalPrice = rentalDays * PRICE_PER_DAY;
        let amountToRefund = BIG_ETH_AMOUNT - rentalPrice;
        let amountToRefund_BN = ethers.parseEther(amountToRefund.toString());
        // Booking created and user refunded if too much ETH sent
        await expect(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}))
          .to.emit(marketplace, "FundsSent")
          .withArgs(NFT_RENTER_1.address, amountToRefund_BN);
      });
      it("...expect to get user bookings", async () => {
        await marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        await marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT3, IN_TWO_DAYS, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        let userBookings = await marketplace.connect(NFT_RENTER_1).getMyBookings();
        expect(userBookings.length).to.equal(2);
        expect(userBookings[0].renter).to.equal(NFT_RENTER_1.address);
        expect(userBookings[0].startRentalDate).to.equal(TOMORROW);
        expect(userBookings[1].renter).to.equal(NFT_RENTER_1.address);
        expect(userBookings[1].startRentalDate).to.equal(IN_TWO_DAYS);
      });
      it("...expect booking to initiate earnings info for lender and marketplace owner", async () => {
        let rentalDays = (IN_FIVE_DAYS - TOMORROW) / 60 / 60 / 24 + 1;
        let rentalPrice = rentalDays * PRICE_PER_DAY;
        let martketplaceFeesPercentage = Number(await marketplace.getRentingFees());
        let rentalFees = rentalPrice * martketplaceFeesPercentage / 100;
        let rentalEarning = rentalPrice - rentalFees;
        let rentalFees_BN = ethers.parseEther(rentalFees.toString());
        let rentalEarning_BN = ethers.parseEther(rentalEarning.toString());
        await marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        let lenderEarnings = await marketplace.connect(NFT_LENDER_1).getMyEarnings();
        expect(lenderEarnings[0].amount.toString()).to.equal(rentalEarning_BN.toString());
        expect(lenderEarnings[0].redeemableDate).to.equal(TOMORROW);
        expect(lenderEarnings[0].cancelled).to.equal(false);
        expect(lenderEarnings[0].redeemed).to.equal(false);
        let marketplaceOwnerEarnings = await marketplace.connect(MARKETPLACE_OWNER).getMyEarnings();
        expect(marketplaceOwnerEarnings[0].amount.toString()).to.equal(rentalFees_BN.toString());
        expect(marketplaceOwnerEarnings[0].redeemableDate).to.equal(TOMORROW);
        expect(marketplaceOwnerEarnings[0].cancelled).to.equal(false);
        expect(marketplaceOwnerEarnings[0].redeemed).to.equal(false);
      });
      it("...expect revert if the NFT is not listed on the marketplace", async () => {
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT2, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}), "NFT is not listed");
      });
      it("...expect revert if the rental details are invalid", async () => {
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, YESTERDAY, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}), "If filled, rental start date cannot be in the past");
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, IN_FIVE_DAYS, YESTERDAY, {value: BIG_ETH_AMOUNT_BN}), "Rental end date cannot be in the past");
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, IN_FIVE_DAYS, TOMORROW, {value: BIG_ETH_AMOUNT_BN}), "Rental start date must be lower than end date");
      });
      it("...expect revert if the rental duration is out of rental boundaries", async () => {
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, 0, TOMORROW, {value: BIG_ETH_AMOUNT_BN}), "Rental period must be greater than minimum rental period and lower than maximum rental period");
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_TWENTY_DAYS, {value: BIG_ETH_AMOUNT_BN}), "Rental period must be greater than minimum rental period and lower than maximum rental period");
      });
      it("...expect revert if NFT is not available on the desired period", async () => {
        await marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, 0, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}), "NFT is not available on that period");
      });
      it("...expect revert if not enough ETH to cover rental price", async () => {
        let rentalDays = (IN_FIVE_DAYS - TOMORROW) / 60 / 60 / 24 + 1;
        let rentalPrice = rentalDays * PRICE_PER_DAY;
        let rentalPrice_NotCovered = rentalPrice / 2;
        await expectRevert(marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: ethers.parseEther(rentalPrice_NotCovered.toString())}), "Not enough ETH to cover rental fees");
      });

      // ------------------------------------------------------------- Renting

      describe("Renting", () => {
        beforeEach(async () => {
          await marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT1, 0, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
          await marketplace.connect(NFT_RENTER_1).bookNFT(rentableNFTsAddress, rentableNFT3, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        });

        it("...expect correct event to be emitted", async () => {
          await expect(marketplace.connect(NFT_RENTER_1).startRentingNFT(rentableNFTsAddress, rentableNFT1))
            .to.emit(marketplace, "NFTRentingStarted");
        });
        it("...expect to start NFT rental by granting User role", async () => {
          await marketplace.connect(NFT_RENTER_1).startRentingNFT(rentableNFTsAddress, rentableNFT1);
          let nftUser = await rentableNFTs.userOf(rentableNFT1);
          expect(nftUser).to.equal(NFT_RENTER_1.address);
        });
        it("...expect revert if the NFT is not listed on the marketplace", async () => {
          await expectRevert(marketplace.connect(NFT_RENTER_1).startRentingNFT(rentableNFTsAddress, rentableNFT2), "NFT is not listed");
        });
        it("...expect revert if User role was already granted", async () => {
          await marketplace.connect(NFT_RENTER_1).startRentingNFT(rentableNFTsAddress, rentableNFT1);
          await expectRevert(marketplace.connect(NFT_RENTER_1).startRentingNFT(rentableNFTsAddress, rentableNFT1), "Renting already started");
        });
        it("...expect revert if user is not in his booking period", async () => {
          await expectRevert(marketplace.connect(NFT_RENTER_1).startRentingNFT(rentableNFTsAddress, rentableNFT3), "Not your booking period");
        });

        // ------------------------------------------------------------- Earnings

        describe("Earnings", () => {
          beforeEach(async () => {
            await marketplace.connect(NFT_RENTER_1).startRentingNFT(rentableNFTsAddress, rentableNFT1);
          });
      
          it("...expect redeemed earnings are correctly sent", async () => {
            // Marketplace owner get booking fees
            let marketplaceOwnerEarnings = await marketplace.connect(MARKETPLACE_OWNER).getMyEarnings();
            await expect(marketplace.connect(MARKETPLACE_OWNER).redeemEarnings())
              .to.emit(marketplace, "FundsSent")
              .withArgs(MARKETPLACE_OWNER.address, marketplaceOwnerEarnings[0].amount);
            // NFT lender get booking earning
            let lenderEarnings = await marketplace.connect(NFT_LENDER_1).getMyEarnings();
            await expect(marketplace.connect(NFT_LENDER_1).redeemEarnings())
              .to.emit(marketplace, "FundsSent")
              .withArgs(NFT_LENDER_1.address, lenderEarnings[0].amount);
          });
          it("...expect earning status is updated after redeem", async () => {
            let lenderEarnings_beforeRedeem = await marketplace.connect(NFT_LENDER_1).getMyEarnings();
            expect(lenderEarnings_beforeRedeem[0].redeemed).to.equal(false);
            await marketplace.connect(NFT_LENDER_1).redeemEarnings();
            let lenderEarnings_afterRedeem = await marketplace.connect(NFT_LENDER_1).getMyEarnings();
            expect(lenderEarnings_afterRedeem[0].redeemed).to.equal(true);
          });
          it("...expect revert if caller have no earning to redeem or already redeemed", async () => {
            await expectRevert(marketplace.connect(NFT_RENTER_1).redeemEarnings(), "Nothing to redeem");
            await marketplace.connect(NFT_LENDER_1).redeemEarnings();
            await expectRevert(marketplace.connect(NFT_LENDER_1).redeemEarnings(), "Nothing to redeem");
          });

          // ------------------------------------------------------------- Unlisting

          describe("Unlisting", () => {

            it("...expect correct event to be emitted", async () => {
              await expect(marketplace.connect(NFT_LENDER_2).unlistNFT(rentableNFTsAddress, rentableNFT3))
                .to.emit(marketplace, "NFTUnlisted");
            });
            it("...expect to unlist NFT collection", async () => {
              // To implement this test correctly, a second collection of rentable NFTs would be needed
            });
            it("...expect to unlist NFT ID", async () => {
              let listedNFTIDs_beforeUnlisting = await marketplace.getListedNftsByCollection(rentableNFTsAddress);
              expect(listedNFTIDs_beforeUnlisting.length).to.equal(2);
              await marketplace.connect(NFT_LENDER_2).unlistNFT(rentableNFTsAddress, rentableNFT3);
              let listedNFTIDs_afterUnlisting = await marketplace.getListedNftsByCollection(rentableNFTsAddress);
              expect(listedNFTIDs_afterUnlisting.length).to.equal(1);
            });
            it("...expect to remove listing info", async () => {
              await marketplace.connect(NFT_LENDER_2).unlistNFT(rentableNFTsAddress, rentableNFT3);
              let nftListing = await marketplace.getListing(rentableNFTsAddress, rentableNFT3);
              expect(nftListing.lender).to.equal(ADDRESS_ZERO);
              expect(nftListing.nft.tokenContract).to.equal(ADDRESS_ZERO);
              expect(Number(nftListing.nft.tokenId)).to.equal(0);
              expect(nftListing.pricePerDay).to.equal(0);
              expect(Number(nftListing.minRentalDays)).to.equal(0);
              expect(Number(nftListing.maxRentalDays)).to.equal(0);
            });
            it("...expect lender to become NFT owner back", async () => {
              await marketplace.connect(NFT_LENDER_2).unlistNFT(rentableNFTsAddress, rentableNFT3);
              let nftOwner = await rentableNFTs.ownerOf(rentableNFT3);
              expect(nftOwner).to.equal(NFT_LENDER_2.address);
            });
            it("...expect unlisting to cancel lender and market owner earnings", async () => {
              let lenderEarnings_beforeUnlist = await marketplace.connect(NFT_LENDER_2).getMyEarnings();
              expect(lenderEarnings_beforeUnlist[0].cancelled).to.equal(false);
              let marketplaceOwnerEarnings_beforeUnlist = await marketplace.connect(MARKETPLACE_OWNER).getMyEarnings();
              expect(marketplaceOwnerEarnings_beforeUnlist[1].cancelled).to.equal(false);
              await marketplace.connect(NFT_LENDER_2).unlistNFT(rentableNFTsAddress, rentableNFT3);
              let lenderEarnings_afterUnlist = await marketplace.connect(NFT_LENDER_2).getMyEarnings();
              expect(lenderEarnings_afterUnlist[0].cancelled).to.equal(true);
              let marketplaceOwnerEarnings_afterUnlist = await marketplace.connect(MARKETPLACE_OWNER).getMyEarnings();
              expect(marketplaceOwnerEarnings_afterUnlist[1].cancelled).to.equal(true);
            });
            it("...expect unlisting to initiate refund info for renter", async () => {
              let lenderEarnings = await marketplace.connect(NFT_LENDER_2).getMyEarnings();
              let marketplaceOwnerEarnings = await marketplace.connect(MARKETPLACE_OWNER).getMyEarnings();
              let expectedRefund = Number(lenderEarnings[0].amount) + Number(marketplaceOwnerEarnings[1].amount);
              let renterRefunds_beforeUnlist = await marketplace.connect(NFT_RENTER_1).getMyRefund();
              expect(renterRefunds_beforeUnlist).to.equal(0);
              await marketplace.connect(NFT_LENDER_2).unlistNFT(rentableNFTsAddress, rentableNFT3);
              let renterRefunds_afterUnlist = await marketplace.connect(NFT_RENTER_1).getMyRefund();
              expect(renterRefunds_afterUnlist.toString()).to.equal(expectedRefund.toString());
            });
            it("...expect revert if the NFT is not listed on the marketplace", async () => {
              await expectRevert(marketplace.connect(NFT_LENDER_1).unlistNFT(rentableNFTsAddress, rentableNFT2), "NFT is not listed");
            });
            it("...expect revert if the user is not the lender of the NFT or the marketplace owner", async () => {
              await expectRevert(marketplace.connect(NFT_RENTER_1).unlistNFT(rentableNFTsAddress, rentableNFT3), "Not authorized to unlist this NFT");
            });
            it("...expect revert if the NFT is currently being rented", async () => {
              await expectRevert(marketplace.connect(NFT_LENDER_1).unlistNFT(rentableNFTsAddress, rentableNFT1), "NFT is being rented, wait the end to unlist");
            });

            // ------------------------------------------------------------- Refund

            describe("Refund", () => {
              beforeEach(async () => {
                await marketplace.connect(NFT_LENDER_2).unlistNFT(rentableNFTsAddress, rentableNFT3);
              });

              it("...expect redeemed refunds are correctly sent", async () => {
                let marketplaceRenterRefunds = await marketplace.connect(NFT_RENTER_1).getMyRefund();
                await expect(marketplace.connect(NFT_RENTER_1).redeemRefund())
                  .to.emit(marketplace, "FundsSent")
                  .withArgs(NFT_RENTER_1.address, marketplaceRenterRefunds);
              });
              it("...expect revert if caller have no refund to redeem or already redeemed", async () => {
                await expectRevert(marketplace.connect(NFT_LENDER_1).redeemRefund(), "Nothing to redeem");
                await marketplace.connect(NFT_RENTER_1).redeemRefund();
                await expectRevert(marketplace.connect(NFT_RENTER_1).redeemRefund(), "Nothing to redeem");
              });
            });
          });
        });
      });
    });
  });
})
