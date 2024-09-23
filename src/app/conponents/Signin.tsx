import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
  // function signin() {
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider);
  // }

  const handleClick = () => {
    const foundUser = posts.find(
      (post) => post.name === user && post.pass === pass
    );
    if (foundUser) {
      console.log("ログイン成功");
      setIsLoggedIn(true);
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    } else {
      console.log("ユーザー名またはパスワードが違います");
    }
    setUser("");
    setPass("");
  };

  const handleSignoutClick = async () => {
    await auth.signOut();
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
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
          <div className="center">
            <button onClick={handleSignoutClick}>サインアウト</button>
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
            <Button onClick={handleClick}>ログイン</Button>
          </div>
          <div>
            <Link href="newRegistration/">新規登録</Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Signin;
