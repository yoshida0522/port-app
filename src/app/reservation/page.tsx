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
import SearchForm from "../components/SearchForm/SearchForm";
import ReservationList from "../components/ReservationList/ReservationList";
import TableHeader from "../components/TableHeader/TableHeader";

interface Day {
  date: string;
  name: string;
  class: string;
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
      // 検索日が指定されているかどうかをチェック
      if (search) {
        const filteredDays = post.days.filter(
          (day: { date: string }) => day.date === search
        );

        if (filteredDays.length > 0) {
          return { ...post, days: filteredDays };
        }

        return null;
      } else {
        // 検索日が指定されていない場合は、すべての日を返す
        return post;
      }
    })
    .filter((post) => post !== null) as Post[];

  // 日付順に並べ替え
  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.days[0]?.date);
    const dateB = new Date(b.days[0]?.date);

    // 日付の比較
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime(); // 昇順にソート
    }

    // 日付が同じ場合は名前で比較
    const nameA = a.days[0]?.name.toLowerCase(); // 名前を小文字に変換
    const nameB = b.days[0]?.name.toLowerCase(); // 名前を小文字に変換
    return nameA.localeCompare(nameB); // 名前での比較
  });

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
      <div className={styles.reservationImg}>
        <Link href="/" className={styles.topPageLink}>
          <button className={styles.topPageButton}>トップページに戻る</button>
        </Link>
        <div className={styles.center}>
          <h1>予約一覧</h1>
        </div>
        <SearchForm search={search} setSearch={setSearch} />
      </div>
      <table border={1} className={styles.listTitle}>
        <TableHeader />
        <tbody>
          {filteredPosts.map((post, postIndex) => (
            <ReservationList
              key={postIndex}
              post={post}
              postIndex={postIndex}
              editingRow={editingRow}
              editStartTime={editStartTime}
              editEndTime={editEndTime}
              setEditStartTime={setEditStartTime}
              setEditEndTime={setEditEndTime}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleDelete={handleDelete}
              handleCancel={handleCancel}
            />
          ))}
        </tbody>
      </table>
      {/* </div> */}
    </>
  );
}
