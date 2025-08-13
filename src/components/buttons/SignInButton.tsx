"use client";

import styles from "@/styles/components/buttons.module.css";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { api, useAuthStore } from "@/store/authStore";
import { morphHolesky } from "viem/chains";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

export const SignInButton = () => {
  const [preparingMessage, setPreparingMessage] = useState(false);
  const [messageToSign, setMessageToSign] = useState("");

  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { signIn, isLoading, error } = useAuthStore();
  useEffect(() => {
    createSiweMessage();
  }, [address]);

  const scheme = window.location.protocol.slice(0, -1);
  const domain = window.location.host;
  const origin = window.location.origin;

  const createSiweMessage = async () => {
    setPreparingMessage(true);
    const res = await api.get(`/auth/getNonce`);
    const nonce = res.data.nonce;
    console.log(nonce);
    const message = new SiweMessage({
      scheme,
      domain,
      address,
      statement: "Sign in to Euphoria",
      uri: origin,
      version: "1",
      chainId: morphHolesky.id,
      nonce,
    });

    setMessageToSign(message.prepareMessage());
    setPreparingMessage(false);
  };

  const onSubmitHandler = async () => {
    const message = messageToSign;
    const signature = await signMessageAsync({ message: messageToSign });

    console.log(message, signature);

    try {
      await signIn(message, signature);
    } catch (err) {
      if (error && error.length > 1) toast.error(error);
    }
  };

  return (
    <button className={styles.signInButton} onClick={() => onSubmitHandler()}>
      {isLoading ? <Loader /> : "Sign In"}
    </button>
  );
};
