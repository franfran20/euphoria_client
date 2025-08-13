import { useLogin } from "@privy-io/react-auth";
import styles from "@/styles/components/buttons.module.css";

export const ConnectButton = () => {
  const { login } = useLogin();

  return (
    <button className={styles.connectButton} onClick={() => login()}>
      Connect Wallet
    </button>
  );
};
