"use client";

import Edit from "./conponents/Edit";
import List from "./conponents/List";
import "./globals.css";
import Link from "next/link";

export default function Home() {
  const handleLeftClick = () => {
    console.log("LボタンOK!");
  };

  const handleRightClick = () => {
    console.log("RボタンOK!");
  };

  return (
    <main className="main">
      <h1 className="mainTitle">預かり保育予約管理システム</h1>
      <div>
        <div className="row-button">
          {/* <List />
          <Edit /> */}
          <button className="L-button" onClick={handleLeftClick}>
            <Link href="reservation/" className="link">
              予約一覧
            </Link>
          </button>
          <button className="R-button" onClick={handleRightClick}>
            <Link href="edit/" className="link">
              編集
            </Link>
          </button>
        </div>
      </div>
    </main>
  );
}
