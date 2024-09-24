"use client";

import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

async function sendLineMessage(childName: string, days: any[]) {
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineEndpoint = "https://api.line.me/v2/bot/message/push";

  const message = days
    .map((day) => {
      return `【園児名】${day.name}\n【日にち】${day.date}\n【登園時間】${day.startTime}\n【お迎え時間】${day.endTime}\n【備考】${day.remark}\n`;
    })
    .join("\n");

  const payload = {
    to: "RECIPIENT_USER_ID", // LINEのユーザーID
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  await fetch(lineEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lineToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export default function Page() {
  const router = useRouter();
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

  function handleClick(e: { preventDefault: () => void }) {
    e.preventDefault();

    //   const days1 = [
    //     {
    //       id: uuidv4(),
    //       name: childName,
    //       realStartTime: "",
    //       realEndTime: "",
    //       ...monday,
    //     },
    //   ];

    //   const days2 = [
    //     {
    //       id: uuidv4(),
    //       name: childName,
    //       realStartTime: "",
    //       realEndTime: "",
    //       ...tuesday,
    //     },
    //   ];
    //   const days3 = [
    //     {
    //       id: uuidv4(),
    //       name: childName,
    //       realStartTime: "",
    //       realEndTime: "",
    //       ...wednesday,
    //     },
    //   ];
    //   const days4 = [
    //     {
    //       id: uuidv4(),
    //       name: childName,
    //       realStartTime: "",
    //       realEndTime: "",
    //       ...thursday,
    //     },
    //   ];
    //   const days5 = [
    //     {
    //       id: uuidv4(),
    //       name: childName,
    //       realStartTime: "",
    //       realEndTime: "",
    //       ...friday,
    //     },
    //   ];

    //   addDoc(collection(db, "posts"), {
    //     days: days1,
    //     firstDate: days1[0].date,
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   });
    //   addDoc(collection(db, "posts"), {
    //     days: days2,
    //     firstDate: days2[0].date,
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   });
    //   addDoc(collection(db, "posts"), {
    //     days: days3,
    //     firstDate: days3[0].date,
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   });
    //   addDoc(collection(db, "posts"), {
    //     days: days4,
    //     firstDate: days4[0].date,
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   });
    //   addDoc(collection(db, "posts"), {
    //     days: days5,
    //     firstDate: days5[0].date,
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   });

    //   router.push("/thanks");
    // }

    const days = [
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        ...monday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        ...tuesday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        ...wednesday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        ...thursday,
      },
      {
        id: uuidv4(),
        name: childName,
        realStartTime: "",
        realEndTime: "",
        ...friday,
      },
    ];

    Promise.all(
      days.map((day) => {
        return addDoc(collection(db, "posts"), {
          days: [day],
          firstDate: day.date,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
    )
      .then(() => {
        // Firestoreに保存した後、LINEにメッセージを送信
        sendLineMessage(childName, days);
        router.push("/thanks");
      })
      .catch((error) => {
        console.error("データ保存エラー:", error);
      });
  }

  return (
    <div className="createCenter">
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
        <strong>日にち</strong>
        <input
          type="date"
          onChange={(e) => setMonday({ ...monday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            // defaultValue={"11:00"}
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
            // defaultValue={"11:00"}
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
            // defaultValue={"11:00"}
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
            // defaultValue={"11:00"}
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
            // defaultValue={"11:00"}
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

        <button onClick={handleClick}>送信</button>
      </form>
    </div>
  );
}
