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

interface User {
  id: string;
  name: string;
  pass: string;
  manager: boolean;
  delete: boolean;
}

function managerDelete() {
  const [posts, setPosts] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = collection(db, "user");
        const querySnapshot = await getDocs(postData);

        const postsArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id } as User; // 型を指定
        });

        // deleteがtrueのユーザーのみをフィルタリング
        const filteredPosts = postsArray.filter((post) => post.delete);
        setPosts(filteredPosts);
      } catch (error) {
        setErrorMessage("データの取得に失敗しました。"); // エラーメッセージの設定
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  const restoreUser = async (userId: string) => {
    try {
      const userDoc = doc(db, "user", userId); // ユーザーのドキュメントを取得
      await updateDoc(userDoc, { delete: false }); // deleteをfalseに更新

      // ステートを更新して、UIに反映
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== userId));
    } catch (error) {
      setErrorMessage("ユーザーの復元に失敗しました。");
      console.error("Error restoring user:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const userDoc = doc(db, "user", userId); // ユーザーのドキュメントを取得
      await deleteDoc(userDoc); // ユーザーを削除

      // ステートを更新して、UIに反映
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== userId));
    } catch (error) {
      setErrorMessage("ユーザーの削除に失敗しました。");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className={styles.managerImg}>
      <Link href="managerMenu/" className={styles.managerLink}>
        <button className={styles.managerPage}>戻る</button>
      </Link>
      <div className={styles.center}>
        <h1>ユーザー管理</h1>
      </div>
      <div className={styles.managerDelete}></div>
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
              <td>{post.pass}</td>{" "}
              {/* パスワードを表示（必要に応じて表示方法を変更） */}
              <td>{post.manager ? "はい" : "いいえ"}</td>{" "}
              <td className={styles.restore}>
                <button
                  className={styles.restoreButton}
                  onClick={() => restoreUser(post.id)} // ボタンクリックでrestoreUserを呼び出す
                >
                  復元
                </button>
                <button
                  className={styles.managerDeleteButton} // スタイルを追加
                  onClick={() => deleteUser(post.id)} // ボタンクリックでdeleteUserを呼び出す
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
}

export default managerDelete;
