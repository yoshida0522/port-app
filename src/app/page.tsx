"use client";

import Signin from "./conponents/Signin";
import "./globals.css";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "./firebase";

export default function Home() {
  // const [user] = useAuthState(auth);

  return (
    <main className="main">
      <h1 className="mainTitle">預かり保育予約管理システム</h1>
      <div>
        <Signin />
        {/* {user ? <Main /> : <Signin />} */}
        {/* 予約申し込み画面 ※ボタンは後で削除する */}
        {/* <div className="rogButton">
          <button>
            <Link href="create/">予約申し込み</Link>
          </button>
        </div> */}
        {/* ここまで削除 */}
      </div>
    </main>
  );
}
