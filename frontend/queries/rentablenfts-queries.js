import { CONTRACT_RENTABLENFTS_ADDR, CONTRACT_RENTABLENFTS_ABI } from "../constants/contracts";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";

export const getMinted = async () => {
    try {
      const data = await readContract({
        address: CONTRACT_RENTABLENFTS_ADDR,
        abi: CONTRACT_RENTABLENFTS_ABI,
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
      abi: CONTRACT_RENTABLENFTS_ABI,
      functionName: "mint",
      args: ["fakeURI"],
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

