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
  deleteDoc,
} from "firebase/firestore";
import TableHeader from "../components/TableHeader/TableHeader";
import { Post } from "../type";

const ChildDelete = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchData = async () => {
    const postData = collection(db, "posts");
    const querySnapshot = await getDocs(postData);

    const postsArray = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { ...data, id: doc.id };
    });
    setPosts(postsArray as Post[]);
  };

  const restorePost = async (postId: string) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { delete: false });
    fetchData();
  };

  const deletePost = async (postId: string) => {
    const confirmed = window.confirm("本当に削除しますか？");
    if (confirmed) {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      fetchData();
    }
  };

  // 全て削除
  const allDelete = async () => {
    const confirmed = window.confirm("本当に全て削除しますか？");
    if (confirmed) {
      const deletedPosts = posts.filter((post) => post.delete === true);
      const deletePromises = deletedPosts.map(async (post) => {
        const postRef = doc(db, "posts", post.id);
        await deleteDoc(postRef);
      });
      await Promise.all(deletePromises);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deletedPosts = posts.filter((post) => post.delete === true);

  return (
    <>
      <div className={styles.reservationImg}>
        <Link href="reservation/" className={styles.topPageLink}>
          <button className={styles.topPageButton}>戻る</button>
        </Link>
        <div className={styles.center}>
          <h1>ゴミ箱一覧</h1>
        </div>
        <div className={styles.childAllDelete}>
          <button className={styles.allDelete} onClick={allDelete}>
            全て削除
          </button>
        </div>
      </div>
      <table border={1} className={styles.listTitle}>
        <TableHeader />
        <tbody>
          {deletedPosts.map((post) =>
            post.days.map((day) => (
              <tr key={post.id} className={styles.childDeleteList}>
                <td>{day.name}</td>
                <td>{day.class}</td>
                <td>{day.date}</td>
                <td>{day.startTime}</td>
                <td>{day.endTime}</td>
                <td>{day.realStartTime}</td>
                <td>{day.realEndTime}</td>
                <td>{day.remark}</td>
                <td className={styles.buttonType}>
                  <button
                    className={styles.childDeleteButton}
                    onClick={() => restorePost(post.id)}
                  >
                    復元
                  </button>
                  <button
                    className={styles.childDelete}
                    onClick={() => deletePost(post.id)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default ChildDelete;
