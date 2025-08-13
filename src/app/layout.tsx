"use client";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";

import { Navbar } from "@/components/Navbar";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import {
  privyAppId,
  privyClientId,
  privyConfig,
  queryClient,
  wagmiConfig,
} from "./utils/configs";
import { CheckAuth } from "@/components/providers/CheckAuth";
import { SkeletonTheme } from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://api.goldsky.com/api/public/project_cmct7jxl7s3q301wwagsvem8q/subgraphs/euphoria/1.0.0/gn",
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider
          appId={privyAppId}
          clientId={privyClientId}
          config={privyConfig}
        >
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
              <SkeletonTheme baseColor="#202020" highlightColor="#4a4a4a">
                <CheckAuth>
                  <ToastContainer />
                  <ApolloProvider client={apolloClient}>
                    <Navbar />
                    {children}
                  </ApolloProvider>
                </CheckAuth>
              </SkeletonTheme>
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
