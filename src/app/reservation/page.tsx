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
} from "firebase/firestore";
import SearchForm from "../components/SearchForm/SearchForm";
import ReservationList from "../components/ReservationList/ReservationList";
import TableHeader from "../components/TableHeader/TableHeader";
import Pagination from "../components/Pagination/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";
import { Post } from "../type";

// 1ページの表示件数
const itemsPerPage = 5;

export default function Reservation() {
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
    postId: string;
    dayIndex: number;
  } | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
    .filter((post) => post !== null && !post.delete) as Post[];

  // 日付順に並べ替え
  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.days[0]?.date);
    const dateB = new Date(b.days[0]?.date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime(); // 昇順にソート
    }
    const nameA = a.days[0]?.name.toLowerCase();
    const nameB = b.days[0]?.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });

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

  const handleEdit = (postId: string, dayIndex: number) => {
    const postToEdit = posts.find((post) => post.id === postId);
    if (!postToEdit) {
      console.log("編集対象のIDが見つかりません");
      return;
    }
    const dayToEdit = postToEdit.days[dayIndex];

    console.log(`編集する日付: ${dayToEdit.date}`);
    setEditStartTime(dayToEdit.realStartTime || "");
    setEditEndTime(dayToEdit.realEndTime || "");
    setEditingRow({ postId, dayIndex });
  };

  const handleSave = async () => {
    if (editingRow === null) {
      console.log("編集対象が選択されていません");
      return;
    }

    // realEndTimeがrealStartTimeよりも前の時間でないかを確認
    if (editEndTime <= editStartTime) {
      alert("開始時間以降の時間に設定してください");
      return;
    }

    const { postId, dayIndex } = editingRow;
    console.log("編集対象の postIndex:", postId, "dayIndex:", dayIndex);

    try {
      const postRef = doc(db, "posts", postId);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Firestore から取得したデータ:", data);
        const days = data.days || [];

        // dayIndexが正しい範囲にあるか確認
        if (dayIndex >= 0 && dayIndex < days.length) {
          days[dayIndex] = {
            ...days[dayIndex],
            realStartTime: editStartTime,
            realEndTime: editEndTime,
          };

          await updateDoc(postRef, { days });
          console.log("データが更新されました");

          // 状態をリセット
          setEditingRow(null);
          setShouldFetch(true);
        } else {
          console.error("dayIndex が無効です:", dayIndex);
        }
      } else {
        console.error("Firestore に該当のドキュメントが存在しません");
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

          // 'delete'フィールドをtrueに更新
          await updateDoc(postRef, { delete: true });

          setShouldFetch(true); // データを再取得するためのフラグを立てる
          console.log("データが削除フラグで更新されました");
        } catch (error) {
          console.error("データの削除処理に失敗しました", error);
        }
      }
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
        <div className={styles.searchDelete}>
          <SearchForm search={search} setSearch={setSearch} />
          <Link className={styles.deleteIconLink} href="childDelete/">
            <DeleteIcon className={styles.deleteIcon} />
          </Link>
        </div>
      </div>
      <table border={1} className={styles.listTitle}>
        <TableHeader />
        <tbody>
          {paginatedPosts.map((post, postIndex) => (
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
      <div className={styles.reservationPagination}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
