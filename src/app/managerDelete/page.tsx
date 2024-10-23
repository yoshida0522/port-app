"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../firebase";
import Link from "next/link";
import styles from "../styles/page.module.css";
import { User } from "../type";

const ManagerDelete = () => {
  const [posts, setPosts] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = collection(db, "user");
        const querySnapshot = await getDocs(postData);

        const postsArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id } as User;
        });

        // deleteがtrueのユーザーのみをフィルタリング
        const filteredPosts = postsArray.filter((post) => post.delete);
        setPosts(filteredPosts);
      } catch (error) {
        setErrorMessage("データの取得に失敗しました。");
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  const restoreUser = async (userId: string) => {
    try {
      const userDoc = doc(db, "user", userId);
      await updateDoc(userDoc, { delete: false });

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== userId));
    } catch (error) {
      setErrorMessage("ユーザーの復元に失敗しました。");
      console.error("Error restoring user:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const userDoc = doc(db, "user", userId);
      await deleteDoc(userDoc);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== userId));
    } catch (error) {
      setErrorMessage("ユーザーの削除に失敗しました。");
      console.error("Error deleting user:", error);
    }
  };

  // 全て削除
  const allDelete = async () => {
    if (confirm("本当に全て削除してもよろしいですか？")) {
      // 確認ダイアログ
      try {
        const deletePromises = posts.map((post) =>
          deleteDoc(doc(db, "user", post.id))
        );
        await Promise.all(deletePromises);

        setPosts([]);
      } catch (error) {
        setErrorMessage("全てのユーザーの削除に失敗しました。");
        console.error("Error deleting all users:", error);
      }
    }
  };

  return (
    <div className={styles.managerImg}>
      <Link href="managerMenu/" className={styles.managerLink}>
        <button className={styles.managerPage}>戻る</button>
      </Link>
      <div className={styles.center}>
        <h1>ゴミ箱一覧</h1>
      </div>
      <div className={styles.managerDelete}></div>
      <div className={styles.managerAllDelete}>
        <button className={styles.allDelete} onClick={allDelete}>
          全て削除
        </button>
      </div>
      {errorMessage && <p className={styles.managerError}>{errorMessage}</p>}

      <table border={1} className={styles.userList}>
        <thead>
          <tr className={styles.subTitle}>
            <th>ユーザーID</th>
            <th>パスワード</th>
            <th>管理者</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className={styles.managerDeleteText}>
              <td>{post.name}</td>
              <td>{post.pass}</td> <td>{post.manager ? "はい" : "いいえ"}</td>{" "}
              <td className={styles.restore}>
                <button
                  className={styles.restoreButton}
                  onClick={() => restoreUser(post.id)}
                >
                  復元
                </button>
                <button
                  className={styles.managerDeleteButton}
                  onClick={() => deleteUser(post.id)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDelete;
