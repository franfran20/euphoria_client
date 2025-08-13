"use client";

import { useAuthStore } from "@/store/authStore";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect } from "react";

export const CheckAuth = ({ children }: { children: ReactNode }) => {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const { ready } = usePrivy();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!ready || isCheckingAuth)
    return (
      <div className="loaderContainer">
        <Loader2 className="loaderIcon" />
      </div>
    );

  return <>{children}</>;
};
