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
import liff from "@line/liff";
import axios from "axios";

export default function CreatePage() {
  const router = useRouter();
  const [childName, setChildName] = useState("");
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [monday, setMonday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
  });
  const [tuesday, setTuesday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
  });
  const [wednesday, setWednesday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
  });
  const [thursday, setThursday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
  });
  const [friday, setFriday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
  });

  useEffect(() => {
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string })
      .then(() => {
        console.log("LIFFの初期化に成功しました");
        if (liff.isLoggedIn()) {
          const token = liff.getIDToken();
          setIdToken(token);
        } else {
          liff.login();
        }
      })
      .catch((e: Error) => {
        console.error("LIFFの初期化に失敗しました", e);
        setIdToken("");
      });

    liff.ready.then(async () => {
      const userProfile = await liff.getProfile();
      setUser(userProfile.userId);
    });
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userId", user);
    }
  }, [user]);

  if (idToken === null) {
    return <div>Loading...</div>;
  }

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

  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    const days = [
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...monday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...tuesday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...wednesday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...thursday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...friday,
      },
    ];

    const filteredDays = days.filter(
      (day) => day.date && day.date.trim() !== ""
    );

    if (filteredDays.length === 0) {
      console.log("保存するデータがありません");
      setIsSubmitting(false);
      return;
    }

    try {
      await Promise.all(
        filteredDays.map((day) => {
          return addDoc(collection(db, "posts"), {
            days: [day],
            firstDate: day.date,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        })
      );

      console.log("すべてのデータがFirestoreに保存されました");
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }

    try {
      let message = `${days[0].name}さんの予約を\n以下の内容で受け付けました:\n\n`;

      days.forEach((day) => {
        if (day.date && day.date.trim() !== "") {
          message += `日にち ${day.date}:\n`;
          message += `預かり開始時間 ${day.startTime}:\n`;
          message += `お迎え時間 ${day.endTime}:\n`;
          message += `備考 ${day.remark}:\n\n`;
        }
      });

      const response = await axios.post("/api/linebot", {
        userId: user,
        message: message,
      });

      if (response.status === 200) {
        console.log("LINEに通知が成功しました:", response.data);
      } else {
        console.error(
          "LINEへの通知に失敗しました:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("LINEへの通知エラー:", error);
    }

    console.log("メッセージの送信が完了しました");
    router.push("/thanks");
  };

  return (
    <div className={styles.createCenter}>
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
          ].map(({ day }, index) => (
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
                <strong className={styles.createStrong}>延長開始時間</strong>
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
          {isSubmitting ? "送信中..." : "送信"}
        </button>
      </form>
    </div>
  );
}
