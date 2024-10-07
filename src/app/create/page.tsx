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
import liff from "@line/liff";
import axios from "axios";

export default function CreatePage() {
  const router = useRouter();
  const [childName, setChildName] = useState("");
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState("");

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
      .catch((e: any) => {
        console.error("LIFFの初期化に失敗しました", e);
        setIdToken("");
      });

    liff.ready.then(async () => {
      const userProfile = await liff.getProfile();
      console.log(userProfile);
      setUser(userProfile.userId);
    });
  }, []);

  // userIdを保存
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

  // LINE通知を行う関数
  // const sendLineNotification = async () => {
  //   try {
  //     console.log("ボタンが押されました！");

  //     // LINEで、ボタンが押されたことを通知する
  //     await axios.post("/api/linebot", {
  //       message: "ボタンが押されました！",
  //     });
  //     console.log("LINEメッセージ送信成功");
  //   } catch (error) {
  //     console.error("LINEメッセージ送信エラー:", error);
  //   }
  // };

  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

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

    // dateが空でない曜日データのみフィルタリング
    const filteredDays = days.filter(
      (day) => day.date && day.date.trim() !== ""
    );

    if (filteredDays.length === 0) {
      console.log("保存するデータがありません");
      return;
    }

    try {
      // Firestoreにデータを保存
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

      // LINE通知処理
      // await sendLineNotification();
      await axios.post("/api/linebot", {
        message: "ボタンが押されました！",
      });

      // メッセージ送信が終わったらthanksへ遷移
      router.push("/thanks");
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

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
// function lineWebhook(user: string, message: string) {
//   throw new Error("Function not implemented.");
// }
