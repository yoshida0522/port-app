"use client";

import Signin from "./conponents/Signin";
import "./globals.css";

export default function Home() {
  return (
    <main className="main">
      <h1 className="mainTitle">預かり保育予約管理システム</h1>
      <div>
        <Signin />
      </div>
    </main>
  );
}
