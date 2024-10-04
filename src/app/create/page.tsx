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
import { sendLineMessage } from "../../../sendLineMessage";

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

  if (idToken === null) {
    return <div>Loading...</div>;
  }

  // userIdを保存
  useEffect(() => {
    if (user) {
      localStorage.setItem("userId", user);
    }
  }, [user]);

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
    ).then(() => {
      console.log("すべてのデータがFirestoreに保存されました");

      // メッセージを構築
      const message =
        `園児名: ${childName}\n` +
        filteredDays
          .map(
            (day) =>
              `日付: ${day.date}, 登園時間: ${day.startTime}, お迎え時間: ${day.endTime}, 備考: ${day.remark}`
          )
          .join("\n");

      // メッセージを送信
      // lineWebhook(user, message);
      //   const lineWebhook = async (userId: string, message: string) => {
      //     await sendLineMessage(userId, message);
      //   };
      // })
      // .catch((error) => {
      //   console.error("データ保存エラー:", error);
      // });

      // メッセージ送信処理
      const sendMessageToLINE = async (message: string) => {
        const accessToken =
          "HrdWhF6LCombABpNRZDkV/fsXR+WcotUAhp7rApxZzHh96E+CWYExMJ/NimYKjIIDvHpJS9e5GwdSed8ylLDbZ/rZnBLDWJd6yY2mxhwODrt0x/OUb6XAo8WowMRaTeYShjX3S1CPwlcRcS0oYldRAdB04t89/1O/w1cDnyilFU="; // チャネルアクセストークン
        const url = "https://api.line.me/v2/bot/message/push";
        const body = {
          to: "USER_ID", // 送信先のユーザーID
          messages: [
            {
              type: "text",
              text: message, // 送信するメッセージ
            },
          ],
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };
        await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        });
      };
    });

    // メッセージ送信が終わったらthanksへ遷移
    router.push("/thanks");
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
