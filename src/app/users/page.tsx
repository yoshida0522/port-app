"use client";

import React from "react";
import styles from "../styles/page.module.css";
import { Post } from "../type";
import { useAuthentication } from "../utills/useAuthentication";
import { useFetchPosts } from "../utills/useFetchPosts";
import { useUsersEditPost } from "../utills/useUsersEditPost";
import { useDelete } from "../utills/useDelete";
import UserTableRows from "../components/UserTableRows/UserTableRows";

const UsersPage = () => {
  const { user, name, idToken, loading } = useAuthentication();
  const { posts, setShouldFetch } = useFetchPosts();
  const { handleDelete } = useDelete(setShouldFetch);

  const filteredPosts = posts
    .filter((post) => !post.delete)
    .flatMap((post) => {
      const userDays = post.days.filter(
        (day) => day.userId === user && new Date(day.date) >= new Date()
      );
      return userDays.length > 0 ? { ...post, days: userDays } : null;
    })
    .filter(Boolean) as Post[];

  const {
    editingRow,
    editData,
    setEditData,
    handleEdit,
    handleSave,
    setEditingRow,
  } = useUsersEditPost(filteredPosts, setShouldFetch);

  if (idToken === null || loading) {
    return <div>Loading...</div>;
  }

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
        {/* <tbody> */}
        {/* {filteredPosts.map((post, postIndex) => (
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
                              onClick={() =>
                                handleDelete(filteredPosts[postIndex])
                              }
                            >
                              削除
                            </button>
                          </>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))} */}
        <UserTableRows
          filteredPosts={filteredPosts}
          editingRow={editingRow}
          editData={editData}
          setEditData={setEditData}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleDelete={handleDelete}
          setEditingRow={setEditingRow}
        />
        {/* </tbody> */}
      </table>
    </div>
  );
};

export default UsersPage;
