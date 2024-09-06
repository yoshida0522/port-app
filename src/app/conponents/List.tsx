"use client";

import React from "react";
import "../globals.css";
import Link from "next/link";
import Signout from "./Signout";

const List = () => {
  const handleLeftClick = () => {
    console.log("予約一覧ボタンOK!");
  };

  return (
    <form>
      <div className="reservationButton">
        <button className="L-button" onClick={handleLeftClick}>
          <Link href="reservation/" className="link">
            予約一覧
          </Link>
        </button>
        <Signout />
      </div>
    </form>
  );
};

export default List;
