import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import db from "../firebase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useHandleChange } from "./useHandleChange";

export const useHandleClick = (user: string | null, idToken: string | null) => {
  const [childName, setChildName] = useState("");
  const [childClass, setChildClass] = useState("");
  const { firstDay, secondDay, thirdDay, fourthDay, fifthDay } =
    useHandleChange();
  const days = [
    {
      id: uuidv4(),
      name: childName,
      class: childClass,
      realStartTime: "",
      realEndTime: "",
      userId: user,
      ...firstDay,
    },
    {
      id: uuidv4(),
      name: childName,
      class: childClass,
      realStartTime: "",
      realEndTime: "",
      userId: user,
      ...secondDay,
    },
    {
      id: uuidv4(),
      name: childName,
      class: childClass,
      realStartTime: "",
      realEndTime: "",
      userId: user,
      ...thirdDay,
    },
    {
      id: uuidv4(),
      name: childName,
      class: childClass,
      realStartTime: "",
      realEndTime: "",
      userId: user,
      ...fourthDay,
    },
    {
      id: uuidv4(),
      name: childName,
      class: childClass,
      realStartTime: "",
      realEndTime: "",
      userId: user,
      ...fifthDay,
    },
  ];

  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!user || !idToken) {
      console.error("ユーザー情報が見つかりません");
      return;
    }

    const filteredDays = days.filter(
      (day) => day.date && day.date.trim() !== ""
    );

    if (filteredDays.length === 0) {
      console.log("保存するデータがありません");
      return;
    }

    for (const day of filteredDays) {
      if (day.endTime <= day.startTime) {
        alert(
          `日にち ${day.date} のお迎え時間は延長開始時間以降に設定してください`
        );
        return;
      }
    }
    try {
      await Promise.all(
        filteredDays.map((day) => {
          return addDoc(collection(db, "posts"), {
            days: [day],
            firstDate: day.date,
            timeStamp: serverTimestamp(),
          });
        })
      );

      console.log("すべてのデータがFirestoreに保存されました");
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };
  return {
    handleClick,
    childName,
    setChildName,
    childClass,
    setChildClass,
    days,
  };
};
