"use client";

import { useEffect, useState } from "react";

import styles from "@/styles/components/bookCarousel.module.css";
import { ArrowLeft, ArrowRight, BookKey, Loader2 } from "lucide-react";
import Link from "next/link";
import { displayDate } from "@/utils/helpers";
import { Genres } from "../Genres";
import { GET_FIRST_FIVE_BOOKS } from "@/utils/queries";
import { useQuery } from "@apollo/client";

export const BookCarousel = () => {
  const [current, setCurrent] = useState(0);

  const { loading: firstFiveLoading, data: firstFive } =
    useQuery(GET_FIRST_FIVE_BOOKS);

  const slideIntervalTime = 5000;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % 2);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + 2) % 2);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, slideIntervalTime);

    return () => clearInterval(interval);
  }, [current]);

  console.log(current);

  return (
    <div className={styles.carousel}>
      {firstFiveLoading && (
        <div className="loaderContainer">
          <Loader2 className="loaderIcon" />
        </div>
      )}
      {!firstFiveLoading &&
        firstFive &&
        // @ts-ignore
        firstFive.euphoriaBookCreateds.map((carouselBooks, index) => (
          <div
            key={carouselBooks.bookId}
            className={` ${index == current ? styles.active : styles.inactive}`}
          >
            <div className={styles.overlay}></div>
            <div
              className={styles.content}
              style={{ backgroundImage: `url(${carouselBooks.coverImage})` }}
            >
              <ArrowLeft
                onClick={prevSlide}
                style={{
                  marginRight: "20px",
                  zIndex: 6,
                  opacity: 0.25,
                  cursor: "pointer",
                }}
              />

              <div className={styles.bookContent}>
                <h2>{carouselBooks.name}</h2>
                <div className="blueBar"></div>
                <p>{carouselBooks.writer}</p>

                <Genres
                  // @ts-ignore
                  genres={carouselBooks.genres.split(",").map((g) => Number(g))}
                />

                <div className={styles.chaptersAndCreatedAt}>
                  <span> {displayDate(carouselBooks.createdAt)}</span>
                </div>

                <Link
                  href={`/books/${carouselBooks.bookId}`}
                  className={styles.goToBook}
                >
                  Go to book &gt;
                </Link>
              </div>

              <ArrowRight
                onClick={nextSlide}
                style={{
                  marginLeft: "auto",
                  zIndex: 6,
                  opacity: 0.25,
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        ))}
    </div>
  );
};
