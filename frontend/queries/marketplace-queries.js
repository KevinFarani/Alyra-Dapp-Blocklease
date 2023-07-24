import { CONTRACT_MARKETPLACE_ADDR } from "../constants/contracts";
import CONTRACT_MARKETPLACE_JSON from "../contracts/Marketplace.json";
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { ethers } from "ethers";


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

export const book = async (args, value) => {
  try {
    const { request } = await prepareWriteContract({
      address: CONTRACT_MARKETPLACE_ADDR,
      abi: CONTRACT_MARKETPLACE_JSON.abi,
      functionName: "bookNFT",
      args: args,
      value: ethers.parseEther(value),
      //value: ethers.parseEther(value),
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const getAllListings = async () => {
    try {
      const data = await readContract({
        address: CONTRACT_MARKETPLACE_ADDR,
        abi: CONTRACT_MARKETPLACE_JSON.abi,
        functionName: "getAllListings"
      });  
      return data;
    } catch (error) {
      console.log("error", error);
    }
};

export const getListing = async (args) => {
  try {
    const data = await readContract({
      address: CONTRACT_MARKETPLACE_ADDR,
      abi: CONTRACT_MARKETPLACE_JSON.abi,
      functionName: "getListing",
      args: args,
    });  
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getBookings = async (args) => {
  try {
    const data = await readContract({
      address: CONTRACT_MARKETPLACE_ADDR,
      abi: CONTRACT_MARKETPLACE_JSON.abi,
      functionName: "getBookings",
      args: args,
    });  
    return data;
  } catch (error) {
    console.log("error", error);
  }
};