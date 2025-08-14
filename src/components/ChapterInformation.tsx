"use client";

import styles from "@/styles/components/chapterInfromation.module.css";
import Image from "next/image";
import { Genres } from "./Genres";
import { displayDate } from "@/utils/helpers";
import { useState } from "react";
import Link from "next/link";

export const ChapterInformation = ({
  bookId,
  coverImage,
  name,
  writer,
  genres,
  completed,
  createdAt,
  chaptersWritten,
  chapterLock,
}: {
  bookId: string;
  coverImage: string;
  name: string;
  writer: string;
  genres: number[];
  completed: boolean;
  createdAt: number;
  chaptersWritten: number;
  chapterLock: number;
}) => {
  const [chapterId, setChapterId] = useState<undefined | string>();

  return (
    <div className={styles.chapterInformation}>
      <Image
        src={coverImage}
        height="1000"
        width="2000"
        alt="euphoria book cover"
      />

      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.writer}>{writer}</p>

        <div className={styles.genres}>
          <Genres genres={genres} />
        </div>

        <p className={styles.completed}>
          {completed ? "Completed" : "Ongoing"}
        </p>

        <div className={styles.chaptersWrittenAndCreatedAt}>
          <p>{displayDate(Number(createdAt))}</p>
          <p>Chapter Lock: {chapterLock}</p>
        </div>

        <div className={styles.goToChapter}>
          <input
            placeholder="Go to chapter"
            onChange={(e) => setChapterId(e.target.value)}
          />

          <Link href={`/books/${bookId}/chapter/${chapterId}`}>&gt;</Link>
        </div>
      </div>
    </div>
  );
};
