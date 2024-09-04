"use client";

import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase.js";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export default function Page() {
  const [childName, setChildName] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [monday, setMonday] = useState("");
  const [tuesday, setTuesday] = useState("");
  const [wednesday, setWednesday] = useState("");
  const [thursday, setThursday] = useState("");
  const [friday, setFriday] = useState("");
  const [saturday, setSaturday] = useState("");

  function handleClick(e) {
    e.preventDefault();
    addDoc(collection(db, "posts"), {
      name: childName,
      day1: monday,
      day2: tuesday,
      day3: wednesday,
      day4: thursday,
      day5: friday,
      day6: saturday,
      remark: remarkText,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  return (
    <div className="createPage">
      <h3 className="linkTitle">
        <Link href="/">トップページに戻る</Link>
      </h3>
      <form>
        <h1>預かり保育申し込み</h1>
        <p>園児名</p>
        <input
          placeholder="園児名を入力してください"
          onChange={(e) => setChildName(e.target.value)}
        ></input>
        <p>申し込み1</p>
        <input
          type="datetime-local"
          onChange={(e) => setMonday(e.target.value)}
        ></input>
        <p>申し込み2</p>
        <input
          type="datetime-local"
          onChange={(e) => setTuesday(e.target.value)}
        ></input>
        <p>申し込み3</p>
        <input
          type="datetime-local"
          onChange={(e) => setWednesday(e.target.value)}
        ></input>
        <p>申し込み4</p>
        <input
          type="datetime-local"
          onChange={(e) => setThursday(e.target.value)}
        ></input>
        <p>申し込み5</p>
        <input
          type="datetime-local"
          onChange={(e) => setFriday(e.target.value)}
        ></input>
        <p>申し込み6</p>
        <input
          type="datetime-local"
          onChange={(e) => setSaturday(e.target.value)}
        ></input>
        <p>備考欄</p>
        <input onChange={(e) => setRemarkText(e.target.value)}></input>
        <button onClick={handleClick}>送信</button>
      </form>
    </div>
  );
}
