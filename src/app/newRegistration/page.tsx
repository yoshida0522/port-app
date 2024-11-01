"use client";

import React, { useState } from "react";
import db from "../../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/page.module.css";

const NewRegistration = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [errors, setErrors] = useState({
    userName: "",
    passWord: "",
  });

  const validateUserName = (name: string) => {
    if (name.length < 1) {
      return "※ユーザーIDを入力してください";
    }
    return "";
  };

  const validatePassWord = (pass: string) => {
    if (pass.length < 1) {
      return "※パスワードを入力してください";
    }
    return "";
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const userNameError = validateUserName(userName);
    const passWordError = validatePassWord(passWord);

    if (userNameError || passWordError) {
      setErrors({
        userName: userNameError,
        passWord: passWordError,
      });
      return; // エラーがある場合は保存しない
    }

    try {
      const userData = await addDoc(collection(db, "user"), {
        name: userName,
        pass: passWord,
        manager: false,
        delete: false,
      });
      console.log(userData);

      // 正常に保存された場合はフィールドをクリア
      setUserName("");
      setPassWord("");
      setErrors({ userName: "", passWord: "" });
      router.push("/");
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
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
            onChange={(e) => {
              setUserName(e.target.value);
              setErrors((prev) => ({
                ...prev,
                userName: validateUserName(e.target.value),
              }));
            }}
          />
          {errors.userName && (
            <p className={styles.errorText}>{errors.userName}</p>
          )}
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
              setErrors((prev) => ({
                ...prev,
                passWord: validatePassWord(validValue),
              }));
            }}
          />
          {errors.passWord && (
            <p className={styles.errorText}>{errors.passWord}</p>
          )}
        </div>
        <button className={styles.buttonText} onClick={handleClick}>
          登録
        </button>
        <div>
          <Link href="/">
            <button className={styles.backButton}>戻る</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NewRegistration;
