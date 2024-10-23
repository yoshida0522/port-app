"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import db from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import styles from "../[childName]/page.module.css";
import TableHeader from "@/app/components/TableHeader/TableHeader";
import ChildReservationRow from "@/app/components/ChildReservation/Childreservation";
import Pagination from "@/app/components/Pagination/Pagination";
import { Day, Post } from "./type";

// 1ページの表示件数
const itemsPerPage = 5;

const ChildReservationPage = () => {
  const params = useParams();
  let childName = params?.childName;

  if (Array.isArray(childName)) {
    childName = childName[0];
  }

  const decodedChildName = decodeURIComponent(childName || "");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editData, setEditData] = useState<Day | null>(null);
  const [editingRow, setEditingRow] = useState<{
    postId: string;
    dayIndex: number;
  } | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const postData = collection(db, "posts");
      const q = query(postData, orderBy("firstDate", "asc"));
      const querySnapshot = await getDocs(q);

      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      setPosts(postsArray as Post[]);
      setShouldFetch(false);
    };

    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch]);

  const filteredPosts = posts
    .map((post) => {
      const filteredDays = post.days.filter(
        (day) => day.name === decodedChildName && !post.delete
      );
      return filteredDays.length > 0 ? { ...post, days: filteredDays } : null;
    })
    .filter((post) => post !== null) as Post[];

  // ページ数の計算
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // ページ切り替え
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (day: Day, postId: string, dayIndex: number): void => {
    setEditData(day);
    setEditingRow({ postId, dayIndex });
  };

  const handleSave = async () => {
    if (!editingRow || !editData) {
      console.log("編集対象が選択されていません");
      return;
    }

    // endTimeがstartTimeよりも前の時間でないかを確認
    if (editData.endTime <= editData.startTime) {
      alert("開始時間以降の時間に設定してください");
      return;
    }

    const { postId, dayIndex } = editingRow;
    const postToUpdate = filteredPosts.find((post) => post.id === postId);

    if (!postToUpdate) {
      console.error("編集対象のポストが見つかりません");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const days = data.days || [];

        days[dayIndex] = {
          ...days[dayIndex],
          class: editData.class,
          date: editData.date,
          startTime: editData.startTime,
          endTime: editData.endTime,
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
      // 削除確認ダイアログを表示
      const confirmed = window.confirm("本当に削除しますか？");

      if (confirmed) {
        try {
          const postRef = doc(db, "posts", postToDelete.id);

          // postのdeleteフィールドをtrueに設定
          await updateDoc(postRef, { delete: true });
          console.log("データが削除フラグを立てました");
          setShouldFetch(true); // データを再取得するためのフラグを立てる
        } catch (error) {
          console.error("削除フラグの更新に失敗しました", error);
        }
      }
    }
  };

  const handleChange = (field: keyof Day, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  return (
    <div className={styles.childImg}>
      <Link href="/reservation" className={styles.childLink}>
        <button className={styles.childButton}>一覧に戻る</button>
      </Link>
      <div className={styles.childCenter}>
        <h1>
          {decodedChildName ? `${decodedChildName}さんの予約一覧` : "予約一覧"}
        </h1>
      </div>
      <table border={1} className={styles.childListTitle}>
        <TableHeader />
        <tbody>
          {paginatedPosts.map((post, postIndex) => {
            const days = post.days || [];
            return (
              <React.Fragment key={post.id}>
                {days.map((day, dayIndex) => (
                  <ChildReservationRow
                    key={dayIndex}
                    postId={post.id}
                    day={day}
                    dayIndex={dayIndex}
                    editingRow={editingRow}
                    editData={editData}
                    handleChange={handleChange}
                    handleEdit={handleEdit}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    handleDelete={handleDelete}
                    postIndex={postIndex}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className={styles.childPagination}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ChildReservationPage;
