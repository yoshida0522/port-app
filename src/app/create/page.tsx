"use client";

import React from "react";
import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";

async function sendLineMessage(childName: string, days: any[], userId: string) {
  console.log("LINEメッセージ送信開始: ", { childName, days, userId });
  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ childName, days, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      // console.log("Response status:", response.status);
      // console.log("Response body:", data); // APIが返すエラーを表示
      throw new Error(data.error || "メッセージ送信に失敗しました");
    }

    console.log("LINEメッセージ送信成功:", data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    console.error("LINEメッセージ送信失敗:", errorMessage);
    throw error;
  }
}

export default function Page() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [childName, setChildName] = useState("");
  const [monday, setMonday] = useState({
    date: "",
    startTime: "",
    endTime: "14:00",
    remark: "",
  });
  const [tuesday, setTuesday] = useState({
    date: "",
    startTime: "",
    endTime: "14:00",
    remark: "",
  });
  const [wednesday, setWednesday] = useState({
    date: "",
    startTime: "",
    endTime: "14:00",
    remark: "",
  });
  const [thursday, setThursday] = useState({
    date: "",
    startTime: "",
    endTime: "14:00",
    remark: "",
  });
  const [friday, setFriday] = useState({
    date: "",
    startTime: "",
    endTime: "14:00",
    remark: "",
  });

  useEffect(() => {
    fetch("/api/getUserId")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch userId");
        }
        return response.json();
      })
      .then((data) => {
        // ここでuserIdをログに表示
        console.log("Fetched userId:", data.userId);
        setUserId(data.userId);
      })
      .catch((error) => {
        console.error("Error fetching userId:", error);
      });
  }, []);

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
      .then(async () => {
        console.log("すべてのデータがFirestoreに保存されました");
        // Firestoreに保存した後、LINEにメッセージを送信
        await sendLineMessage(childName, days, userId);
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
        <h1>預かり保育申し込み</h1>
        <p>園児名</p>
        <input
          placeholder="園児名を入力してください"
          onChange={(e) => setChildName(e.target.value)}
        ></input>
        <p>申し込み1</p>
        <strong>日にち</strong>
        <input
          type="date"
          onChange={(e) => setMonday({ ...monday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            defaultValue={"11:00"}
            onChange={(e) =>
              setMonday({ ...monday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>お迎え時間</strong>
          <input
            type="time"
            defaultValue={"14:00"}
            onChange={(e) => setMonday({ ...monday, endTime: e.target.value })}
          ></input>
        </p>
        <p>
          <strong>備考</strong>
          <input
            onChange={(e) => setMonday({ ...monday, remark: e.target.value })}
          ></input>
        </p>
        <p>申し込み2</p>
        <strong>日にち</strong>
        <input
          type="date"
          onChange={(e) => setTuesday({ ...tuesday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            defaultValue={"11:00"}
            onChange={(e) =>
              setTuesday({ ...tuesday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>お迎え時間</strong>
          <input
            type="time"
            defaultValue={"14:00"}
            onChange={(e) =>
              setTuesday({ ...tuesday, endTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>備考</strong>
          <input
            onChange={(e) => setTuesday({ ...tuesday, remark: e.target.value })}
          ></input>
        </p>
        <p>申し込み3</p>
        <strong>日にち</strong>
        <input
          type="date"
          onChange={(e) => setWednesday({ ...wednesday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            defaultValue={"11:00"}
            onChange={(e) =>
              setWednesday({ ...wednesday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>お迎え時間</strong>
          <input
            type="time"
            defaultValue={"14:00"}
            onChange={(e) =>
              setWednesday({ ...wednesday, endTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>備考</strong>
          <input
            onChange={(e) =>
              setWednesday({ ...wednesday, remark: e.target.value })
            }
          ></input>
        </p>
        <p>申し込み4</p>
        <strong>日にち</strong>
        <input
          type="date"
          onChange={(e) => setThursday({ ...thursday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            defaultValue={"11:00"}
            onChange={(e) =>
              setThursday({ ...thursday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>お迎え時間</strong>
          <input
            type="time"
            defaultValue={"14:00"}
            onChange={(e) =>
              setThursday({ ...thursday, endTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>備考</strong>
          <input
            onChange={(e) =>
              setThursday({ ...thursday, remark: e.target.value })
            }
          ></input>
        </p>
        <p>申し込み5</p>
        <strong>日にち</strong>
        <input
          type="date"
          onChange={(e) => setFriday({ ...friday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            defaultValue={"11:00"}
            onChange={(e) =>
              setFriday({ ...friday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>お迎え時間</strong>
          <input
            type="time"
            defaultValue={"14:00"}
            onChange={(e) => setFriday({ ...friday, endTime: e.target.value })}
          ></input>
        </p>
        <p>
          <strong>備考</strong>
          <input
            onChange={(e) => setFriday({ ...friday, remark: e.target.value })}
          ></input>
        </p>

        <button type="submit">送信</button>
      </form>
    </div>
  );
}
