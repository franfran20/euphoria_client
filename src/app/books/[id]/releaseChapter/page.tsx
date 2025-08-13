"use client";

import { ChapterInformation } from "@/components/ChapterInformation";
import { api, useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/releaseChapter.module.css";
import { ExternalLink, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  BookDetails,
  User,
  readContractBookDetails,
  readContractUser,
} from "@/utils/contractReads";
import { RequestSignIn } from "@/components/RequestSignIn";
import { useAccount, useSignTypedData } from "wagmi";
import { DEADLINE, GATED_URI } from "@/utils/constants";
import { CREATE_RELEASE_CHAPTER_TYPED_DATA } from "@/utils/typedData";
import { parseSignature } from "viem";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function ReleaseChapterPage() {
  // contract& api params
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // client states
  const [finale, setFinale] = useState(false);
  const [mode, setMode] = useState<"write" | "preview">("write");

  // loading
  const [pageLoading, setPageLoading] = useState(true);
  const [bookExists, setBookExists] = useState(true);
  const [isBookOwner, setIsBookOwner] = useState(true);
  const [releaseChapterLoading, setReleaseChapterLoading] = useState(false);

  // contract read
  const [bookDetails, setBookDetails] = useState<undefined | BookDetails>();
  const [user, setUser] = useState<undefined | User>();

  // route params
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
    const fetchedBookDetails = await readContractBookDetails(BigInt(bookId)!);
    const fetchedUser = await readContractUser(signedInUser!);

    if (fetchedBookDetails[0].createdAt.toString() == "0") setBookExists(false);
    else setBookExists(true);
    if (fetchedBookDetails[0].owner != signedInUser!) setIsBookOwner(false);

    setUser(fetchedUser);
    setBookDetails(fetchedBookDetails);
    setPageLoading(false);

    if (fetchedBookDetails[0].createdAt.toString() == "0" || !isBookOwner) {
      router.push("/xplore");
    }
  };
  useEffect(() => {
    fetchPageDetails();
  }, [signedInUser]);

  // handlers

  const releaseChapter = async () => {
    setReleaseChapterLoading(true);

    const messageParams = {
      bookId: BigInt(bookId),
      title,
      gatedURI: GATED_URI,
      finale,
      nonce: user?.[2],
      deadline: DEADLINE,
    };

    let result;
    try {
      result = await signTypedDataAsync(
        CREATE_RELEASE_CHAPTER_TYPED_DATA(messageParams)
      );
    } catch (err) {
      setReleaseChapterLoading(false);
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
      response = await api.post(`/books/${bookId}/releaseChapter`, {
        sig,
        content,
        title,
        finale,
        gatedURI: GATED_URI,
      });

      setReleaseChapterLoading(false);
      toast.success(`Succesfully Released Chapter`);
    } catch (error) {
      setReleaseChapterLoading(false);
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
  if (!bookExists || !isBookOwner)
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

      {/* write chapter details */}
      <div className={styles.writeChapterDetails}>
        <h3>
          Write Chapter: <span>#{bookDetails![0].chaptersWritten}</span>
        </h3>
        <input
          placeholder="Chapter title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <p>
          Content is written in markdown, to learn more visit here.
          <ExternalLink
            color="#179cf6"
            width="20"
            height="20"
            cursor="pointer"
            className={styles.extIcon}
          />
        </p>

        <button
          onClick={() => setFinale(!finale)}
          className={finale ? styles.finale : styles.notFinale}
        >
          finale
        </button>
      </div>

      <div className={styles.writeAndPreview}>
        <div className={styles.header}>
          <p
            className={
              mode == "write" ? styles.selectedMode : styles.unselectedMode
            }
            onClick={() => setMode("write")}
          >
            write
          </p>
          <p
            className={
              mode == "preview" ? styles.selectedMode : styles.unselectedMode
            }
            onClick={() => setMode("preview")}
          >
            preview
          </p>
        </div>

        <div className={styles.writeAndPreviewDisplay}>
          {mode == "write" ? (
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div className={styles.preview}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button onClick={() => releaseChapter()}>
          {releaseChapterLoading ? (
            <Loader2 className="smallLoaderIcon" />
          ) : (
            "Release Chapter >"
          )}
        </button>
      </div>
    </div>
  );
}
