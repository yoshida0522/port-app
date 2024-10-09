"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import db from "../firebase";
import styles from "../styles/page.module.css";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  pass: string;
  manager: boolean;
}

function Page() {
  const [data, setData] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<{
    name: string;
    pass: string;
    manager: boolean;
  }>({
    name: "",
    pass: "",
    manager: false,
  });
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const querySnapshot = await getDocs(collection(db, "user"));
    const dataArray: User[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<User, "id">;
      const userDataWithDefaults = {
        id: doc.id,
        name: data.name,
        pass: data.pass,
        manager: data.manager ?? false,
      };
      dataArray.push(userDataWithDefaults);
    });

    setData(dataArray);
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditedUser({ name: user.name, pass: user.pass, manager: user.manager });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setEditedUser((prev) => ({ ...prev, manager: !prev.manager }));
  };

  const handleSave = async (userId: string) => {
    try {
      const userDocRef = doc(db, "user", userId);
      await updateDoc(userDocRef, {
        name: editedUser.name,
        pass: editedUser.pass,
      });

      setData((prevData) =>
        prevData.map((user) =>
          user.id === userId
            ? {
                ...user,
                name: editedUser.name,
                pass: editedUser.pass,
                manager: editedUser.manager,
              }
            : user
        )
      );

      setEditingUserId(null);
    } catch (error) {
      console.error("更新中にエラーが発生しました: ", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const userDocRef = doc(db, "user", userId);
      await deleteDoc(userDocRef);

      setData((prevData) => prevData.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("削除中にエラーが発生しました: ", error);
    }
  };

  return (
    <div className={styles.managerImg}>
      <h3 className={styles.managerPage}>
        <Link href="/" className={styles.managerPageText}>
          トップページに戻る
        </Link>
      </h3>
      <div className={styles.center}>
        <h1>ユーザー管理</h1>
      </div>
      <table border={1} className={styles.userList}>
        <tbody>
          <tr className={styles.subTitle}>
            <th>ユーザーID</th>
            <th>パスワード</th>
            <th>管理者</th>
          </tr>
          {data.map((user) => (
            <tr key={user.id}>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="pass"
                    value={editedUser.pass}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.pass
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="checkbox"
                    checked={editedUser.manager}
                    onChange={handleCheckboxChange}
                  />
                ) : (
                  <input type="checkbox" checked={user.manager} readOnly />
                )}
              </td>
              <td className={styles.tableLine}>
                {editingUserId === user.id ? (
                  <>
                    <button
                      className={styles.managerSave}
                      onClick={() => handleSave(user.id)}
                    >
                      保存
                    </button>
                    <button
                      className={styles.managerCancel}
                      onClick={() => setEditingUserId(null)}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.managerEdit}
                      onClick={() => handleEdit(user)}
                    >
                      変更
                    </button>
                    <button
                      className={styles.managerDelete}
                      onClick={() => handleDelete(user.id)}
                    >
                      削除
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Page;
