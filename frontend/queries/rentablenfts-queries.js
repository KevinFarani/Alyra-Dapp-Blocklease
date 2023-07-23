import { CONTRACT_RENTABLENFTS_ADDR } from "../constants/contracts";
import CONTRACT_RENTABLENFTS_JSON from "../contracts/RentableNFTs.json";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";

export const getMinted = async () => {
    try {
      const data = await readContract({
        address: CONTRACT_RENTABLENFTS_ADDR,
        abi: CONTRACT_RENTABLENFTS_JSON.abi,
        functionName: "getMinted"
      });  
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

export const mint = async () => {
  try {
    const { request } = await prepareWriteContract({
      address: CONTRACT_RENTABLENFTS_ADDR,
      abi: CONTRACT_RENTABLENFTS_JSON.abi,
      functionName: "mint",
      args: ["fakeURI"],
    });
    const { hash } = await writeContract(request);
    return hash;
  } catch (error) {
    console.log("error", error);
  }
};
