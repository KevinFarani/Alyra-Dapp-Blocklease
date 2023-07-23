import { CONTRACT_MARKETPLACE_ADDR } from "../constants/contracts";
import CONTRACT_MARKETPLACE_JSON from "../contracts/Marketplace.json";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";

export const lend = async (args) => {
    try {
      const { request } = await prepareWriteContract({
        address: CONTRACT_MARKETPLACE_ADDR,
        abi: CONTRACT_MARKETPLACE_JSON.abi,
        functionName: "listNFT",
        args: args,
      });
      const { hash } = await writeContract(request);
  
      return hash;
    } catch (error) {
      console.log("error", error);
    }
  };