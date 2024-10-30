"use client";

import { useEffect, useState } from "react";
import db from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import styles from "../styles/page.module.css";
import { Post } from "../type";
import { useAuthentication } from "../utills/useAuthentication";

const UsersPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingRow, setEditingRow] = useState<{
    postIndex: number;
    dayIndex: number;
  } | null>(null);
  const [editData, setEditData] = useState({
    startTime: "",
    endTime: "",
    remark: "",
  });
  const [shouldFetch, setShouldFetch] = useState(true);
  // const [editStartTime, setEditStartTime] = useState("");
  // const [editEndTime, setEditEndTime] = useState("");
  // const [editRemark, setEditRemark] = useState("");
  const { user, name, idToken, loading } = useAuthentication();

  // useEffect(() => {
  //   if (shouldFetch) {
  //     const fetchData = async () => {
  //       const postData = collection(db, "posts");
  //       const q = query(postData, orderBy("firstDate", "asc"));
  //       const querySnapshot = await getDocs(q);

  //       const postsArray = querySnapshot.docs.map((doc) => {
  //         const data = doc.data();
  //         return { ...data, id: doc.id };
  //       });
  //       setPosts(postsArray as Post[]);
  //     };

  //     fetchData();
  //     setShouldFetch(false);
  //   }
  // }, [shouldFetch]);
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "posts"), orderBy("firstDate", "asc"))
      );
      const postsArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Post[];
      setPosts(postsArray);
    };

    if (shouldFetch && !loading) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch, loading]);

  // const filteredPosts = posts
  //   .map((post) => {
  //     const filteredDays = post.days.filter((day) => {
  //       const dayDate = new Date(day.date);
  //       const now = new Date();

  //       const today = new Date(now);
  //       today.setHours(0, 0, 0, 0);

  //       return dayDate >= today;
  //     });

  //     const userFilteredDays = filteredDays.filter(
  //       (day) => day.userId === user
  //     );

  //     return userFilteredDays.length > 0
  //       ? { ...post, days: userFilteredDays }
  //       : null;
  //   })

  //   .filter((post) => post !== null && !post.delete) as Post[];
  const filteredPosts = posts
    .flatMap((post) => {
      const userDays = post.days.filter(
        (day) => day.userId === user && new Date(day.date) >= new Date()
      );
      return userDays.length > 0 ? { ...post, days: userDays } : null;
    })
    .filter(Boolean) as Post[];

  // const handleSave = async () => {
  //   if (editingRow === null) {
  //     console.log("編集対象が選択されていません");
  //     return;
  //   }

  //   const { postIndex, dayIndex } = editingRow;
  //   const postToUpdate = filteredPosts[postIndex];

  //   try {
  //     const postRef = doc(db, "posts", postToUpdate.id);
  //     const docSnap = await getDoc(postRef);

  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       const days = data.days || [];

  //       days[dayIndex] = {
  //         ...days[dayIndex],
  //         startTime: editStartTime,
  //         endTime: editEndTime,
  //         remark: editRemark,
  //       };

  //       await updateDoc(postRef, { days });
  //       console.log("データが更新されました");

  //       setEditingRow(null);
  //       setShouldFetch(true);
  //     }
  //   } catch (error) {
  //     console.error("データの更新に失敗しました", error);
  //   }
  // };
  const handleSave = async () => {
    if (editingRow) {
      const postToUpdate = filteredPosts[editingRow.postIndex];
      const postRef = doc(db, "posts", postToUpdate.id);

      try {
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
          const days = docSnap.data().days || [];

          days[editingRow.dayIndex] = {
            ...days[editingRow.dayIndex],
            startTime: editData.startTime,
            endTime: editData.endTime,
            remark: editData.remark,
          };

          // Firestoreのドキュメントを更新
          await updateDoc(postRef, { days });
          console.log("データが正常に更新されました");

          setEditingRow(null);
          setShouldFetch(true);
        } else {
          console.error("ドキュメントが存在しません");
        }
      } catch (error) {
        console.error("データの更新に失敗しました", error);
      }
    }
  };

  // const handleDelete = async (postIndex: number) => {
  //   const postToDelete = filteredPosts[postIndex];

  //   // 確認ダイアログを表示
  //   const confirmed = window.confirm("本当に削除しますか？");
  //   if (!confirmed) return;

  //   if (postToDelete && postToDelete.id) {
  //     try {
  //       const postRef = doc(db, "posts", postToDelete.id);

  //       // postのdeleteフィールドをtrueに設定
  //       await updateDoc(postRef, { delete: true });
  //       console.log("データが削除フラグを立てました");
  //       setShouldFetch(true);
  //     } catch (error) {
  //       console.error("削除フラグの更新に失敗しました", error);
  //     }
  //   }
  // };
  const handleDelete = async (postIndex: number) => {
    const postToDelete = filteredPosts[postIndex];
    if (window.confirm("本当に削除しますか？") && postToDelete?.id) {
      try {
        const postRef = doc(db, "posts", postToDelete.id);
        await updateDoc(postRef, { delete: true });
        console.log("データが削除フラグを立てました");
        setShouldFetch(true);
      } catch (error) {
        console.error("削除フラグの更新に失敗しました", error);
      }
    }
  };

  // const handleCancel = () => {
  //   setEditingRow(null);
  // };

  // const handleEdit = (postIndex: number, dayIndex: number) => {
  //   const postToEdit = filteredPosts[postIndex];
  //   const dayToEdit = postToEdit.days[dayIndex];

  //   if (dayToEdit) {
  //     console.log(`編集する日付: ${dayToEdit.date}`);
  //     setEditStartTime(dayToEdit.startTime || "");
  //     setEditEndTime(dayToEdit.endTime || "");
  //     setEditRemark(dayToEdit.remark || "");
  //     setEditingRow({ postIndex, dayIndex });
  //   } else {
  //     console.log("編集対象のIDが見つかりません");
  //   }
  // };
  const handleEdit = (postIndex: number, dayIndex: number) => {
    const dayToEdit = filteredPosts[postIndex].days[dayIndex];
    if (dayToEdit)
      setEditData({
        startTime: dayToEdit.startTime || "",
        endTime: dayToEdit.endTime || "",
        remark: dayToEdit.remark || "",
      });
    setEditingRow({ postIndex, dayIndex });
  };

  if (idToken === null || loading) {
    return <div>Loading...</div>;
  }

  // const getTodayDate = () => {
  //   const now = new Date();
  //   return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // };

  // const parseDate = (dateString: string) => {
  //   const [year, month, day] = dateString.split("-").map(Number);
  //   return new Date(year, month - 1, day);
  // };

  return (
    <div className={styles.usersImg}>
      <div className={styles.usersCenter}>
        <h1>{name ? `${name}さんの予約一覧` : "予約一覧"}</h1>
      </div>
      <table border={1} className={styles.usersListTitle}>
        <tr className={styles.usersSubTitle}>
          <th>園児名</th>
          <th>クラス</th>
          <th>日にち</th>
          <th>延長開始時間</th>
          <th>お迎え時間</th>
          <th>備考</th>
        </tr>
        <tbody>
          {/* {filteredPosts.map((post, postIndex) => {
            const days = post.days || [];
            const todayDate = getTodayDate();

            return (
              <React.Fragment key={postIndex}>
                {days.map((day, dayIndex) => {
                  const dayDate = parseDate(day.date);
                  return ( */}
          {filteredPosts.map((post, postIndex) => (
            <React.Fragment key={postIndex}>
              {post.days.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <td>{day.name}</td>
                  <td>{day.class}</td>
                  <td>{day.date}</td>
                  {editingRow?.postIndex === postIndex &&
                  editingRow?.dayIndex === dayIndex ? (
                    <>
                      <td>
                        <input
                          type="time"
                          // value={editStartTime}
                          // onChange={(e) => setEditStartTime(e.target.value)}
                          value={editData.startTime}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          // value={editEndTime}
                          // onChange={(e) => setEditEndTime(e.target.value)}
                          value={editData.endTime}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          // value={editRemark}
                          // onChange={(e) => setEditRemark(e.target.value)}
                          value={editData.remark}
                          onChange={(e) =>
                            setEditData({ ...editData, remark: e.target.value })
                          }
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
                          onClick={() => setEditingRow(null)}
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
                        {/* {dayDate > todayDate ? ( */}
                        {new Date(day.date) > new Date() && (
                          <>
                            <button
                              className={styles.usersEdit}
                              onClick={() => handleEdit(postIndex, dayIndex)}
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
                          // ) : null}
                        )}
                      </td>
                    </>
                  )}
                </tr>
                //   );
                // })}
              ))}
            </React.Fragment>
            //   );
            // })}
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
