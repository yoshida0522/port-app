"use client";

import React from "react";
import "../globals.css";

const List = () => {
  const handleClick = () => {
    console.log("OK!");
  };
  return (
    <form>
      <button className="L-button" onClick={handleClick}>
        予約一覧
      </button>
    </form>
  );
};

export default List;
