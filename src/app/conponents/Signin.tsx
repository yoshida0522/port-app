import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import db, { auth } from "../firebase";
import "../globals.css";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  pass: string;
}

function Signin() {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [posts, setPosts] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isManegerIn, setIsManegerIn] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };
  useEffect(() => {
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
    if (savedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleClick = () => {
    if (!user || !pass) {
      console.log("ユーザー名とパスワードを入力してください");
      return; // 入力が不十分な場合は処理を中断
    }

    const manager = posts.find(
      (postmaneger) =>
        postmaneger.name === "demo" && postmaneger.pass === "1234"
    );

    if (manager && user === "demo" && pass === "1234") {
      // 管理者が見つかり、入力された情報も一致した場合
      console.log("管理者がログインしました");
      setIsManegerIn(true);
      setIsLoggedIn(true);
      localStorage.setItem("loggedInUser", JSON.stringify(manager));
    } else {
      // 管理者でない場合、一般ユーザーをチェック
      const foundUser = posts.find(
        (post) => post.name === user && post.pass === pass
      );

      if (foundUser) {
        console.log("ログイン成功");
        setIsLoggedIn(true);
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
        setIsManegerIn(false); // 一般ユーザーの場合、管理者フラグをリセット
      } else {
        console.log("ユーザー名またはパスワードが違います");
      }
    }

    setUser("");
    setPass("");
  };

  const handleSignoutClick = async () => {
    await auth.signOut();
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setIsManegerIn(false);
    console.log("ログアウトしました");
  };

  return (
    <>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div className="reservationButton">
            <button className="L-button">
              <Link href="reservation/" className="link">
                予約一覧
              </Link>
            </button>
          </div>
          <div className="signout">
            <button onClick={handleSignoutClick}>サインアウト</button>
          </div>
          {isManegerIn ? (
            <div className="center">
              <Link href="newRegistration/">新規登録</Link>
            </div>
          ) : null}
        </form>
      ) : (
        <div className="rogButton">
          <div>
            <input
              className="inputBox"
              value={user}
              placeholder="ユーザーIDを入力してください"
              onChange={(e) => setUser(e.target.value)}
            ></input>
          </div>
          <div>
            <input
              className="inputBox"
              value={pass}
              placeholder="パスワードを入力してください"
              onChange={(e) => setPass(e.target.value)}
            ></input>
          </div>
          <div>
            <Button onClick={handleClick}>ログイン</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Signin;
