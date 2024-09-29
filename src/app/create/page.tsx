"use client";

import React from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [childName, setChildName] = useState("");

  const [monday, setMonday] = useState({
    date: "",
    startTime: "11:00",
    endTime: "14:00",
    remark: "",
  });
  const [tuesday, setTuesday] = useState({
    date: "",
    startTime: "11:00",
    endTime: "14:00",
    remark: "",
  });
  const [wednesday, setWednesday] = useState({
    date: "",
    startTime: "11:00",
    endTime: "14:00",
    remark: "",
  });
  const [thursday, setThursday] = useState({
    date: "",
    startTime: "11:00",
    endTime: "14:00",
    remark: "",
  });
  const [friday, setFriday] = useState({
    date: "",
    startTime: "11:00",
    endTime: "14:00",
    remark: "",
  });

  const handleChange =
    (day: string, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      switch (day) {
        case "monday":
          setMonday((prev) => ({ ...prev, [field]: value }));
          break;
        case "tuesday":
          setTuesday((prev) => ({ ...prev, [field]: value }));
          break;
        case "wednesday":
          setWednesday((prev) => ({ ...prev, [field]: value }));
          break;
        case "thursday":
          setThursday((prev) => ({ ...prev, [field]: value }));
          break;
        case "friday":
          setFriday((prev) => ({ ...prev, [field]: value }));
          break;
        default:
          break;
      }
    };

  function handleClick(e: { preventDefault: () => void }) {
    e.preventDefault();

    const days = [
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: userId,
        ...monday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: userId,
        ...tuesday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: userId,
        ...wednesday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: userId,
        ...thursday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: userId,
        ...friday,
      },
    ];

    Promise.all(
      days.map((day) => {
        return addDoc(collection(db, "posts"), {
          days: [day],
          firstDate: day.date,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(() => {
          console.log("Firestoreにデータ保存成功:", day); // 保存成功時にログ表示
        });
      })
    )
      .then(() => {
        console.log("すべてのデータがFirestoreに保存されました");
        router.push("/thanks");
      })
      .catch((error) => {
        console.error("データ保存エラー:", error);
      });
  }

  return (
    <div className={styles.createCenter}>
      <h3 className={styles.linkTitle}>
        <Link href="/">トップページに戻る</Link>
      </h3>
      <form onSubmit={handleClick}>
        <h1 className={styles.createTitle}>預かり保育申し込み</h1>
        <p className={styles.createChildName}>園児名</p>
        <input
          className={styles.createChildInput}
          placeholder="園児名を入力してください"
          onChange={(e) => setChildName(e.target.value)}
        ></input>
        <div className={styles.applicationContainer}>
          {[
            { day: "monday", title: "申し込み1" },
            { day: "tuesday", title: "申し込み2" },
            { day: "wednesday", title: "申し込み3" },
            { day: "thursday", title: "申し込み4" },
            { day: "friday", title: "申し込み5" },
          ].map(({ day, title }, index) => (
            <div key={index} className={styles.applicationSection}>
              <div className={styles.applicationNumberContainer}>
                <span className={styles.applicationNumber}>申し込み</span>
                <span className={styles.applicationIndex}>{index + 1}</span>
              </div>
              <div className={styles.applicationContent}>
                <strong className={styles.createStrong}>日にち</strong>
                <input
                  className={styles.createInput}
                  type="date"
                  onChange={handleChange(day, "date")}
                />
                <strong className={styles.createStrong}>登園時間</strong>
                <input
                  className={styles.createInput}
                  type="time"
                  defaultValue={"11:00"}
                  onChange={handleChange(day, "startTime")}
                />
                <strong className={styles.createStrong}>お迎え時間</strong>
                <input
                  className={styles.createInput}
                  type="time"
                  defaultValue={"14:00"}
                  onChange={handleChange(day, "endTime")}
                />
                <strong className={styles.createStrong}>備考</strong>
                <input
                  className={styles.createInput}
                  onChange={handleChange(day, "remark")}
                />
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className={styles.submitButton}>
          送信
        </button>
      </form>
    </div>
  );
}
