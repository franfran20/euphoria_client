"use client";

import { api, useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import styles from "@/styles/season.module.css";
import { getSeasonStatus } from "@/utils/helpers";
import { formatUnits } from "viem";
import Image from "next/image";
import { BookCheck, Loader2, Vote } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { useAccount } from "wagmi";
import {
  SeasonDetails,
  readContractSeasonDetails,
  readContractUserVotes,
} from "@/utils/contractReads";
import { RequestSignIn } from "@/components/RequestSignIn";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function SeasonPage() {
  // client state
  const [seasonPhase, setSeasonPhase] = useState({
    status: "",
    text: "",
    countdown: 0,
  });

  // loading
  const [pageLoading, setPageLoading] = useState(true);
  const [startNewSeasonLoading, setStartNewSeasonloading] = useState(false);

  // contract read
  const [seasonDetails, setSeasonDetails] = useState<
    undefined | SeasonDetails
  >();
  const [userVotes, setUserVotes] = useState<undefined | bigint>();

  // authentication
  const {
    user: signedInUser,
    isAuthenticated,
    isCheckingAuth,
  } = useAuthStore();

  // router
  const router = useRouter();

  // wagmi
  const { isConnected } = useAccount();

  // fetch data, loading set and use effect
  const fetchPageDetails = async () => {
    const fetchedSeasonDetails = await readContractSeasonDetails();
    const fetchedUserVotes = await readContractUserVotes(signedInUser!);

    setUserVotes(fetchedUserVotes);
    setSeasonDetails(fetchedSeasonDetails);

    const seasonStatus = getSeasonStatus(
      Number(fetchedSeasonDetails[0].votingStartsAt),
      Number(fetchedSeasonDetails[0].votingStartsAt)
    );
    setSeasonPhase(seasonStatus);

    setPageLoading(false);
  };
  useEffect(() => {
    fetchPageDetails();
  }, [signedInUser]);

  // handlers

  const startNewSeason = async () => {
    setStartNewSeasonloading(true);
    let response;
    try {
      response = await api.post("/seasons/start");
      setStartNewSeasonloading(false);
      toast.success(`Succesfully Started New Season `);
      router.refresh();
    } catch (error) {
      setStartNewSeasonloading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } else {
        toast.error("An Unexpected error occured");
      }
    }
  };

  // conditional rendering

  // on page load
  if (pageLoading)
    return (
      <div className="loaderContainer">
        <Loader2 className="loaderIcon" />
      </div>
    );

  // on  authentication check with no user
  if (!isAuthenticated && !isCheckingAuth)
    return (
      <div className="loaderContainer">
        <RequestSignIn />
      </div>
    );

  // no connected wallet address
  if (!isConnected)
    return (
      <div className="loaderContainer">
        <RequestSignIn />
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h3>Support Your Favroite Books</h3>
        <p>
          Prepare to be captivated on an enhancing voyage through an array of
          mesmerizing stories and books crafted by visionary creators accross
          the globe
        </p>
      </div>

      <div className={styles.seasonDetails}>
        <div className={styles.seasonContent}>
          <h3>
            Current Season{" "}
            <span style={{ color: "#179cf6" }}>#{seasonDetails![1]}</span>
          </h3>

          <div className={styles.seasonBoxContainers}>
            <div className={styles.info}>
              <h5>Round Phase</h5>
              <div>
                <p># {seasonPhase.status}</p>
              </div>
            </div>

            <div className={styles.info}>
              <h5>Total votes</h5>
              <div>
                <Vote color="#179cf6" />
                <p># {seasonDetails![0].votes}</p>
              </div>
            </div>

            <div className={styles.info}>
              <h5>Votes excercised</h5>
              <div>
                <Vote color="#179cf6" />
                <p># {seasonDetails![0].votesExcercised}</p>
              </div>
            </div>

            <div className={styles.info}>
              <h5>Total books</h5>
              <div>
                <BookCheck color="#179cf6" />
                <p># {seasonDetails![2]}</p>
              </div>
            </div>

            <div className={styles.info}>
              <h5>Season allocations</h5>
              <div>
                <Image src="/usdc.png" height="100" width="100" alt="usdc" />
                <p>
                  {formatUnits(seasonDetails![0].seasonAllocationAmount, 6)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.countdownTimer}>
          <p>{seasonPhase.text}</p>
          <Countdown targetTimestamp={BigInt(seasonPhase.countdown)} />
          {seasonPhase.countdown == 0 && (
            <button onClick={() => startNewSeason()}>
              {startNewSeasonLoading ? (
                <Loader2 className="smallLoaderIcon" />
              ) : (
                " Start New Season >"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
