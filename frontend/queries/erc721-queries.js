import { CONTRACT_RENTABLENFTS_ADDR } from "../constants/contracts";
import CONTRACT_ERC721_JSON from "../contracts/ERC721.json";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";

export const getApproval = async (address, args) => {
  try {
    const data = await readContract({
      address: address,
      abi: CONTRACT_ERC721_JSON.abi,
      functionName: "isApprovedForAll",
      args: args,
    });  
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const setApproval = async (address, args) => {
  try {
    const { request } = await prepareWriteContract({
      address: address,
      abi: CONTRACT_ERC721_JSON.abi,
      functionName: "setApprovalForAll",
      args: args,
    });
    const { hash } = await writeContract(request);
    return hash;
  } catch (error) {
    console.log("error", error);
  }
};
