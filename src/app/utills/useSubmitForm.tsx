import firebase from "firebase/compat/app";
import { useRouter } from "next/router";
import db from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useSendMessage } from "./useSendMessage";
import { v4 as uuidv4 } from "uuid";

export const useSubmitForm = (
  user: string | null,
  idToken: string | null,
  childName: string,
  childClass: string,
  days: Record<string, any>
) => {
  const router = useRouter();
  const { sendMessage, isSubmitting } = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !idToken) return console.error("ユーザー情報が見つかりません");

    const filteredDays = Object.values(days)
      .map((day) => ({
        id: uuidv4(),
        name: childName,
        class: childClass,
        realStartTime: "",
        realEndTime: "",
        userId: user,
        ...day,
      }))
      .filter((day) => day.date?.trim());

    if (!filteredDays.length) return console.log("保存するデータがありません");

    // バリデーションチェック: endTimeがstartTimeよりも前の場合
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
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        })
      );

      console.log("すべてのデータがFirestoreに保存されました");
      await sendMessage(user, filteredDays);
      router.push("/thanks");
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return { handleSubmit, isSubmitting };
};
