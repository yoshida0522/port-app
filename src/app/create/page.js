"use client";

import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase.js";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Start } from "@mui/icons-material";

export default function Page() {
  const [childName, setChildName] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [monday, setMonday] = useState({
    date: "",
    startTime: "",
    endTime: "",
    remark: "",
  });
  // const [mondayStartTime, setMondayStartTime] = useState("");
  // const [mondayEndTime, setMondayEndTime] = useState("");
  const [tuesday, setTuesday] = useState({
    date: "",
    startTime: "",
    endTime: "",
    remark: "",
  });
  // const [tuesdayStartTime, setTuesdayStartTime] = useState("");
  // const [tuesdayEndTime, setTuesdayEndTime] = useState("");
  const [wednesday, setWednesday] = useState({
    date: "",
    startTime: "",
    endTime: "",
    remark: "",
  });
  // const [wednesdayStartTime, setWednesdayStartTime] = useState("");
  // const [wednesdayEndTime, setWednesdayEndTime] = useState("");
  const [thursday, setThursday] = useState({
    date: "",
    startTime: "",
    endTime: "",
    remark: "",
  });
  // const [thursdayStartTime, setThursdayStartTime] = useState("");
  // const [thursdayEndTime, setThursdayEndTime] = useState("");
  const [friday, setFriday] = useState({
    date: "",
    startTime: "",
    endTime: "",
    remark: "",
  });
  // const [fridayStartTime, setFridayStartTime] = useState("");
  // const [fridayEndTime, setFridayEndTime] = useState("");
  // const [saturday, setSaturday] = useState("");

  function handleClick(e) {
    e.preventDefault();

    const days = [
      { name: childName, ...monday },
      { name: childName, ...tuesday },
      { name: childName, ...wednesday },
      { name: childName, ...thursday },
      { name: childName, ...friday },
    ];

    addDoc(collection(db, "posts"), {
      days: days,
      // day1: monday,
      // start1: mondayStartTime,
      // end1: mondayEndTime,

      // day2: tuesday,
      // start2: tuesdayStartTime,
      // end2: tuesdayEndTime,

      // day3: wednesday,
      // start3: wednesdayStartTime,
      // end3: wednesdayEndTime,

      // day4: thursday,
      // start4: thursdayStartTime,
      // end4: thursdayEndTime,

      // day5: friday,
      // start5: fridayStartTime,
      // end5: fridayEndTime,
      // day6: saturday,
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
          type="date"
          onChange={(e) => setMonday({ ...monday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            onChange={(e) =>
              setMonday({ ...monday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>退園時間</strong>
          <input
            type="time"
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
        <input
          type="date"
          onChange={(e) => setTuesday({ ...tuesday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            onChange={(e) =>
              setTuesday({ ...tuesday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>退園時間</strong>
          <input
            type="time"
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
        <input
          type="date"
          onChange={(e) => setWednesday({ ...wednesday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            onChange={(e) =>
              setWednesday({ ...wednesday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>退園時間</strong>
          <input
            type="time"
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
        <input
          type="date"
          onChange={(e) => setThursday({ ...thursday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            onChange={(e) =>
              setThursday({ ...thursday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>退園時間</strong>
          <input
            type="time"
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
        <input
          type="date"
          onChange={(e) => setFriday({ ...friday, date: e.target.value })}
        ></input>
        <p>
          <strong>登園時間</strong>
          <input
            type="time"
            onChange={(e) =>
              setFriday({ ...friday, startTime: e.target.value })
            }
          ></input>
        </p>
        <p>
          <strong>退園時間</strong>
          <input
            type="time"
            onChange={(e) => setFriday({ ...friday, endTime: e.target.value })}
          ></input>
        </p>
        <p>
          <strong>備考</strong>
          <input
            onChange={(e) => setFriday({ ...friday, remark: e.target.value })}
          ></input>
        </p>
        {/* <p>申し込み6</p>
        <input
          type="datetime-local"
          onChange={(e) => setSaturday(e.target.value)}
        ></input> */}
        {/* <p>備考欄</p>
        <input onChange={(e) => setRemarkText(e.target.value)}></input> */}
        <button onClick={handleClick}>送信</button>
      </form>
    </div>
  );
}
