"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <motion.img
          src="/heroImage.png"
          height="1000"
          width="1000"
          alt="euphori-hero-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.div
          initial={{ x: -1000 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            bounce: 0.25,
          }}
          className={styles.heroContainer}
        >
          <h3>Step Into The Buzz Of The Euphoria...</h3>

          <div className={styles.coloredBars}>
            <div className="blueBar"></div>
            <div className="transparentBar"></div>
          </div>

          <p>
            Prepare to be captivated on an enchanting voyage through an array of
            mesmerizing stories and books crafted by visionary creators across
            the globe. Read books endlesly till your heart desire, from drama,
            fantasy, african culture, science, romance, thriller, we go you
            covered...
          </p>
          <Link href="/xplore">Visit App &gt;</Link>
        </motion.div>{" "}
      </div>

      <footer className={styles.footer}>
        <h4>Euphoria.</h4>
      </footer>
    </div>
  );
}
