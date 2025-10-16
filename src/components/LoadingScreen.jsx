import React from "react";
import styles from "./LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loader}></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingScreen;
