"use client";

import { useEffect, useState } from "react";
import db from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import styles from "../styles/page.module.css";
import liff from "@line/liff";

interface Day {
  date: string;
  name: string;
  userId: string;

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

const UsersPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<{
    postIndex: number;
    dayIndex: number;
  } | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editRemark, setEditRemark] = useState("");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_USER_ID as string,
        });
        console.log("LIFFの初期化に成功しました");

        if (liff.isLoggedIn()) {
          const token = liff.getIDToken();
          setIdToken(token);
        } else {
          liff.login();
        }

        const userProfile = await liff.getProfile();
        setUser(userProfile.userId);
        setName(userProfile.displayName);
      } catch (e) {
        console.error("LIFFの初期化に失敗しました", e);
        setIdToken("");
      } finally {
        setLoading(false);
      }
    };
    initializeLiff();
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      const fetchData = async () => {
        const postData = collection(db, "posts");
        const q = query(postData, orderBy("firstDate", "asc"));
        const querySnapshot = await getDocs(q);

        const postsArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        });
        setPosts(postsArray as Post[]);
      };

      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const filteredPosts = posts
    .map((post) => {
      const filteredDays = post.days.filter((day) => {
        const dayDate = new Date(day.date);
        const now = new Date();

        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        return dayDate >= today;
      });

      const userFilteredDays = filteredDays.filter(
        (day) => day.userId === user
      );

      return userFilteredDays.length > 0
        ? { ...post, days: userFilteredDays }
        : null;
    })

    .filter((post) => post !== null) as Post[];

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
          startTime: editStartTime,
          endTime: editEndTime,
          remark: editRemark,
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

  const handleDelete = async (postIndex: number) => {
    const postToDelete = filteredPosts[postIndex];
    if (postToDelete && postToDelete.id) {
      await deleteDoc(doc(db, "posts", postToDelete.id));
      setShouldFetch(true);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleEdit = (postIndex: number, dayIndex: number) => {
    const postToEdit = filteredPosts[postIndex];
    const dayToEdit = postToEdit.days[dayIndex];

    if (dayToEdit) {
      console.log(`編集する日付: ${dayToEdit.date}`);
      setEditStartTime(dayToEdit.startTime || "");
      setEditEndTime(dayToEdit.endTime || "");
      setEditRemark(dayToEdit.remark || "");
      setEditingRow({ postIndex, dayIndex });
    } else {
      console.log("編集対象のIDが見つかりません");
    }
  };

  if (idToken === null || loading) {
    return <div>Loading...</div>;
  }

  const getTodayDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className={styles.childImg}>
      <div className={styles.childCenter}>
        <h1>{name ? `${name}さんの予約一覧` : "予約一覧"}</h1>
      </div>
      <table border={1} className={styles.childListTitle}>
        <thead>
          <tr className={styles.childSubTitle}>
            <th>園児名</th>
            <th>日にち</th>
            <th>延長開始時間</th>
            <th>お迎え時間</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, postIndex) => {
            const days = post.days || [];
            const todayDate = getTodayDate();

            return (
              <React.Fragment key={postIndex}>
                {days.map((day, dayIndex) => {
                  const dayDate = parseDate(day.date);

                  return (
                    <tr key={dayIndex}>
                      <td>{day.name}</td>
                      <td>{day.date}</td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <>
                          <td>
                            <input
                              type="time"
                              value={editStartTime}
                              onChange={(e) => setEditStartTime(e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              value={editEndTime}
                              onChange={(e) => setEditEndTime(e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editRemark}
                              onChange={(e) => setEditRemark(e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              className={styles.usersSave}
                              onClick={handleSave}
                            >
                              保存
                            </button>
                            <button
                              className={styles.usersCancel}
                              onClick={handleCancel}
                            >
                              キャンセル
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{day.startTime}</td>
                          <td>{day.endTime}</td>
                          <td>{day.remark}</td>
                          <td>
                            {dayDate > todayDate ? (
                              <>
                                <button
                                  className={styles.usersEdit}
                                  onClick={() =>
                                    handleEdit(postIndex, dayIndex)
                                  }
                                >
                                  編集
                                </button>
                                <button
                                  className={styles.usersDelete}
                                  onClick={() => handleDelete(postIndex)}
                                >
                                  削除
                                </button>
                              </>
                            ) : null}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
