"use client";

import React from "react";
import styles from "../styles/page.module.css";

function Page() {
  return (
    <div className={styles.thanks}>
      <h1>送信完了しました!</h1>
      <div>
        <p>
          ご予約内容はLINE公式アカウントの
          <br />
          予約確認からご確認できます。
        </p>
      </div>
    </div>
  );
}

export default Page;
