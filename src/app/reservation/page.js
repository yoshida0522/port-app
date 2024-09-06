"use client";

import Link from "next/link";
import "../globals.css";
import React from "react";
import db from "../firebase.js";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

export default function Page() {
  // const initialDay = new Date();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  // const [editing, setEditing] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // console.log(initialDay);

  useEffect(() => {
    const fetchData = async () => {
      const postData = collection(db, "posts");
      const querySnapshot = await getDocs(postData);

      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // console.log(data);
        return data;
      });
      setPosts(postsArray);
    };
    fetchData();
  }, []);

  const filteredPosts = posts
    .map((post) => {
      const filteredDays = post.days.filter((day) => day.date === search);

      if (filteredDays.length > 0) {
        return { ...post, days: filteredDays };
      }

      return null;
    })
    .filter((post) => post !== null);

  const handleEdit = (index) => {
    setEditingRow(index);
  };

  const handleSave = () => {
    console.log();
    setEditingRow(null);
  };

  return (
    <>
      <h3 className="linkTitle">
        <Link href="/">トップページに戻る</Link>
      </h3>
      <div className="reservationTitle">
        <h1>予約一覧</h1>
        <strong>検索</strong>
        <input type="date" onChange={(e) => setSearch(e.target.value)}></input>
      </div>
      <table border={1} className="listTitle">
        <tbody>
          <tr className="subTitle">
            {/* <th>ID</th> */}
            <th>園児名</th>
            <th>日にち</th>
            <th>登園時間</th>
            <th>退園時間</th>
            <th>登園実時間</th>
            <th>退園実時間</th>
            <th>備考欄</th>
          </tr>
          {filteredPosts.map((post, index) => {
            const days = post.days || [];
            return (
              <React.Fragment key={index}>
                {days.length > 0 && (
                  <>
                    {editingRow === index ? (
                      <tr>
                        <td>{days[0]?.name}</td>
                        <td>{days[0]?.date}</td>
                        <td>{days[0]?.startTime}</td>
                        <td>{days[0]?.endTime}</td>
                        <td>
                          <input type="time"></input>
                        </td>
                        <td>
                          <input type="time"></input>
                        </td>
                        <td>{days[0]?.remark}</td>
                        <button className="saveButton" onClick={handleSave}>
                          保存
                        </button>
                      </tr>
                    ) : (
                      <tr>
                        <td>{days[0]?.name}</td>
                        <td>{days[0]?.date}</td>
                        <td>{days[0]?.startTime}</td>
                        <td>{days[0]?.endTime}</td>
                        <td></td>
                        <td></td>
                        <td>{days[0]?.remark}</td>
                        <button
                          className="button"
                          onClick={() => handleEdit(index)}
                        >
                          編集
                        </button>
                      </tr>
                    )}
                    {days.slice(1).map((dayData, dayIndex) => (
                      <tr key={dayIndex}>
                        <td>{dayData.name}</td>
                        <td>{dayData.date}</td>
                        <td>{dayData.startTime}</td>
                        <td>{dayData.endTime}</td>
                        <td></td>
                        <td></td>
                        <td>{dayData.remark}</td>
                        {editingRow === index ? (
                          <button className="saveButton" onClick={handleSave}>
                            保存
                          </button>
                        ) : (
                          <button
                            className="button"
                            onClick={() => handleEdit(index)}
                          >
                            編集
                          </button>
                        )}
                      </tr>
                    ))}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
