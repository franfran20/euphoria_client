import styles from "@/styles/components/book.module.css";
import { truncateText } from "@/utils/helpers";
import { PenLine } from "lucide-react";
import Image from "next/image";
import { Genres } from "./Genres";
import Link from "next/link";

export const Book = ({
  coverImage,
  name,
  writer,
  genres,
  chaptersWritten,
  bookId,
}: {
  coverImage: string;
  name: string;
  writer: string;
  genres: number[];
  chaptersWritten: number;
  bookId: string;
}) => {
  return (
    <Link href={`/books/${bookId}`} className={styles.book}>
      <Image
        src={coverImage}
        height="1000"
        width="1000"
        alt="euphoria book cover"
      />
      <div className={styles.bottomDetails}>
        <p className={styles.name}>{truncateText(name, 26)}</p>

        <p className={styles.writer}>{truncateText(writer, 26)}</p>

        <div className={styles.genres}>
          <Genres genres={genres} />
        </div>

        <div className="IconAndText" style={{ marginTop: "8px" }}>
          <PenLine color="#179cf6" height="10px" width="10px" />
          <span style={{ fontSize: "13px" }}>{chaptersWritten}</span>
        </div>
      </div>
    </Link>
  );
};
