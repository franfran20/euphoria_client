"use client";

import { api, useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/book.module.css";
import { Genres } from "@/components/Genres";
import { displayDate, getTimeLeft, truncateAddress } from "@/utils/helpers";
import {
  Bookmark,
  BookmarkCheck,
  BookmarkMinus,
  Loader2,
  PenBox,
  Vote,
} from "lucide-react";
import Image from "next/image";
import { formatUnits, parseSignature, parseUnits } from "viem";
import { DEADLINE, DECIMALS } from "@/utils/constants";
import Link from "next/link";
import {
  BookDetails,
  SeasonDetails,
  User,
  readContractBookDetails,
  readContractSeasonDetails,
  readContractUser,
  readContractUserVotes,
} from "@/utils/contractReads";
import { RequestSignIn } from "@/components/RequestSignIn";
import { useAccount, useSignTypedData } from "wagmi";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {
  CREATE_ALLOCATE_TO_BOOK_TYPED_DATA,
  CREATE_VOTE_BOOK_TYPED_DATA,
} from "@/utils/typedData";

export default function BookPage() {
  // contract params
  const [allocationAmount, setAllocationAmount] = useState<
    undefined | bigint
  >();
  const [voteCount, setVoteCount] = useState(0);
  const [bookmarks, setBookmarks] = useState();
  const [bookDescription, setBookDescitpion] = useState();

  // loading
  const [pageLoading, setPageLoading] = useState(true);
  const [bookExists, setBookExists] = useState(true);
  const [allocationAmountLoading, setAllocationAmountLoading] = useState(false);
  const [voteCountLoading, setVoteCountLoading] = useState(false);
  const [pullBookEarningsLoading, setPullBookEarningsLoading] = useState(false);

  // contract read
  const [user, setUser] = useState<undefined | User>();
  const [bookDetails, setBookDetails] = useState<undefined | BookDetails>();
  const [userVotes, setUserVotes] = useState<undefined | bigint>();
  const [seasonDetails, setSeasonDetails] = useState<
    undefined | SeasonDetails
  >();

  // route param
  const { id: bookId }: { id: string } = useParams();
  const router = useRouter();

  // authentication
  const {
    user: signedInUser,
    isAuthenticated,
    isCheckingAuth,
  } = useAuthStore();

  // wagmi
  const { isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  // fetch data, loading set and use effect
  const fetchPageDetails = async () => {
    // contract info
    const fetchedUser = await readContractUser(signedInUser!);
    const fetchedBookDetails = await readContractBookDetails(BigInt(bookId)!);
    const fetchedUserVotes = await readContractUserVotes(signedInUser!);
    const fetchedSeasonDetails = await readContractSeasonDetails();

    // from db
    const {
      data: { book },
    } = await api.get(`/books/${bookId}`);
    const {
      data: { bookmarks },
    } = await api.get(`/books/${bookId}/bookmark`);

    if (bookmarks) setBookmarks(bookmarks);
    if (book) setBookDescitpion(book.description);

    if (fetchedBookDetails[0].createdAt.toString() == "0") setBookExists(false);
    else setBookExists(true);

    setUser(fetchedUser);
    setBookDetails(fetchedBookDetails);
    setUserVotes(fetchedUserVotes);
    setSeasonDetails(fetchedSeasonDetails);

    setPageLoading(false);

    if (fetchedBookDetails[0].createdAt.toString() == "0") {
      router.push("/xplore");
    }
  };
  useEffect(() => {
    fetchPageDetails();
  }, [signedInUser]);

  // handlers

  const pullSeasonEarnings = async () => {
    setPullBookEarningsLoading(true);
    let response;
    try {
      response = await api.post("/seasons/pullEarnings", {
        bookId,
        seasonId: Number(seasonDetails![1]) - 1, // the previous season
      });
      setPullBookEarningsLoading(false);
      toast.success(`Succesfully Pulled Book Earnings.`);
    } catch (error) {
      setPullBookEarningsLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } else {
        toast.error("An Unexpected error occured");
      }
    }
  };

  const voteBook = async () => {
    setVoteCountLoading(true);

    const messageParams = {
      bookId: BigInt(bookId),
      votes: BigInt(voteCount),
      nonce: user?.[2],
      deadline: DEADLINE,
    };

    let result;
    try {
      result = await signTypedDataAsync(
        CREATE_VOTE_BOOK_TYPED_DATA(messageParams)
      );
    } catch (err) {
      setVoteCountLoading(false);
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
      response = await api.post(`/books/${bookId}/vote`, {
        sig,
        votes: voteCount,
      });
      setVoteCountLoading(false);
      toast.success(`Succesfully Voted Book`);
    } catch (error) {
      setVoteCountLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } else {
        toast.error("An Unexpected error occured");
      }
    }
  };

  const allocateToBook = async () => {
    setAllocationAmountLoading(true);

    const messageParams = {
      bookId: BigInt(bookId),
      amount: allocationAmount,
      nonce: user?.[2],
      deadline: DEADLINE,
    };

    let result;
    try {
      result = await signTypedDataAsync(
        CREATE_ALLOCATE_TO_BOOK_TYPED_DATA(messageParams)
      );
    } catch (err) {
      setAllocationAmountLoading(false);
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
      response = await api.post(`/users/allocateTobook`, {
        sig,
        amount: Number(allocationAmount),
        bookId: Number(bookId),
      });
      setAllocationAmountLoading(false);
      toast.success(
        `Allocated ${formatUnits(
          allocationAmount!,
          DECIMALS
        )} USDC to Book ID: ${bookId} writer.`
      );
    } catch (error) {
      setAllocationAmountLoading(false);
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

  // while routing no flashing
  if (!bookExists)
    return (
      <div className="loaderContainer">
        <Loader2 className="loaderIcon" />
      </div>
    );

  return (
    <div className={styles.page}>
      <div
        className={styles.bookHeroSection}
        style={{ backgroundImage: `url(${bookDetails![3]})` }}
      >
        <div className={styles.bookHeroOverlay}>
          {/* book information */}
          <div className={styles.bookInformation}>
            <h3>{bookDetails![1]}</h3>
            <div className="blueBar"></div>
            <p className={styles.writer}>{bookDetails![2]}</p>
            <div className={styles.genre}>
              <Genres genres={bookDetails![0].genres.map((g) => Number(g))} />
            </div>
            <span>{displayDate(Number(bookDetails![0].completed))}</span>

            {/* books and chapters written */}
            <div className={styles.bookmarksAndChapterWritten}>
              <div className={styles.bookInfo}>
                <Bookmark color="#179cf6" />
                <p>{bookmarks ? bookmarks : "0"}</p>
              </div>

              <div className={styles.bookInfo}>
                <PenBox color="#179cf6" />
                <p>{bookDetails![0].chaptersWritten}</p>
              </div>
            </div>
          </div>

          {bookDescription && (
            <p className={styles.bookDescription}>{bookDescription}</p>
          )}
        </div>
      </div>

      <div className={styles.bookAndSeasonActivity}>
        {/* book left hand details */}
        <div className={styles.bookContractDetails}>
          <div className={styles.bookActionBtns}>
            <button>
              <BookmarkMinus color="#179cf6" />
            </button>

            <Link
              href={`/books/${bookId}/chapter/1`}
              style={{ backgroundColor: "#179cf6", color: "#ffffff" }}
            >
              Start Reading &gt;
            </Link>
            {signedInUser == bookDetails![0].owner && (
              <Link
                href={`/books/${bookId}/releaseChapter`}
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
              >
                Drop Chapter &gt;
              </Link>
            )}
          </div>

          {/* multiple detail boxes */}
          <div className={styles.bookMultipleInfo}>
            {/* book id */}
            <div className={styles.info}>
              <h5>Book Id</h5>
              <div>
                <p># {bookId}</p>
              </div>
            </div>

            {/* writer address */}
            <div className={styles.info}>
              <h5>Creator</h5>
              <div>
                <p>{truncateAddress(bookDetails![0].owner)}</p>
              </div>
            </div>

            {/* chapter lock */}
            <div className={styles.info}>
              <h5>Chapters</h5>
              <div>
                <Image src="/usdc.png" height="100" width="100" alt="usdc" />
                <p>{bookDetails![0].chaptersWritten}</p>
              </div>
            </div>

            {/* book mark count */}
            <div className={styles.info}>
              <h5>Bookmarks</h5>
              <div>
                <BookmarkCheck color="#179cf6" />
                <p>{bookmarks ? bookmarks : "0"}</p>
              </div>
            </div>

            {/* chapter lock */}
            <div className={styles.info}>
              <h5>Chapter Lock</h5>
              <div>
                <p>{bookDetails![0].chapterLock}</p>
              </div>
            </div>

            {/* claimed earnings */}
            <div className={styles.info}>
              <h5>Claimed Earnings</h5>
              <div>
                <Image src="/usdc.png" height="100" width="100" alt="usdc" />
                <p>{formatUnits(bookDetails![0].earnings, DECIMALS)}</p>
              </div>
            </div>
          </div>

          {/* withdraw unclaimed earnings */}
          {signedInUser == bookDetails![0].owner && (
            <div className={styles.contractActionInput}>
              <h4>Pull unclaimed earnings</h4>
              <div className={styles.contractAction}>
                <button
                  style={{ backgroundColor: "#1a1a1a", color: "#179cf6" }}
                  onClick={() => pullSeasonEarnings()}
                >
                  {pullBookEarningsLoading ? (
                    <Loader2 className="smallLoaderIcon" />
                  ) : (
                    "Pull Earnings"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* book season activity, right hand side */}
        <div className={styles.seasonActivity}>
          <h3>
            Season Activity: <span>{seasonDetails![1]}</span>
          </h3>
          <p className={styles.timeLeft}>
            {getTimeLeft(Number(seasonDetails![0].votingEndsAt))}
          </p>

          {/* book season boxes */}
          <div className={styles.bookSeasonAllocations}>
            {/* allocation balance */}
            {signedInUser == bookDetails![0].owner && (
              <div className={styles.info}>
                <h5>Allocation balance</h5>
                <div>
                  <Image src="/usdc.png" height="100" width="100" alt="usdc" />
                  <p>{formatUnits(user![0].spendBacks, DECIMALS)}</p>
                </div>
              </div>
            )}

            {/* user votes balance */}
            <div className={styles.info}>
              <h5>Avaialable votes</h5>
              <div>
                <Vote color="#179cf6" />
                <p>{userVotes!}</p>
              </div>
            </div>

            {/* received votes balance */}
            <div className={styles.info}>
              <h5>Received votes</h5>
              <div>
                <Vote color="#179cf6" />
                <p>{bookDetails![4]}</p>
              </div>
            </div>
          </div>

          {/* allocate and vote book actions */}
          <div className={styles.allocateAndVote}>
            {/* allocate to book */}
            <div className={styles.contractActionInput}>
              <h4>Allocate to book</h4>
              <div className={styles.contractAction}>
                <input
                  onChange={(e) =>
                    setAllocationAmount(parseUnits(e.target.value, DECIMALS))
                  }
                  placeholder="Amount"
                />
                <button
                  onClick={() => allocateToBook()}
                  style={{ backgroundColor: "#1a1a1a", color: "#179cf6" }}
                >
                  {allocationAmountLoading ? (
                    <Loader2 className="smallLoaderIcon" />
                  ) : (
                    ">"
                  )}
                </button>
              </div>
            </div>

            {/* vote for book */}
            {seasonDetails![0].votingEndsAt > Date.now() / 1000 && (
              <div className={styles.contractActionInput}>
                <h4>Vote for book</h4>
                <div className={styles.contractAction}>
                  <input
                    placeholder="Vote amount"
                    onChange={(e) => setVoteCount(Number(e.target.value))}
                  />
                  <button
                    style={{ backgroundColor: "#179cf6", color: "#1a1a1a" }}
                    onClick={() => voteBook()}
                  >
                    {voteCountLoading ? (
                      <Loader2 className="smallLoaderIcon" />
                    ) : (
                      ">"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
