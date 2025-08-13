"use client";

import styles from "@/styles/components/requestSignIn.module.css";
import { LucideCircleArrowOutDownRight } from "lucide-react";

export const RequestSignIn = () => {
  return (
    <div className={styles.requestSignIn}>
      <LucideCircleArrowOutDownRight className={styles.signInIcon} />
      <h3>Please Sign In</h3>
      <p>
        To continue to view this page content, you must be signed in. You can
        sign in through the navigation bar.
      </p>
    </div>
  );
};
