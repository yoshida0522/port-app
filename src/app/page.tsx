"use client";

import Edit from "./conponents/Edit";
import List from "./conponents/List";
import Signin from "./conponents/Signin";
import "./globals.css";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.js";

export default function Home() {
  const [user] = useAuthState(auth);
  // const handleRightClick = () => {
  //   console.log("RボタンOK!");
  // };

  return (
    <main className="main">
      <h1 className="mainTitle">預かり保育予約管理システム</h1>
      <div>
        {user ? <List /> : <Signin />}
        {/* 予約申し込み画面 ※ボタンは後で削除する */}
        <button>
          <Link href="create/">予約申し込み</Link>
        </button>
        {/* <div className="row-button">
        <Edit />
        <button className="R-button" onClick={handleRightClick}>
            <Link href="edit/" className="link">
              編集
            </Link>
          </button>
        </div> */}
      </div>
    </main>
  );
}
