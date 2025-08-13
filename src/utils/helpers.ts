import { Address } from "viem";

export const truncateAddress = (
  address: string | Address,
  length = 4
): string => {
  return `${address.slice(0, 2 + length)}...${address.slice(-length)}`;
};

const getDaySuffix = (d: number) => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const displayDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const suffix = getDaySuffix(day);
  return `${day}${suffix} ${month} ${year}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const getTimeLeft = (futureTimestamp: number): string => {
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  let diff = futureTimestamp - now;

  if (diff <= 0) {
    return "0d 0h 0m 0s";
  }

  const days = Math.floor(diff / (24 * 60 * 60));
  diff %= 24 * 60 * 60;

  const hours = Math.floor(diff / (60 * 60));
  diff %= 60 * 60;

  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const getSeasonStatus = (
  votingStartsAt: number,
  votingEndsAt: number
): { status: string; text: string; countdown: number } => {
  const now = Math.floor(Date.now() / 1000);

  if (now < votingStartsAt) {
    return {
      status: "Normal",
      text: "Voting starts in: ",
      countdown: votingStartsAt,
    };
  }

  if (now >= votingStartsAt && now < votingEndsAt) {
    return {
      status: "Voting",
      text: "Voting ends at: ",
      countdown: votingEndsAt,
    };
  }

  return {
    status: "Voting Ended",
    text: "",
    countdown: 0,
  };
};
