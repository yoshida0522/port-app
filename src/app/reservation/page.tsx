"use client";

import Link from "next/link";
import "../globals.css";
import React from "react";
import db from "../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editingRow, setEditingRow] = useState<{
    postIndex: number;
    dayIndex: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const postData = collection(db, "posts");
      const querySnapshot = await getDocs(postData);

      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      setPosts(postsArray as Post[]);
    };
    fetchData();
  }, []);

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
      }
    } catch (error) {
      console.error("データの更新に失敗しました", error);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleDelete = async (postIndex: number, dayIndex: number) => {
    const postToDelete = filteredPosts[postIndex];
    if (postToDelete && postToDelete.id) {
      try {
        await deleteDoc(doc(db, "posts", postToDelete.id));
        console.log(`Document with ID ${postToDelete.id} deleted successfully`);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    } else {
      console.error("No valid document ID found for deletion");
    }
  };

  return (
    <>
      <h3 className="linkTitle">
        <Link href="/">トップページに戻る</Link>
      </h3>
      <div className="reservationTitle">
        <h1>予約一覧</h1>
        <strong>検索</strong>
        <input type="date" onChange={(e) => setSearch(e.target.value)}></input>
      </div>
      <table border={1} className="listTitle">
        <tbody>
          <tr className="subTitle">
            <th>園児名</th>
            <th>日にち</th>
            <th>登園時間</th>
            <th>退園時間</th>
            <th>登園実時間</th>
            <th>退園実時間</th>
            <th>備考欄</th>
          </tr>
          {filteredPosts.map((post, postIndex) => {
            const days = post.days || [];
            return (
              <React.Fragment key={postIndex}>
                {days.map((day: any, dayIndex: any) => (
                  <tr key={dayIndex}>
                    <td>
                      <Link href={`/childName/${day.name}`}>{day.name}</Link>
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
                            onChange={(e) => setEditStartTime(e.target.value)}
                          />
                        </>
                      ) : (
                        <>{day.realStartTime}</>
                      )}
                    </td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <>
                          <input
                            type="time"
                            onChange={(e) => setEditEndTime(e.target.value)}
                          />
                        </>
                      ) : (
                        <>{day.realEndTime}</>
                      )}
                    </td>
                    <td>{day.remark}</td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <div>
                          <button className="saveButton" onClick={handleSave}>
                            保存
                          </button>
                          <button
                            className="deleteButton"
                            onClick={() => handleDelete(postIndex, dayIndex)}
                          >
                            削除
                          </button>
                          <button onClick={handleCancel}>キャンセル</button>
                        </div>
                      ) : (
                        <button
                          className="button"
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
