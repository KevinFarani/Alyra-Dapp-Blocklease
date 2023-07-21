const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { BN, expectRevert } = require("@openzeppelin/test-helpers");

describe("Marketplace", () => {
  let marketplace, rentableNFTs;
  let marketplaceAddress, rentableNFTsAddress;
  let MARKETPLACE_OWNER, NFT_LENDER, NFT_RENTER;
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
    [MARKETPLACE_OWNER, NFT_LENDER, NFT_RENTER] = await ethers.getSigners();
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
      rentableNFT1 = Number((await (await rentableNFTs.connect(NFT_LENDER).mint("fakeURI")).wait()).logs[0].args.tokenId);
      rentableNFT2 = Number((await (await rentableNFTs.connect(NFT_LENDER).mint("fakeURI")).wait()).logs[0].args.tokenId);
      rentableNFT3 = Number((await (await rentableNFTs.connect(NFT_LENDER).mint("fakeURI")).wait()).logs[0].args.tokenId);
      await rentableNFTs.connect(NFT_LENDER).setApprovalForAll(marketplaceAddress, true);
    });

    it("...expect NFT to be listed", async () => {
      // Listing created
      await expect(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS))
        .to.emit(marketplace, "NFTListed");
      // Correct listing info
      let nftListing = await marketplace.getListing(rentableNFTsAddress, rentableNFT1);
      expect(nftListing.lender).to.equal(NFT_LENDER.address);
      expect(nftListing.nft.tokenContract).to.equal(rentableNFTsAddress);
      expect(Number(nftListing.nft.tokenId)).to.equal(rentableNFT1);
      expect(nftListing.pricePerDay.toString()).to.equal(PRICE_PER_DAY_BN.toString());
      expect(Number(nftListing.minRentalDays)).to.equal(MIN_RENTAL_DAYS);
      expect(Number(nftListing.maxRentalDays)).to.equal(MAX_RENTAL_DAYS);
      // Marketplace becomes NFT owner
      let nftOwner = await rentableNFTs.ownerOf(rentableNFT1);
      expect(nftOwner).to.equal(marketplaceAddress);
    });
    it("...expect revert if the NFT is not ERC4907", async () => {
      let contract_notRentableNFTs = await ethers.getContractFactory("NotRentableNFTs");
      let notRentableNFTs = await contract_notRentableNFTs.deploy();
      let notRentableNFTsAddress = await notRentableNFTs.getAddress();
      let notRentableNFT1 = Number((await (await notRentableNFTs.connect(NFT_LENDER).mint("fakeURI")).wait()).logs[0].args.tokenId);
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(notRentableNFTsAddress, notRentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "NFT contract is not ERC4907");
    });
    it("...expect revert if the NFT is already listed", async () => {
      await marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "NFT is already listed");
    });
    it("...expect revert if the caller is not the owner of the NFT", async () => {
      await expectRevert(marketplace.connect(NFT_RENTER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "Not the owner of the NFT");
    });
    it("...expect revert if marketplace is not approved on NFT contract", async () => {
      await rentableNFTs.connect(NFT_LENDER).setApprovalForAll(marketplaceAddress, false);
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "Marketplace must be approved on NFT contract");
    });
    it("...expect revert if NFT User role is already assigned", async () => {
      await rentableNFTs.connect(NFT_LENDER).setUser(rentableNFT1, NFT_RENTER, TOMORROW);
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "NFT is already being rented, user role must be available to list");
    });
    it("...expect revert if rental price is not greater than 0", async () => {
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, 0, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS), "Rental price should be greater than 0");
    });
    it("...expect revert if rental boundaries are invalid", async () => {
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, 0, MAX_RENTAL_DAYS), "Invalid rental boundaries");
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, 0), "Invalid rental boundaries");
      await expectRevert(marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MAX_RENTAL_DAYS, MIN_RENTAL_DAYS), "Invalid rental boundaries");
    });

    // ------------------------------------------------------------- Booking
  
    describe("Booking", () => {
      beforeEach(async () => {
        await marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT1, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
        await marketplace.connect(NFT_LENDER).listNFT(rentableNFTsAddress, rentableNFT2, PRICE_PER_DAY_BN, MIN_RENTAL_DAYS, MAX_RENTAL_DAYS);
      });
  
      it("...expect NFT to be booked", async () => {
        // Event emitted
        await expect(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}))
          .to.emit(marketplace, "NFTBooked");
        // Correct booking info
        let nftBookings = await marketplace.getBookings(rentableNFTsAddress, rentableNFT1);
        expect(nftBookings[0].renter).to.equal(NFT_RENTER.address);
        expect(nftBookings[0].startRentalDate).to.equal(TOMORROW);
        expect(nftBookings[0].endRentalDate).to.equal(IN_FIVE_DAYS);
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
        await expect(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}))
          .to.emit(marketplace, "FundsSent")
          .withArgs(NFT_RENTER.address, amountToRefund_BN);
      });
      it("...expect booking to initiate earnings for lender and marketplace owner", async () => {
        let rentalDays = (IN_FIVE_DAYS - TOMORROW) / 60 / 60 / 24 + 1;
        let rentalPrice = rentalDays * PRICE_PER_DAY;
        let martketplaceFeesPercentage = Number(await marketplace.getRentingFees());
        let rentalFees = rentalPrice * martketplaceFeesPercentage / 100;
        let rentalEarning = rentalPrice - rentalFees;
        let rentalFees_BN = ethers.parseEther(rentalFees.toString());
        let rentalEarning_BN = ethers.parseEther(rentalEarning.toString());
        await marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        let lenderEarnings = await marketplace.connect(NFT_LENDER).getMyEarnings();
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
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT3, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}), "NFT is not listed");
      });
      it("...expect revert if the rental details are invalid", async () => {
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, YESTERDAY, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}), "If filled, rental start date cannot be in the past");
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, IN_FIVE_DAYS, YESTERDAY, {value: BIG_ETH_AMOUNT_BN}), "Rental end date cannot be in the past");
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, IN_FIVE_DAYS, TOMORROW, {value: BIG_ETH_AMOUNT_BN}), "Rental start date must be lower than end date");
      });
      it("...expect revert if the rental duration is out of rental boundaries", async () => {
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, 0, TOMORROW, {value: BIG_ETH_AMOUNT_BN}), "Rental period must be greater than minimum rental period and lower than maximum rental period");
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_TWENTY_DAYS, {value: BIG_ETH_AMOUNT_BN}), "Rental period must be greater than minimum rental period and lower than maximum rental period");
      });
      it("...expect revert if NFT is not available on the desired period", async () => {
        await marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, 0, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN}), "NFT is not available on that period");
      });
      it("...expect revert if not enough ETH to cover rental price", async () => {
        let rentalDays = (IN_FIVE_DAYS - TOMORROW) / 60 / 60 / 24 + 1;
        let rentalPrice = rentalDays * PRICE_PER_DAY;
        let rentalPrice_NotCovered = rentalPrice / 2;
        await expectRevert(marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, TOMORROW, IN_FIVE_DAYS, {value: ethers.parseEther(rentalPrice_NotCovered.toString())}), "Not enough ETH to cover rental fees");
      });

      // ------------------------------------------------------------- Renting

      describe("Renting", () => {
        beforeEach(async () => {
          await marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT1, 0, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
          await marketplace.connect(NFT_RENTER).bookNFT(rentableNFTsAddress, rentableNFT2, TOMORROW, IN_FIVE_DAYS, {value: BIG_ETH_AMOUNT_BN});
        });
    
        it("...expect to start NFT rental", async () => {
          // Renting started
          await expect(marketplace.connect(NFT_RENTER).startRentingNFT(rentableNFTsAddress, rentableNFT1))
            .to.emit(marketplace, "NFTRentingStarted");
          // Renter has been granted User role on NFT
          let nftUser = await rentableNFTs.userOf(rentableNFT1);
          expect(nftUser).to.equal(NFT_RENTER.address);
        });
        it("...expect revert if the NFT is not listed on the marketplace", async () => {
          await expectRevert(marketplace.connect(NFT_RENTER).startRentingNFT(rentableNFTsAddress, rentableNFT3), "NFT is not listed");
        });
        it("...expect revert if User role was already granted", async () => {
          await marketplace.connect(NFT_RENTER).startRentingNFT(rentableNFTsAddress, rentableNFT1);
          await expectRevert(marketplace.connect(NFT_RENTER).startRentingNFT(rentableNFTsAddress, rentableNFT1), "Renting already started");
        });
        it("...expect revert if user is not in his booking period", async () => {
          await expectRevert(marketplace.connect(NFT_RENTER).startRentingNFT(rentableNFTsAddress, rentableNFT2), "Not your booking period");
        });

        // ------------------------------------------------------------- Earnings

        describe("Earnings", () => {
          beforeEach(async () => {
            await marketplace.connect(NFT_RENTER).startRentingNFT(rentableNFTsAddress, rentableNFT1);
          });
      
          it("...expect redeemed earnings are correctly sent", async () => {
            // Marketplace owner get booking fees
            let marketplaceOwnerEarnings = await marketplace.connect(MARKETPLACE_OWNER).getMyEarnings();
            await expect(marketplace.connect(MARKETPLACE_OWNER).redeemEarnings())
              .to.emit(marketplace, "FundsSent")
              .withArgs(MARKETPLACE_OWNER.address, marketplaceOwnerEarnings[0].amount);
            // NFT lender get booking earning
            let lenderEarnings = await marketplace.connect(NFT_LENDER).getMyEarnings();
            await expect(marketplace.connect(NFT_LENDER).redeemEarnings())
              .to.emit(marketplace, "FundsSent")
              .withArgs(NFT_LENDER.address, lenderEarnings[0].amount);
          });
          it("...expect earning status is updated after redeem", async () => {
            let lenderEarnings_beforeRedeem = await marketplace.connect(NFT_LENDER).getMyEarnings();
            expect(lenderEarnings_beforeRedeem[0].redeemed).to.equal(false);
            await marketplace.connect(NFT_LENDER).redeemEarnings();
            let lenderEarnings_afterRedeem = await marketplace.connect(NFT_LENDER).getMyEarnings();
            expect(lenderEarnings_afterRedeem[0].redeemed).to.equal(true);
          });
          it("...expect revert if caller have no earning to redeem or already redeemed", async () => {
            await expectRevert(marketplace.connect(NFT_RENTER).redeemEarnings(), "Nothing to redeem");
            await marketplace.connect(NFT_LENDER).redeemEarnings();
            await expectRevert(marketplace.connect(NFT_LENDER).redeemEarnings(), "Nothing to redeem");
          });

          // ------------------------------------------------------------- Unlisting

          describe("Unlisting", () => {

            it("...expect NFT to be unlisted", async () => {
              await expect(marketplace.connect(NFT_LENDER).unlistNFT(rentableNFTsAddress, rentableNFT2))
                .to.emit(marketplace, "NFTUnlisted");
              // Listing info are removed
              let nftListing = await marketplace.getListing(rentableNFTsAddress, rentableNFT2);
              expect(nftListing.lender).to.equal(ADDRESS_ZERO);
              expect(nftListing.nft.tokenContract).to.equal(ADDRESS_ZERO);
              expect(Number(nftListing.nft.tokenId)).to.equal(0);
              expect(nftListing.pricePerDay).to.equal(0);
              expect(Number(nftListing.minRentalDays)).to.equal(0);
              expect(Number(nftListing.maxRentalDays)).to.equal(0);
              // Lender becomes NFT owner back
              let nftOwner = await rentableNFTs.ownerOf(rentableNFT2);
              expect(nftOwner).to.equal(NFT_LENDER.address);
            });
            it("...expect revert if the NFT is not listed on the marketplace", async () => {
              await expectRevert(marketplace.connect(NFT_LENDER).unlistNFT(rentableNFTsAddress, rentableNFT3), "NFT is not listed");
            });
            it("...expect revert if the user is not the lender of the NFT or the marketplace owner", async () => {
              await expectRevert(marketplace.connect(NFT_RENTER).unlistNFT(rentableNFTsAddress, rentableNFT2), "Not authorized to unlist this NFT");
            });
            it("...expect revert if the NFT is currently being rented", async () => {
              await expectRevert(marketplace.connect(NFT_LENDER).unlistNFT(rentableNFTsAddress, rentableNFT1), "NFT is being rented, wait the end to unlist");
            });

            // ------------------------------------------------------------- Refund

            describe("Refund", () => {
              beforeEach(async () => {
                await marketplace.connect(NFT_LENDER).unlistNFT(rentableNFTsAddress, rentableNFT2);
              });
            });
          });
        });
      });
    });
  });
})
