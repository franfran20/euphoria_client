import { morphHolesky } from "viem/chains";
import { CONTRACT_ADDRESS } from "./constants";
import { Address } from "viem";

const domain = {
  name: "EuphoriaBookFactory",
  version: "1",
  chainId: morphHolesky.id,
  verifyingContract: CONTRACT_ADDRESS as Address,
};

export const CREATE_BOOK_TYPED_DATA = (message: any) => {
  return {
    domain,
    types: {
      EuphoriaBook: [
        { name: "chapterLock", type: "uint16" },
        { name: "name", type: "string" },
        { name: "coverImage", type: "string" },
        { name: "genre", type: "uint256[]" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "EuphoriaBook" as const,
    message,
  };
};

export const CREATE_SUBSCRIBE_TYPED_DATA = (message: any) => {
  return {
    domain,
    types: {
      Subscribe: [
        { name: "subscriptionCost", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Subscribe" as const,
    message,
  };
};

export const CREATE_REGISTER_TYPED_DATA = (message: any) => {
  return {
    domain,
    types: {
      Register: [
        { name: "username", type: "string" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Register" as const,
    message,
  };
};

export const CREATE_VOTE_BOOK_TYPED_DATA = (message: any) => {
  return {
    domain,
    types: {
      VoteBook: [
        { name: "bookId", type: "uint256" },
        { name: "votes", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "VoteBook" as const,
    message,
  };
};

export const CREATE_ALLOCATE_TO_BOOK_TYPED_DATA = (message: any) => {
  return {
    domain,
    types: {
      UseSpendBack: [
        { name: "bookId", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "UseSpendBack" as const,
    message,
  };
};

export const CREATE_RELEASE_CHAPTER_TYPED_DATA = (message: any) => {
  return {
    domain,
    types: {
      ReleaseChapter: [
        { name: "bookId", type: "uint256" },
        { name: "title", type: "string" },
        { name: "gatedURI", type: "string" },
        { name: "finale", type: "bool" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "ReleaseChapter" as const,
    message,
  };
};
