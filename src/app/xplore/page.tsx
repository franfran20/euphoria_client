"use client";

import { Book } from "@/components/Book";
import { BookCarousel } from "@/components/xplore/BookCarousel";
import styles from "@/styles/xplore.module.css";
import { useQuery } from "@apollo/client";
import { GET_ALL_BOOKS } from "@/utils/queries";

export default function XplorePage() {
  const { loading: allBooksLoading, data: allBooks } = useQuery(GET_ALL_BOOKS);

  return (
    <div className={styles.page}>
      <BookCarousel />

      <div className={styles.allBooks}>
        <h3>All Books</h3>
      </div>

      {/* all books  */}
      <div className={styles.allBooksContainer}>
        {allBooks &&
          !allBooksLoading &&
          // @ts-ignore
          allBooks.euphoriaBookCreateds.map((book) => (
            <Book
              key={book.bookId}
              coverImage={book.coverImage}
              writer={book.writer}
              name={book.name}
              genres={book.genres.split(",").map(Number)}
              chaptersWritten={book.chaptersWritten}
              bookId={book.bookId.toString()}
            />
          ))}
      </div>
    </div>
  );
}
