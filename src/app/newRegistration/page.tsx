"use client";

import { Button } from "@mui/material";
import React, { useState } from "react";
import db from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/page.module.css";

function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const userData = await addDoc(collection(db, "user"), {
      name: userName,
      pass: passWord,
    });
    console.log(userData);
    setUserName("");
    setPassWord("");
    router.push("/");
  };

  return (
    <>
      <div className={styles.titleform}>
        <div>
          <h1 className={styles.maintext}>新規登録</h1>
        </div>
        <div>
          <h3 className={styles.titletext}>ユーザーID</h3>
        </div>
        <div className={styles.inputcenter}>
          <input
            className={styles.inputBox}
            value={userName}
            placeholder="ユーザーIDを入力してください"
            onChange={(e) => setUserName(e.target.value)}
          ></input>
        </div>
        <div className={styles.passTitle}>
          <h3 className={styles.passWordtitle}>パスワード</h3>
          <p className={styles.text}>※半角英数字</p>
        </div>

        <div className={styles.inputcenter}>
          <input
            className={styles.inputBox}
            value={passWord}
            pattern="[a-zA-Z0-9]*"
            placeholder="パスワードを入力してください"
            onChange={(e) => {
              const inputValue = e.target.value;
              const validValue = inputValue.replace(/[^a-zA-Z0-9]/g, "");
              setPassWord(validValue);
            }}
          ></input>
        </div>
        <div className={styles.createcenter}>
          <Button className={styles.buttontext} onClick={handleClick}>
            登録
          </Button>
        </div>
        <div>
          <Link href="/" className={styles.backButton}>
            戻る
          </Link>
        </div>
      </div>
    </>
  );
}

export default Page;
