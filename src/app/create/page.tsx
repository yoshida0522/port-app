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

export default function Page() {
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

  function handleClick(e: { preventDefault: () => void }) {
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
      return; // データがない場合は処理を終了
    }

    Promise.all(
      filteredDays.map((day) => {
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

        //
        //
        // メッセージ送信
        fetch("/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user, // ユーザーのLINE ID
            message: "こんにちは！これはテストです",
          }),
        });

        const express = require("express");
        const axios = require("axios");
        const app = express();
        app.use(express.json());

        const CHANNEL_ACCESS_TOKEN =
          "FAxhlZyOgWCI4WUZg1GrXjDwvsJCVWyJP1NJG8ywQXt9GeDvwE2KMHoPqU1mkkpxDvHpJS9e5GwdSed8ylLDbZ/rZnBLDWJd6yY2mxhwODoP/8w1EyYFM5w7GasQkXtgd9j17PWApIIK/V1ikwaGMAdB04t89/1O/w1cDnyilFU=";

        app.post(
          "/send-message",
          (
            req: { body: { user: any; message: any } },
            res: {
              send: (arg0: string) => void;
              status: (arg0: number) => {
                (): any;
                new (): any;
                send: { (arg0: string): void; new (): any };
              };
            }
          ) => {
            const { user, message } = req.body;

            // Messaging APIを使ってユーザーにメッセージを送る
            axios
              .post(
                "https://api.line.me/v2/bot/message/push",
                {
                  to: user,
                  messages: [
                    {
                      type: "text",
                      text: message,
                    },
                  ],
                },
                {
                  headers: {
                    Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                }
              )
              .then(() => {
                res.send("メッセージが送信されました");
              })
              .catch((error: any) => {
                console.error("メッセージ送信に失敗しました", error);
                res.status(500).send("メッセージ送信に失敗しました");
              });
          }
        );

        app.listen(3000, () => {
          console.log("Server is running on port 3000");
        });
        //
        //
        // メッセージ送信が終わったらthanksへ遷移
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
