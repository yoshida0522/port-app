"use client";

import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";
import liff from "@line/liff";
import axios from "axios";
import CreateForm from "../components/CreateForm/CreateForm";

export default function CreatePage() {
  const router = useRouter();
  const [childName, setChildName] = useState("");
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childClass, setChildClass] = useState("");

  const [monday, setMonday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
    delete: false,
  });
  const [tuesday, setTuesday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
    delete: false,
  });
  const [wednesday, setWednesday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
    delete: false,
  });
  const [thursday, setThursday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
    delete: false,
  });
  const [friday, setFriday] = useState({
    date: "",
    startTime: "14:00",
    endTime: "14:00",
    remark: "",
    delete: false,
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
          setMonday((prev) => ({
            ...prev,
            [field]: value,
          }));
          break;
        case "tuesday":
          setTuesday((prev) => ({
            ...prev,
            [field]: value,
          }));
          break;
        case "wednesday":
          setWednesday((prev) => ({
            ...prev,
            [field]: value,
          }));
          break;
        case "thursday":
          setThursday((prev) => ({
            ...prev,
            [field]: value,
          }));
          break;
        case "friday":
          setFriday((prev) => ({
            ...prev,
            [field]: value,
          }));
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
        class: childClass,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...monday,
      },
      {
        id: uuidv4(),
        name: childName,
        class: childClass,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...tuesday,
      },
      {
        id: uuidv4(),
        name: childName,
        class: childClass,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...wednesday,
      },
      {
        id: uuidv4(),
        name: childName,
        class: childClass,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...thursday,
      },
      {
        id: uuidv4(),
        name: childName,
        class: childClass,
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

    // バリデーションチェック: endTimeがstartTimeよりも前の場合
    for (const day of filteredDays) {
      if (day.endTime <= day.startTime) {
        alert(
          `日にち ${day.date} のお迎え時間は延長開始時間以降に設定してください`
        );
        setIsSubmitting(false);
        return;
      }
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
          message += `延長開始時間 ${day.startTime}:\n`;
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
        />
        <div>
          <p className={styles.classTitle}>クラス</p>
          <select
            name="selectedClass"
            className={styles.classInput}
            onChange={(e) => setChildClass(e.target.value)}
          >
            <option value="ばら">ばら</option>
            <option value="すみれ">すみれ</option>
            <option value="ひまわり">ひまわり</option>
            <option value="未就園児">未就園児</option>
            <option value="小学生">小学生</option>
          </select>
        </div>
        <div className={styles.applicationContainer}>
          {[
            { day: "monday", title: "希望日1" },
            { day: "tuesday", title: "希望日2" },
            { day: "wednesday", title: "希望日3" },
            { day: "thursday", title: "希望日4" },
            { day: "friday", title: "希望日5" },
          ].map(({ day }, index) => (
            <CreateForm
              key={index}
              day={day}
              index={index}
              onChange={handleChange}
            />
          ))}
        </div>
        <button type="submit" className={styles.submitButton}>
          {isSubmitting ? "送信中..." : "送信"}
        </button>
      </form>
    </div>
  );
}
