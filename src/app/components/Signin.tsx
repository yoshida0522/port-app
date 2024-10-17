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
    setErrorMessage(null);
    if (!user || !pass) {
      setErrorMessage("ユーザー名とパスワードを入力してください");
      return;
    }

    const foundUser = posts.find(
      (post) => post.name === user && post.pass === pass
    );

    if (foundUser) {
      console.log("ログイン成功");
      setIsLoggedIn(true);
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

      if (foundUser.manager) {
        setIsManegerIn(true);
        localStorage.setItem("isManagerIn", "true");
      } else {
        setIsManegerIn(false);
        localStorage.setItem("isManagerIn", "false");
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
    localStorage.removeItem("isManagerIn");
    setIsLoggedIn(false);
    setIsManegerIn(false);
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
            <Link href="reservation/" className={styles.link}>
              <button className={styles.reservationButton}> 予約一覧</button>
            </Link>
          </div>
          {isManegerIn ? (
            <div className={styles.managerMenu}>
              <Link href="newRegistration/" className={styles.link}>
                <button className={styles.newRegistration}>新規登録</button>
              </Link>
              <Link href="managerMenu/" className={styles.link}>
                <button className={styles.newRegistration}> ID管理</button>
              </Link>
            </div>
          ) : null}
          <div>
            <button className={styles.signout} onClick={handleSignoutClick}>
              サインアウト
            </button>
          </div>
        </form>
      ) : (
        // <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2 className={styles.rogButton}>ログイン画面</h2>
          <form>
            <div className={styles.formGroup}>
              <label className={styles.label}>ユーザーID</label>
              <input
                className={styles.input}
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
          </form>
        </div>
        // </div>
      )}
    </>
  );
}

export default Signin;
