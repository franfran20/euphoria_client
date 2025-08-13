import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";
import { Address } from "viem";
import { createPublicClient, http } from "viem";
import { morphHolesky } from "viem/chains";

export const publicClient = createPublicClient({
  chain: morphHolesky,
  transport: http(),
});

export const baseContractConfig = {
  abi: CONTRACT_ABI,
  address: CONTRACT_ADDRESS,
} as const;

export type User = Readonly<
  [
    {
      depositedBalance: bigint;
      spendBacks: bigint;
      withdrawnBookEarnings: bigint;
      booksWritten: bigint;
      subscriptionEndsAt: bigint;
      isWriter: boolean;
    },
    string, // username
    bigint // nonce
  ]
>;

export type BookDetails = Readonly<
  [
    {
      owner: Address;
      createdAt: bigint;
      chapterLock: number;
      chaptersWritten: number;
      genres: readonly bigint[];
      completed: boolean;
      lastPulledSeasonId: bigint;
      earnings: bigint;
    },
    string, // 1: book name
    string, // 2: book writer
    string, // 3: book cover image
    bigint // 4: book votes
  ]
>;

export type SeasonDetails = Readonly<
  [
    {
      votes: bigint;
      votesExcercised: bigint;
      votingStartsAt: bigint;
      votingEndsAt: bigint;
      seasonAllocationAmount: bigint;
    },
    bigint, // season id
    bigint // total books
  ]
>;

export type ChapterDetails = Readonly<[bigint, string, bigint]>; // chapter id, chapter title, created at

export const readContractUser = async (userAddress: Address) => {
  const user = await publicClient.readContract({
    ...baseContractConfig,
    functionName: "getUser",
    args: [userAddress],
  });

  return user;
};

export const readContractBookDetails = async (bookId: bigint) => {
  const bookDetails = await publicClient.readContract({
    ...baseContractConfig,
    functionName: "getBook",
    args: [bookId],
  });

  return bookDetails;
};

export const readContractUserVotes = async (userAddress: Address) => {
  const userVotes = await publicClient.readContract({
    ...baseContractConfig,
    functionName: "getUserVotes",
    args: [userAddress],
  });

  return userVotes;
};

export const readContractSeasonDetails = async () => {
  const seasonDetails = await publicClient.readContract({
    ...baseContractConfig,
    functionName: "getCurrentSeason",
  });

  return seasonDetails;
};

export const readContractChapterDetails = async (
  bookId: bigint,
  chapterId: bigint
) => {
  const chapterDetails = await publicClient.readContract({
    ...baseContractConfig,
    functionName: "getChapter",
    args: [bookId, chapterId],
  });

  return chapterDetails;
};
