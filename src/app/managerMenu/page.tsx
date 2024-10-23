"use client";

import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import db from "../firebase";
import styles from "../styles/page.module.css";
import Link from "next/link";
import Manager from "../components/Manager/Manager";
import DeleteIcon from "@mui/icons-material/Delete";
import { User } from "../type";

const ManagerMenu = () => {
  const [data, setData] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<{
    name: string;
    pass: string;
    manager: boolean;
    delete: boolean;
  }>({
    name: "",
    pass: "",
    manager: false,
    delete: false,
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

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
        delete: data.delete ?? false,
      };
      if (!userDataWithDefaults.delete) {
        dataArray.push(userDataWithDefaults);
      }
    });

    setData(dataArray);
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditedUser({
      name: user.name,
      pass: user.pass,
      manager: user.manager,
      delete: user.delete,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setEditedUser((prev) => ({ ...prev, manager: !prev.manager }));
  };

  const handleSave = async (userId: string) => {
    if (editedUser.name.trim() === "" || editedUser.pass.trim() === "") {
      setErrorMessage("ユーザーIDとパスワードは必須です。");
      return;
    }

    try {
      const userDocRef = doc(db, "user", userId);
      await updateDoc(userDocRef, {
        name: editedUser.name,
        pass: editedUser.pass,
        manager: editedUser.manager,
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
      setErrorMessage("");
    } catch (error) {
      console.error("更新中にエラーが発生しました: ", error);
    }
  };

  const handleDelete = async (userId: string) => {
    // 削除確認ダイアログを表示
    const confirmed = window.confirm("本当に削除しますか？");

    if (confirmed) {
      try {
        const userDocRef = doc(db, "user", userId);

        // deleteフィールドをtrueに更新
        await updateDoc(userDocRef, { delete: true });

        // データを更新
        setData((prevData) => prevData.filter((user) => user.id !== userId));

        setErrorMessage("");
      } catch (error) {
        console.error("削除中にエラーが発生しました: ", error);
      }
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setErrorMessage("");
  };

  return (
    <div className={styles.managerImg}>
      <Link href="/" className={styles.managerLink}>
        <button className={styles.managerPage}>トップページに戻る</button>
      </Link>
      <div className={styles.center}>
        <h1>ユーザー管理</h1>
      </div>
      <div className={styles.managerDelete}>
        <Link href="managerDelete/">
          <DeleteIcon className={styles.managerDeleteIcon} />
        </Link>
      </div>
      {errorMessage && <p className={styles.managerError}>{errorMessage}</p>}

      <table border={1} className={styles.userList}>
        <tbody>
          <tr className={styles.subTitle}>
            <th>ユーザーID</th>
            <th>パスワード</th>
            <th>管理者</th>
          </tr>
          {data.map((user) => (
            <Manager
              key={user.id}
              user={user}
              editingUserId={editingUserId}
              editedUser={editedUser}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onInputChange={handleInputChange}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerMenu;
