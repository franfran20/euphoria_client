"use client";

import styles from "@/styles/components/buttons.module.css";
import { api, useAuthStore } from "@/store/authStore";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

export const LogoutButton = () => {
  const { logOut, error, isLoading } = useAuthStore();

  const onLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      if (error && error.length > 1) toast.error(error);
    }
  };

  return (
    <button className={styles.logoutButton} onClick={() => onLogout()}>
      {isLoading ? <Loader /> : "Log out"}
    </button>
  );
};
