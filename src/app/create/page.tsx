"use client";

// import { collection, addDoc } from "firebase/firestore";
// import db from "../firebase";
import React, { useEffect, useState } from "react";
// import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";
import CreateForm from "../components/CreateForm/CreateForm";
import { useAuthentication } from "../utills/useAuthentication";
import { useHandleChange } from "../utills/useHandleChange";
import { useSendMessage } from "../utills/useSendMessage";
import { Day } from "../type";
import { useHandleClick } from "../utills/useHandleClick";

export default function CreatePage() {
  const router = useRouter();
  const { sendMessage, isSubmitting } = useSendMessage();
  // const [childName, setChildName] = useState("");
  // const [childClass, setChildClass] = useState("");
  const { user, idToken } = useAuthentication();
  const { handleChange } = useHandleChange();
  const {
    handleClick,
    childName,
    setChildName,
    childClass,
    setChildClass,
    days,
  } = useHandleClick(user, idToken);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userId", user);
    }
  }, [user]);

  if (idToken === null) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !idToken) {
      console.error("ユーザー情報が見つかりません");
      return;
    }

    await handleClick(e);

    await sendMessage(user, days as Day[]);

    router.push("/thanks");
  };

  // const handleClick = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();

  //   if (!user || !idToken) {
  //     console.error("ユーザー情報が見つかりません");
  //     return;
  //   }

  // const days = [
  //   {
  //     id: uuidv4(),
  //     name: childName,
  //     class: childClass,
  //     realStartTime: "",
  //     realEndTime: "",
  //     userId: user,
  //     ...firstDay,
  //   },
  //   {
  //     id: uuidv4(),
  //     name: childName,
  //     class: childClass,
  //     realStartTime: "",
  //     realEndTime: "",
  //     userId: user,
  //     ...secondDay,
  //   },
  //   {
  //     id: uuidv4(),
  //     name: childName,
  //     class: childClass,
  //     realStartTime: "",
  //     realEndTime: "",
  //     userId: user,
  //     ...thirdDay,
  //   },
  //   {
  //     id: uuidv4(),
  //     name: childName,
  //     class: childClass,
  //     realStartTime: "",
  //     realEndTime: "",
  //     userId: user,
  //     ...fourthDay,
  //   },
  //   {
  //     id: uuidv4(),
  //     name: childName,
  //     class: childClass,
  //     realStartTime: "",
  //     realEndTime: "",
  //     userId: user,
  //     ...fifthDay,
  //   },
  // ];

  // const filteredDays = days.filter(
  //   (day) => day.date && day.date.trim() !== ""
  // );

  // if (filteredDays.length === 0) {
  //   console.log("保存するデータがありません");
  //   return;
  // }

  // バリデーションチェック: endTimeがstartTimeよりも前の場合
  // for (const day of filteredDays) {
  //   if (day.endTime <= day.startTime) {
  //     alert(
  //       `日にち ${day.date} のお迎え時間は延長開始時間以降に設定してください`
  //     );
  //     return;
  //   }
  // }

  // try {
  //   await Promise.all(
  //     filteredDays.map((day) => {
  //       return addDoc(collection(db, "posts"), {
  //         days: [day],
  //         firstDate: day.date,
  //         timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
  //       });
  //     })
  //   );

  //   console.log("すべてのデータがFirestoreに保存されました");
  // } catch (error) {
  //   console.error("エラーが発生しました:", error);
  // }

  return (
    <div className={styles.createCenter}>
      <form onSubmit={handleSubmit}>
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
            { day: "firstDay", title: "希望日1" },
            { day: "secondDay", title: "希望日2" },
            { day: "thirdDay", title: "希望日3" },
            { day: "fourthDay", title: "希望日4" },
            { day: "fifthDay", title: "希望日5" },
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
