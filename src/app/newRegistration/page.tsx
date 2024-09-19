"use client";

import { Button } from "@mui/material";
import React, { useState } from "react";
import db from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../globals.css";

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
      <div>
        <div className="center">
          <h3>ユーザーID</h3>
        </div>
        <div className="center">
          <input
            className="inputBox"
            value={userName}
            placeholder="ユーザーIDを入力してください"
            onChange={(e) => setUserName(e.target.value)}
          ></input>
        </div>
        <div className="passTitle">
          <h3>パスワード</h3>
          <p>※半角英数字</p>
        </div>
        <div className="center">
          <input
            className="inputBox"
            value={passWord}
            pattern="[a-zA-Z0-9]*"
            title="半角英数字で入力してください"
            placeholder="パスワードを入力してください"
            onChange={(e) => {
              const inputValue = e.target.value;
              const validValue = inputValue.replace(/[^a-zA-Z0-9]/g, "");
              setPassWord(validValue);
            }}
          ></input>
        </div>
        <div className="center">
          <Button onClick={handleClick}>登録</Button>
        </div>
        <div>
          <Link href="/" className="backButton">
            戻る
          </Link>
        </div>
      </div>
    </>
  );
}

export default Page;
