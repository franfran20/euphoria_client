"use client";

import { RequestSignIn } from "@/components/RequestSignIn";
import { api, useAuthStore } from "@/store/authStore";
import styles from "@/styles/releaseBook.module.css";
import { BOOK_GENRES_ARRAY, DEADLINE, DECIMALS } from "@/utils/constants";
import { User, readContractUser } from "@/utils/contractReads";
import axios, { AxiosError } from "axios";
import { Loader2, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatUnits } from "viem";
import { useSignTypedData } from "wagmi";
import { CREATE_BOOK_TYPED_DATA } from "@/utils/typedData";
import { parseSignature } from "viem";
import { useRouter } from "next/navigation";

export default function ReleaseNewBookpage() {
  // contract params
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [imageURI, setImageURI] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [chapterLock, setChapterLock] = useState(0);

  // display image
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>();
  const [createBookLoading, setCreateBookLoading] = useState(false);

  // contract read
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState<undefined | User>();

  // router
  const router = useRouter();

  // autheneticaton
  const {
    user: signedInUser,
    isAuthenticated,
    isCheckingAuth,
  } = useAuthStore();
  const { signTypedDataAsync } = useSignTypedData();

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

  // create book
  const createBook = async () => {
    setCreateBookLoading(true);
    const messageParams = {
      chapterLock: chapterLock,
      name: bookName,
      coverImage: imageURI,
      genre: selectedGenres,
      nonce: user?.[2],
      deadline: DEADLINE,
    };

    let result;
    try {
      result = await signTypedDataAsync(CREATE_BOOK_TYPED_DATA(messageParams));
    } catch (error) {
      setCreateBookLoading(false);
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
      response = await api.post("/books/create", {
        chapterLock: messageParams.chapterLock,
        name: messageParams.name,
        coverImageURI: messageParams.coverImage,
        genres: messageParams.genre,
        sig,
        description: bookDescription,
      });
      setCreateBookLoading(false);
      console.log(response.data.book.bookId);
      toast.success("Succesfully Created Book");
      router.refresh();
    } catch (error) {
      setCreateBookLoading(false);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } else {
        toast.error("An Unexpected error occured");
      }
    }
  };

  // toggle genre
  const toggleGenre = (genre: number) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g != genre));
    } else {
      if (selectedGenres.length < 3)
        setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // image handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadLoading(true);
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      // this can be replaced with a toast
      toast.error("Only PNG or JPEG images are allowed!");
      e.target.value = "";
      setUploadLoading(false);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be smaller than 2MB!");
      e.target.value = "";
      setUploadLoading(false);
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");
    setSelectedImageUrl(URL.createObjectURL(file));

    let response;
    try {
      response = await axios.post("/api/pinataUpload", {
        base64File,
        filename: file.name,
      });
      console.log(response.data.uploadURL);
      setImageURI(response.data.uploadURL);

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.log(response?.data.error);
      toast.error("Image upload failed");
    }
    setUploadLoading(false);
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
      <h3 className={styles.pageHeader}>Release New Book</h3>
      <p className={styles.pageParagraph}>
        Release a new book into the wild, name it and attach a description,
        publish it and attract audience attention
      </p>

      {/* book cost and balance */}
      <div className={styles.bookCostAndBalance}>
        {/* box one*/}
        <div className={styles.info}>
          <h5>Book Creation Cost</h5>
          <div>
            <Image src="/usdc.png" height="100" width="100" alt="usdc" />
            <p>1.100</p>
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
      </div>

      {/* inputs: book name, description and chapter lock */}
      <div className={styles.inputContainer}>
        <div className={styles.nameAndDescription}>
          <input
            className={styles.inputName}
            placeholder="Book name"
            onChange={(e) => setBookName(e.target.value)}
          />
          <textarea
            className={styles.inputDescription}
            placeholder="Book description"
            onChange={(e) => setBookDescription(e.target.value)}
          />
        </div>

        <div className={styles.chapterLock}>
          <h3>Chapter Lock</h3>
          <p>
            The chapter from which subscriptions owuld be required from users to
            continue reading. Must be greater than 3
          </p>
          <input
            placeholder="Chapter lock"
            onChange={(e) => setChapterLock(Number(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.genreAndImagePreview}>
        <div className={styles.genreAndCoverImage}>
          {/* genre */}
          <div className={styles.genre}>
            <h4>Select Genre</h4>
            <span>You can only pick 3 genres</span>

            <div className={styles.genreOptions}>
              {BOOK_GENRES_ARRAY.map((genre, index) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(index)}
                  className={
                    selectedGenres.includes(index)
                      ? styles.selectedGenre
                      : styles.unselectedGenre
                  }
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* book cover image */}
          <div className={styles.coverImageInput}>
            <h4>Book Cover Image</h4>
            <p>
              Focus on Choosing an image tat would lookk good on the both
              previews
            </p>
            <input
              type="file"
              id="coverImage"
              onChange={(e) => handleImageChange(e)}
            />
            <label htmlFor="coverImage">
              {uploadLoading ? (
                <Loader2Icon className="loaderIcon" />
              ) : (
                "Select Image"
              )}
            </label>
          </div>
        </div>

        <div className={styles.imagePreview}>
          {selectedImageUrl && (
            <Image
              src={selectedImageUrl}
              height="1000"
              width="1000"
              alt="usdc"
              className={styles.imgFullWidth}
            />
          )}
          {selectedImageUrl && (
            <Image
              src={selectedImageUrl}
              height="1000"
              width="1000"
              alt="usdc"
              className={styles.imgBookWidth}
            />
          )}
        </div>
      </div>

      <button className={styles.createBookBtn} onClick={() => createBook()}>
        {createBookLoading ? (
          <Loader2 className="smallLoaderIcon" />
        ) : (
          "Create Book >"
        )}
      </button>
    </div>
  );
}
