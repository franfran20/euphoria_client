"use client";

import { Countdown } from "@/components/Countdown";
import { RequestSignIn } from "@/components/RequestSignIn";
import { api, useAuthStore } from "@/store/authStore";
import styles from "@/styles/profile.module.css";
import { DEADLINE, DECIMALS, SUBSCRIPTION_COST } from "@/utils/constants";
import {
  User,
  baseContractConfig,
  readContractUser,
} from "@/utils/contractReads";
import { truncateAddress } from "@/utils/helpers";
import {
  CREATE_REGISTER_TYPED_DATA,
  CREATE_SUBSCRIBE_TYPED_DATA,
} from "@/utils/typedData";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatUnits, parseSignature, parseUnits } from "viem";
import { useSignTypedData, useWriteContract } from "wagmi";

export default function ProfilePage() {
  // contract params
  const [mintAmount, setMintAmount] = useState<bigint>();
  const [withdrawAmount, setWithdrawAmount] = useState<bigint>();
  const [usernameInput, setUsernameInput] = useState<string>("");

  // button loading
  const [mintLoading, setMintLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState<bigint>();
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [registerLoading, setRegsiterLoading] = useState(false);

  // pagination
  const [bookMarkPage, setBookMarkPage] = useState(0);
  const [releasesPage, setReleasesPage] = useState(0);

  // contract read
  const [user, setUser] = useState<undefined | User>();
  const [pageLoading, setPageLoading] = useState(true);

  // authentication
  const {
    user: signedInUser,
    isAuthenticated,
    isCheckingAuth,
  } = useAuthStore();

  // wagmi
  const { signTypedDataAsync } = useSignTypedData();
  const { writeContractAsync } = useWriteContract();

  // fetch data, loading set and use effect
  const fetchPageDetails = async () => {
    const fetchedUser = await readContractUser(signedInUser!);
    setUser(fetchedUser);
    setPageLoading(false);
  };

  useEffect(() => {
    fetchPageDetails();
  }, [signedInUser]);

  // handlers
  const mint = async () => {
    setMintLoading(true);
    let response;
    try {
      response = await api.post("/users/mint", {
        recipient: signedInUser,
        amount: Number(mintAmount),
      });
      setMintLoading(false);
      toast.success(
        `Succesfully Minted ${formatUnits(mintAmount!, DECIMALS)} USDC`
      );
    } catch (error) {
      setMintLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } else {
        toast.error("An Unexpected error occured");
      }
    }
  };

  // To Be Fixed
  const withdraw = async () => {
    try {
      await writeContractAsync({
        ...baseContractConfig,
        functionName: "withdrawBalance",
        args: [withdrawAmount!, signedInUser!],
      });
      toast.success(
        `Succesfully Minted ${formatUnits(mintAmount!, DECIMALS)} USDC`
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong withdrawing");
    }
  };

  const subscribe = async () => {
    setSubscribeLoading(true);

    const messageParams = {
      subscriptionCost: SUBSCRIPTION_COST,
      nonce: user?.[2],
      deadline: DEADLINE,
    };

    let result;

    try {
      result = await signTypedDataAsync(
        CREATE_SUBSCRIBE_TYPED_DATA(messageParams)
      );
    } catch (error) {
      setSubscribeLoading(false);
      return;
    }

    const { r, s, v } = parseSignature(result);
    const sig = {
      deadline: DEADLINE,
      nonce: Number(messageParams.nonce),
      v: Number(v),
      r,
      s,
      user: signedInUser,
    };

    let response;
    try {
      response = await api.post("/users/subscribe", {
        sig,
      });
      setSubscribeLoading(false);
      toast.success("Succesfully Subscribed");
    } catch (error) {
      setSubscribeLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } else {
        toast.error("An Unexpected error occured");
      }
    }
  };

  const register = async () => {
    setRegsiterLoading(true);

    const messageParams = {
      username: usernameInput,
      nonce: user?.[2],
      deadline: DEADLINE,
    };

    let result;
    try {
      result = await signTypedDataAsync(
        CREATE_REGISTER_TYPED_DATA(messageParams)
      );
    } catch (err) {
      setRegsiterLoading(false);
      return;
    }

    const { r, s, v } = parseSignature(result);
    const sig = {
      deadline: DEADLINE,
      nonce: Number(messageParams.nonce),
      v: Number(v),
      r,
      s,
      user: signedInUser,
    };

    let response;
    try {
      response = await api.post("/users/register", {
        sig,
        username: messageParams.username,
      });
      setRegsiterLoading(false);
      toast.success(`Succesfully Registed As ${usernameInput}`);
    } catch (error) {
      setRegsiterLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } else {
        toast.error("An Unexpected error occured");
      }
    }
  };

  // conditional rendering
  if (pageLoading)
    return (
      <div className="loaderContainer">
        <Loader2 className="loaderIcon" />
      </div>
    );

  if (!isAuthenticated && !isCheckingAuth)
    return (
      <div className="loaderContainer">
        <RequestSignIn />
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.userDetails}>
        <div className={styles.userInfo}>
          {/* welcome header */}
          <h2>Welcome back, {truncateAddress(signedInUser!)}</h2>

          {/* bio */}
          <div className={styles.bio}>
            <h5>Bio</h5>
            <p>Your username is {user![1] == "" ? "----" : user![1]}</p>
          </div>

          {/* user balances and book info */}
          <div className={styles.balancesAndBookInfo}>
            {/* box one*/}
            <div className={styles.info}>
              <h5>Withdrawn book earn.</h5>
              <div>
                <Image src="/usdc.png" height="100" width="100" alt="usdc" />
                <p>{formatUnits(user![0].withdrawnBookEarnings, DECIMALS)}</p>
              </div>
            </div>
            {/* box two*/}
            <div className={styles.info}>
              <h5>Internal balances</h5>
              <div>
                <Image src="/usdc.png" height="100" width="100" alt="usdc" />
                <p>{formatUnits(user![0].depositedBalance, DECIMALS)}</p>
              </div>
            </div>
            {/* box three*/}
            <div className={styles.info}>
              <h5>Books written</h5>
              <div>
                <p>{user![0].booksWritten}</p>
              </div>
            </div>
          </div>

          {/* deposit, withdraw and mint to faucet */}
          <div className={styles.depositWithdrawMint}>
            {/* withdraw */}
            <div className={styles.inputActionContainer}>
              <h4>Withdraw</h4>
              <div className={styles.inputAction}>
                <input
                  placeholder="Amount"
                  onChange={(e) =>
                    setWithdrawAmount(parseUnits(e.target.value, 6))
                  }
                />
                <button
                  onClick={() => withdraw()}
                  style={{ backgroundColor: "#179cf6", color: "#1a1a1a" }}
                >
                  {withdrawLoading ? (
                    <Loader2 className="smallLoaderIcon" />
                  ) : (
                    ">"
                  )}
                </button>
              </div>
            </div>

            {/* mint to wallet */}
            <div className={styles.inputActionContainer}>
              <h4>Mint</h4>
              <div className={styles.inputAction}>
                <input
                  placeholder="Amount"
                  onChange={(e) => setMintAmount(parseUnits(e.target.value, 6))}
                />
                <button
                  onClick={() => mint()}
                  style={{ backgroundColor: "#1a1a1a", color: "#179cf6" }}
                >
                  {mintLoading ? <Loader2 className="smallLoaderIcon" /> : ">"}
                </button>
              </div>
            </div>
          </div>

          <Link href="/books/release" className={styles.releaseBookBtn}>
            Release New Book &gt;
          </Link>
        </div>

        {/* subscription details */}
        <div className={styles.subscriptionDetails}>
          <h3>Subscription Details</h3>

          {/* subscription cost box*/}
          <div className={styles.info}>
            <h5>Subscription Cost</h5>
            <div>
              <Image src="/usdc.png" height="100" width="100" alt="usdc" />
              <p>{formatUnits(SUBSCRIPTION_COST, DECIMALS)}</p>
            </div>
          </div>

          <h6>Subscription ends in: </h6>

          {/* countdown and subscribe btn */}
          <div className={styles.subscriptionEndsAt}>
            <Countdown targetTimestamp={user![0].subscriptionEndsAt} />
            {user![0].subscriptionEndsAt < Date.now() / 1000 && (
              <button onClick={() => subscribe()}>
                {subscribeLoading ? (
                  <Loader2 className="smallLoaderIcon" />
                ) : (
                  "Subscribe >"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* sign up section */}
      {user![1] == "" && (
        <div className={styles.signUpAsWriter}>
          <h3>Sign up as a writer</h3>
          <p>
            Your chance to join a thriving ecosystem of writers and spread your
            creativity for different readers across the globe. Join the writing
            community now!
          </p>

          <input
            placeholder="Username"
            onChange={(e) => setUsernameInput(e.target.value)}
          />

          <button
            disabled={usernameInput.length < 3}
            onClick={() => register()}
          >
            {registerLoading ? (
              <Loader2 className="smallLoaderIcon" />
            ) : (
              "Register"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
