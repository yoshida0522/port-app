// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import db from "../../firebase";
// import { collection, getDocs, orderBy, query } from "firebase/firestore";
// import Link from "next/link";
// import React from "react";
// import styles from "../../styles/page.module.css";
// import TableHeader from "@/app/components/TableHeader/TableHeader";

// interface Day {
//   date: string;
//   name: string;
//   class: string;
//   startTime: string;
//   endTime: string;
//   realStartTime?: string;
//   realEndTime?: string;
//   remark?: string;
// }

// interface Post {
//   id: string;
//   days: Day[];
// }

// const ChildReservationPage = () => {
//   const params = useParams();
//   let childName = params?.childName;

//   if (Array.isArray(childName)) {
//     childName = childName[0];
//   }

//   const decodedChildName = decodeURIComponent(childName || "");
//   const [posts, setPosts] = useState<Post[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const postData = collection(db, "posts");
//       const q = query(postData, orderBy("firstDate", "asc"));
//       const querySnapshot = await getDocs(q);

//       querySnapshot.forEach((doc) => {
//         console.log(doc.id, " => ", doc.data());
//       });

//       const postsArray = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return { ...data, id: doc.id };
//       });
//       setPosts(postsArray as Post[]);
//     };
//     fetchData();
//   }, []);

//   const filteredPosts = posts
//     .map((post) => {
//       const filteredDays = post.days.filter(
//         (day: { name: string }) => day.name === decodedChildName
//       );
//       if (filteredDays.length > 0) {
//         return { ...post, days: filteredDays };
//       }

//       return null;
//     })
//     .filter((post) => post !== null) as Post[];

//   return (
//     <div className={styles.childImg}>
//       <Link href="/reservation" className={styles.childLink}>
//         <button className={styles.childButton}>一覧に戻る</button>
//       </Link>
//       <div className={styles.childCenter}>
//         <h1>
//           {decodedChildName ? `${decodedChildName}さんの予約一覧` : "予約一覧"}
//         </h1>
//       </div>
//       <table border={1} className={styles.childListTitle}>
//         <TableHeader />
//         <tbody>
//           {filteredPosts.map((post, postIndex) => {
//             const days = post.days || [];

//             return (
//               <React.Fragment key={postIndex}>
//                 {days.map((day, dayIndex) => (
//                   <tr key={dayIndex} className={styles.childNameText}>
//                     <td>{day.name}</td>
//                     <td>{day.class}</td>
//                     <td>{day.date}</td>
//                     <td>{day.startTime}</td>
//                     <td>{day.endTime}</td>
//                     <td>{day.realStartTime}</td>
//                     <td>{day.realEndTime}</td>
//                     <td>{day.remark}</td>
//                   </tr>
//                 ))}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ChildReservationPage;

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import db from "../../firebase";
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
import Link from "next/link";
import React from "react";
import styles from "../[childName]/page.module.css";
import TableHeader from "@/app/components/TableHeader/TableHeader";

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

const ChildReservationPage = () => {
  const params = useParams();
  let childName = params?.childName;

  if (Array.isArray(childName)) {
    childName = childName[0];
  }

  const decodedChildName = decodeURIComponent(childName || "");
  const [posts, setPosts] = useState<Post[]>([]);
  // const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Day | null>(null);
  const [editingRow, setEditingRow] = useState<{
    postIndex: number;
    dayIndex: number;
  } | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);

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
        (day) => day.name === decodedChildName
      );
      return filteredDays.length > 0 ? { ...post, days: filteredDays } : null;
    })
    .filter((post) => post !== null) as Post[];

  const handleEdit = (day: Day, postIndex: number): void => {
    // setEditIndex(postIndex);
    setEditData(day);
    setEditingRow({ postIndex, dayIndex: postIndex });
  };

  const handleSave = async () => {
    if (!editingRow || !editData) {
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
      await deleteDoc(doc(db, "posts", postToDelete.id));
      setShouldFetch(true);
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
          {filteredPosts.map((post, postIndex) => {
            const days = post.days || [];
            return (
              <React.Fragment key={postIndex}>
                {days.map((day, dayIndex) => (
                  <tr key={dayIndex} className={styles.childNameText}>
                    <td>{day.name}</td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <input
                          className={styles.childInput}
                          value={editData?.class}
                          onChange={(e) =>
                            handleChange("class", e.target.value)
                          }
                        />
                      ) : (
                        day.class
                      )}
                    </td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <input
                          className={styles.childInput}
                          value={editData?.date}
                          onChange={(e) => handleChange("date", e.target.value)}
                        />
                      ) : (
                        day.date
                      )}
                    </td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <input
                          className={styles.childInput}
                          type="time"
                          value={editData?.startTime}
                          onChange={(e) =>
                            handleChange("startTime", e.target.value)
                          }
                        />
                      ) : (
                        day.startTime
                      )}
                    </td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <input
                          className={styles.childInput}
                          type="time"
                          value={editData?.endTime}
                          onChange={(e) =>
                            handleChange("endTime", e.target.value)
                          }
                        />
                      ) : (
                        day.endTime
                      )}
                    </td>
                    <td>{day.realStartTime}</td>
                    <td>{day.realEndTime}</td>
                    <td>{day.remark}</td>
                    <td>
                      {editingRow?.postIndex === postIndex &&
                      editingRow?.dayIndex === dayIndex ? (
                        <>
                          <button
                            className={styles.childSaveButton}
                            onClick={handleSave}
                          >
                            保存
                          </button>
                          <button
                            className={styles.childDeleteButton}
                            onClick={() => handleDelete(postIndex)}
                          >
                            削除
                          </button>
                          <button
                            className={styles.childCancelButton}
                            onClick={handleCancel}
                          >
                            キャンセル
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={styles.childEditButton}
                            onClick={() => handleEdit(day, postIndex)}
                          >
                            編集
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ChildReservationPage;
