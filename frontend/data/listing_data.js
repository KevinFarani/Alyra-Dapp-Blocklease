import { getAllListings } from "../queries/marketplace-queries";
import { getName } from "../queries/erc721-queries";


const getListings = async () => {
  const listingResults = await getAllListings();
  var listingsTable = [];
  var listing;
  listingResults.map(async (item) => {
    listing = {
      name : await getName(item.nft.tokenContract),
      rentings : "10",
      price : item.pricePerDay,
      min_days : item.minRentalDays,
      max_days : item.maxRentalDays
    };
    listingsTable.push(listing);
  });
  return listingsTable;
};

const listingDataNew = Promise.resolve(getListings());

const listingData = [
    {
      id: 1,
      imageSrc: "/images/nft-aggregator/item-1.jpg",
      name: "Monkeyme#155",
      rentings: "2",
      price: "1",
      min_days: "1",
      max_days: "10",
    },
    {
      id: 2,
      imageSrc: "/images/nft-aggregator/item-2.jpg",
      name: "Monkeyme#155",
      rentings: "2",
      price: "1",
      min_days: "5",
      max_days: "10",
    },
];

export { listingData };
export { listingDataNew };
