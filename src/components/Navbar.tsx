"use client";

import styles from "@/styles/components/navbar.module.css";
import buttonStyles from "@/styles/components/buttons.module.css";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import { AlignJustify, ArrowLeftFromLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import { SignInButton } from "./buttons/SignInButton";
import { ConnectButton } from "./buttons/ConnectButton";
import { useAuthStore } from "@/store/authStore";
import { LogoutButton } from "./buttons/Logout";
import { truncateAddress } from "@/utils/helpers";

export const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { ready } = usePrivy();
  const { isConnected } = useAccount();
  const { logout: disconnect } = useLogout();
  const { isAuthenticated, user: signedInUser, checkAuth } = useAuthStore();

  // instead return a navigation skeleton
  if (!ready) return null;

  const navLinks = [
    { name: "Xplore", href: "/xplore" },
    { name: "Profile", href: "/profile" },
    { name: "Current Season", href: "/season" },
  ];

  return (
    <>
      {/* navigation bar */}
      <nav className={styles.navbar}>
        {/* logo */}
        <div className={styles.logo}>
          <Image
            src="/logo.png"
            height="100"
            width="100"
            alt="Euphoria E-Book logo"
          />
          <Link href="/">Euphoria</Link>
        </div>

        {/* navigation links */}
        {isAuthenticated && (
          <div className={styles.navLinks}>
            {navLinks.map((link) => {
              return (
                <Link key={link.name} href={link.href}>
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* buttons: connect, sign in, disconnect and logout */}
        <div className={styles.authButtons}>
          {!isConnected && <ConnectButton />}
          {isConnected && !isAuthenticated && <SignInButton />}

          {!isAuthenticated && (
            <button
              onClick={() => disconnect()}
              className={buttonStyles.disconnect}
            >
              Disconnect
            </button>
          )}
          {isConnected && isAuthenticated && <LogoutButton />}

          {isAuthenticated && (
            <div className={styles.signedInDetails}>
              <p>{truncateAddress(signedInUser!, 3)}</p>
            </div>
          )}
        </div>

        {!sidebarOpen && (
          <AlignJustify
            className={styles.sidebarIcon}
            onClick={() => setSidebarOpen(true)}
          />
        )}

        {sidebarOpen && (
          <div
            className={styles.navOverlay}
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </nav>

      {/* side bar, on smaller screens make this disappear*/}
      <div className={sidebarOpen ? styles.sidebar : styles.sidebarClosed}>
        <ArrowLeftFromLine
          onClick={() => setSidebarOpen(false)}
          className={styles.closeSidebarBtn}
        />

        {/* sidebar navigation links */}
        {isAuthenticated && (
          <div className={styles.sidebarLinks}>
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* buttons: connect, sign in, disconnect and logout */}
        <div className={styles.authButtonSidebar}>
          {!isConnected && <ConnectButton />}
          {isConnected && !isAuthenticated && <SignInButton />}
          {isConnected && !isAuthenticated && (
            <button
              onClick={() => disconnect()}
              className={buttonStyles.disconnect}
            >
              Disconnect
            </button>
          )}
          {isConnected && isAuthenticated && <LogoutButton />}
          {isAuthenticated && (
            <div className={styles.signedInDetails}>
              <p>{truncateAddress(signedInUser!, 3)}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
