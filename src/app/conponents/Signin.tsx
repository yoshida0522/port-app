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
      localStorage.setItem("isManagerIn", "true"); // 管理者フラグを保存
    } else {
      // 管理者でない場合、一般ユーザーをチェック
      const foundUser = posts.find(
        (post) => post.name === user && post.pass === pass
      );

      if (foundUser) {
        console.log("ログイン成功");
        setIsLoggedIn(true);
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
        localStorage.setItem("isManagerIn", "false"); // 一般ユーザーフラグを保存
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
    localStorage.removeItem("isManagerIn"); // 管理者フラグを削除
    setIsLoggedIn(false);
    setIsManegerIn(false);
    console.log("ログアウトしました");
  };

  return (
    <>
      {isLoggedIn ? (
        <form className="allButton" onSubmit={handleSubmit}>
          <div>
            <button className="reservationButton">
              <Link href="reservation/" className="link">
                予約一覧
              </Link>
            </button>
          </div>
          {isManegerIn ? (
            <div>
              <button className="newRegistration">
                <Link href="newRegistration/" className="link">
                  新規登録
                </Link>
              </button>
            </div>
          ) : null}
          <div>
            <button className="signout" onClick={handleSignoutClick}>
              サインアウト
            </button>
          </div>
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
            <Button onClick={handleClick}>サインイン</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Signin;
