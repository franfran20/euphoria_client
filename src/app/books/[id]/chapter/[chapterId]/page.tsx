"use client";

import { api, useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/readChapter.module.css";
import { ChapterInformation } from "@/components/ChapterInformation";
import { displayDate } from "@/utils/helpers";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import { Loader2, LockKeyhole, LucideNotebookText } from "lucide-react";
import {
  BookDetails,
  ChapterDetails,
  User,
  readContractBookDetails,
  readContractChapterDetails,
  readContractUser,
} from "@/utils/contractReads";
import { RequestSignIn } from "@/components/RequestSignIn";
import { useAccount } from "wagmi";

export default function ReadChapterPage() {
  // client & api states
  const [chapterContent, setChapterContent] = useState();
  const [chapterDetails, setChapterDetails] = useState<
    undefined | ChapterDetails
  >();

  const [chapterExists, setChapterExists] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // loading
  const [pageLoading, setPageLoading] = useState(true);
  const [bookExists, setBookExists] = useState(true);

  // contract read
  const [bookDetails, setBookDetails] = useState<undefined | BookDetails>();
  const [user, setUser] = useState<undefined | User>();

  // route params
  const { id: bookId, chapterId }: { id: string; chapterId: string } =
    useParams();
  const router = useRouter();

  // authentication
  const {
    user: signedInUser,
    isAuthenticated,
    isCheckingAuth,
  } = useAuthStore();

  // wagmi
  const { isConnected } = useAccount();

  // fetch data, loading set and use effect
  const fetchPageDetails = async () => {
    const fetchedBookDetails = await readContractBookDetails(BigInt(bookId)!);
    const fetchedUser = await readContractUser(signedInUser!);
    const fetchedChapterDetails = await readContractChapterDetails(
      BigInt(bookId),
      BigInt(chapterId)
    );

    // checks
    if (fetchedBookDetails[0].createdAt.toString() == "0") setBookExists(false);
    if (fetchedBookDetails[0].chaptersWritten < Number(chapterId)) {
      setChapterExists(false);
      setHasAccess(false);
    }

    // has access
    try {
      const response = await api.get(`/books/${bookId}/chapter/${chapterId}`);
      if (response.data.content && response.data.content.length > "2") {
        setHasAccess(true);
        setChapterContent(response.data.content);
      }
    } catch (error) {
      setChapterContent(undefined);
      setHasAccess(false);
    }

    console.log(hasAccess);
    setUser(fetchedUser);
    setBookDetails(fetchedBookDetails);
    setChapterDetails(fetchedChapterDetails);

    setPageLoading(false);
    if (fetchedBookDetails[0].createdAt.toString() == "0") {
      router.push("/xplore");
    }
  };
  useEffect(() => {
    fetchPageDetails();
  }, [signedInUser]);

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
      <ChapterInformation
        bookId={bookId}
        coverImage={bookDetails![3]}
        name={bookDetails![1]}
        writer={bookDetails![2]}
        genres={bookDetails![0].genres.map((g) => Number(g))}
        completed={bookDetails![0].completed}
        createdAt={Number(bookDetails![0].createdAt)}
        chaptersWritten={bookDetails![0].chaptersWritten}
        chapterLock={bookDetails![0].chapterLock}
      />

      <div className={styles.chapterHeader}>
        <h5>
          Chapter {chapterDetails![0]}: {chapterDetails![1]}
        </h5>

        <span>{displayDate(Number(chapterDetails![2]))}</span>
      </div>

      <div className={styles.chapterContent}>
        {!chapterExists && (
          <div className={styles.notSubscribed}>
            <LucideNotebookText className={styles.lockIcon} />
            <h4>Chapter Unavailable</h4>
            <p>
              This Chapter is has not yet been released by the writer. If the
              chapter has been released, then it simply isnt available on
              euphoria.
            </p>
          </div>
        )}

        {chapterExists && (
          <div>
            {hasAccess ? (
              <div className={styles.chapterWriting}>
                <ReactMarkdown>{chapterContent}</ReactMarkdown>
              </div>
            ) : (
              <div className={styles.notSubscribed}>
                <LockKeyhole className={styles.lockIcon} />
                <h4>Chapter Locked</h4>
                <p>
                  This chapter is unavailable to you because you are not
                  subscribed. To continue to read chapters of this book and
                  others please subscribe to our platform
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
