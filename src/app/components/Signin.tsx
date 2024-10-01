"use client";

import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import db, { auth } from "../firebase";
import styles from "../styles/page.module.css";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  pass: string;
  manager: boolean;
}

function Signin() {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [posts, setPosts] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isManegerIn, setIsManegerIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      const userData = collection(db, "user");
      const querySnapshot = await getDocs(userData);

      const usersArray = querySnapshot.docs.map((doc) => {
        const data = doc.data() as User;
        return { ...data, id: doc.id };
      });
      console.log(usersArray);
      setPosts(usersArray);
    };
    fetchData();
    const savedUser = localStorage.getItem("loggedInUser");
    const isManager = localStorage.getItem("isManagerIn");
    if (savedUser) {
      setIsLoggedIn(true);
      if (isManager === "true") {
        setIsManegerIn(true);
      } else {
        setIsManegerIn(false);
      }
    }
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  const handleClick = () => {
    setErrorMessage(null); // エラーメッセージをリセット
    if (!user || !pass) {
      setErrorMessage("ユーザー名とパスワードを入力してください");
      return; // 入力が不十分な場合は処理を中断
    }

    const foundUser = posts.find(
      (post) => post.name === user && post.pass === pass
    );

    if (foundUser) {
      console.log("ログイン成功");
      setIsLoggedIn(true);
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

      // `manager`がtrueであれば管理者としてログイン
      if (foundUser.manager) {
        console.log("管理者がログインしました");
        setIsManegerIn(true);
        localStorage.setItem("isManagerIn", "true"); // 管理者フラグを保存
      } else {
        setIsManegerIn(false);
        localStorage.setItem("isManagerIn", "false"); // 一般ユーザーフラグを保存
      }
    } else {
      setErrorMessage("ユーザー名またはパスワードが違います");
    }

    setUser("");
    setPass("");
  };

  const handleSignoutClick = async () => {
    await auth.signOut();
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isManagerIn"); // 管理者フラグを削除
    setIsLoggedIn(false);
    setIsManegerIn(false);
    console.log("ログアウトしました");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {isLoggedIn ? (
        <form className={styles.allButton} onSubmit={handleSubmit}>
          <div>
            <button className={styles.reservationButton}>
              <Link href="reservation/" className={styles.link}>
                予約一覧
              </Link>
            </button>
          </div>
          {isManegerIn ? (
            <div className={styles.managerMenu}>
              <button className={styles.newRegistration}>
                <Link href="newRegistration/" className={styles.link}>
                  新規登録
                </Link>
              </button>
              <button className={styles.newRegistration}>
                <Link href="managerMenu/" className={styles.link}>
                  ID管理
                </Link>
              </button>
            </div>
          ) : null}
          <div>
            <button className={styles.signout} onClick={handleSignoutClick}>
              サインアウト
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <h2 className={styles.rogButton}>ログイン画面</h2>
            <form>
              <div className={styles.formGroup}>
                <label className={styles.label}>ユーザーID</label>
                <input
                  className={styles.input}
                  // className="inputBox"
                  value={user}
                  placeholder="ユーザーIDを入力してください"
                  onChange={(e) => setUser(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>パスワード</label>
                <input
                  className={styles.input}
                  // className="inputBox"
                  value={pass}
                  placeholder="パスワードを入力してください"
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
              </div>
              <div className={styles.signin}>
                <Button className={styles.signinButton} onClick={handleClick}>
                  サインイン
                </Button>
              </div>
              {/* <Link href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2006394583&redirect_uri=https://port-app-yoshida0522s-projects.vercel.app/create&state=uuidv4&scope=profile%20openid">
                LINEでログイン
              </Link> */}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Signin;
