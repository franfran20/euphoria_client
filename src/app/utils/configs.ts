import { QueryClient } from "@tanstack/react-query";
import { morphHolesky } from "viem/chains";
import { createConfig, http } from "wagmi";

// query client
export const queryClient = new QueryClient();

// wagmi config
export const wagmiConfig = createConfig({
  chains: [morphHolesky],
  transports: {
    [morphHolesky.id]: http(),
  },
});

// privy config
export const privyConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets" as "users-without-wallets",
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ["wallet", "email", "github", "twitter"] as (
    | "wallet"
    | "email"
    | "github"
    | "twitter"
  )[],
  appearance: {
    showWalletLoginFirst: true,
    theme: "dark" as "dark",
  },
};

export const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!;

export const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
