"use client";

import React from "react";
import "../globals.css";
import Link from "next/link";
import Signin from "./Signin";

const Main = () => {
  return (
    <form>
      <div className="reservationButton">
        <button className="L-button">
          <Link href="reservation/" className="link">
            予約一覧
          </Link>
        </button>
        <Signin />
      </div>
    </form>
  );
};

export default Main;
