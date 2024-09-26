"use client";

import Link from "next/link";
import styles from "../styles/page.module.css";
import db from "../firebase";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Day {
  date: string;
  name: string;
  startTime: string;
  endTime: string;
  realStartTime?: string;
  realEndTime?: string;
  remark?: string;
}

interface Post {
  id: string;
  days: Day[];
}

export default function Page() {
  const router = useRouter();
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState(getTodayDate());
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editingRow, setEditingRow] = useState<{
    postIndex: number;
    dayIndex: number;
  } | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);

  const fetchData = async () => {
    const postData = collection(db, "posts");
    const querySnapshot = await getDocs(postData);

    const postsArray = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { ...data, id: doc.id };
    });
    setPosts(postsArray as Post[]);
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const filteredPosts = posts
    .map((post) => {
      const filteredDays = post.days.filter(
        (day: { date: string }) => day.date === search
      );

      if (filteredDays.length > 0) {
        return { ...post, days: filteredDays };
      }

      return null;
    })
    .filter((post) => post !== null) as Post[];

  const handleEdit = (postIndex: number, dayIndex: number) => {
    const postToEdit = filteredPosts[postIndex];
    const dayToEdit = postToEdit.days[dayIndex];

    if (dayToEdit) {
      console.log(`編集する日付: ${dayToEdit.date}`);
      setEditStartTime(dayToEdit.realStartTime || "");
      setEditEndTime(dayToEdit.realEndTime || "");
      setEditingRow({ postIndex, dayIndex });
    } else {
      console.log("編集対象のIDが見つかりません");
    }
  };

  const handleSave = async () => {
    if (editingRow === null) {
      console.log("編集対象が選択されていません");
      return;
    }

    const { postIndex, dayIndex } = editingRow;
    const postToUpdate = filteredPosts[postIndex];

    try {
      const postRef = doc(db, "posts", postToUpdate.id);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const days = data.days || [];

        days[dayIndex] = {
          ...days[dayIndex],
          realStartTime: editStartTime,
          realEndTime: editEndTime,
        };

        await updateDoc(postRef, { days });
        console.log("データが更新されました");

        setEditingRow(null);
        setShouldFetch(true);
      }
    } catch (error) {
      console.error("データの更新に失敗しました", error);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleDelete = async (postIndex: number) => {
    const postToDelete = filteredPosts[postIndex];
    if (postToDelete && postToDelete.id) {
      await deleteDoc(doc(db, "posts", postToDelete.id));
      setShouldFetch(true);
    }
  };

  return (
    <>
      <h3 className={styles.center}>
        <Link href="/">トップページに戻る</Link>
      </h3>
      <div className={styles.center}>
        <h1>予約一覧</h1>
        <strong>検索</strong>
        <input type="date" onChange={(e) => setSearch(e.target.value)}></input>
      </div>
      <table border={1} className={styles.listTitle}>
        <tbody>
          <tr className={styles.subTitle}>
            <th>園児名</th>
            <th>日にち</th>
            <th>登園予約時間</th>
            <th>降園予約時間</th>
            <th>登園時間</th>
            <th>降園時間</th>
            <th>備考欄</th>
          </tr>
          {filteredPosts.map((post, postIndex) => {
            const days = post.days || [];
            return (
              <React.Fragment key={postIndex}>
                {days.map((day, dayIndex) => (
                  <tr key={dayIndex}>
                    <td>
                      <Link
                        className={styles.childName}
                        href={`/childName/${day.name}`}
                      >
                        {day.name}
                      </Link>
                    </td>
                    <td>{day.date}</td>
                    <td>{day.startTime}</td>
                    <td>{day.endTime}</td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <>
                          <input
                            type="time"
                            value={editStartTime}
                            onChange={(e) => setEditStartTime(e.target.value)}
                          />
                        </>
                      ) : (
                        day.realStartTime
                      )}
                    </td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <>
                          <input
                            type="time"
                            value={editEndTime}
                            onChange={(e) => setEditEndTime(e.target.value)}
                          />
                        </>
                      ) : (
                        day.realEndTime
                      )}
                    </td>
                    <td>{day.remark}</td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <div className={styles.button}>
                          <button
                            className={styles.saveButton}
                            onClick={handleSave}
                          >
                            保存
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(postIndex)}
                          >
                            削除
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={handleCancel}
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(postIndex, dayIndex)}
                        >
                          編集
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
