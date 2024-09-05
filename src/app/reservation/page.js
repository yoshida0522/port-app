"use client";

import Link from "next/link";
import "../globals.css";
import React from "react";
import db from "../firebase.js";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const postData = collection(db, "posts");
      const querySnapshot = await getDocs(postData);

      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // console.log("取得したデータ:", data);
        return data;
      });

      setPosts(postsArray);
    };

    fetchData();
  }, []);

  const handleEdit = async () => {
    setEditing(true);
  };

  return (
    <>
      <h3 className="linkTitle">
        <Link href="/">トップページに戻る</Link>
      </h3>
      <div className="reservationTitle">
        <h1>予約一覧</h1>
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
            <th>登園時間</th>
            <th>退園時間</th>
            <th>備考欄</th>
          </tr>
          {posts.map((post, index) => {
            const days = post.days || [];
            return (
              <React.Fragment key={index}>
                {days.length > 0 && (
                  <>
                    <tr>
                      <td>{days[0]?.name}</td>
                      <td>{days[0]?.date}</td>
                      <td>{days[0]?.startTime}</td>
                      <td>{days[0]?.endTime}</td>
                      <td></td>
                      <td></td>
                      <td>{days[0]?.remark}</td>
                      <td>
                        <button className="button" onClick={handleEdit}>
                          編集
                        </button>
                      </td>
                    </tr>
                    {days.slice(1).map((dayData, dayIndex) => (
                      <tr key={dayIndex}>
                        <td>{dayData.name}</td>
                        <td>{dayData.date}</td>
                        <td>{dayData.startTime}</td>
                        <td>{dayData.endTime}</td>
                        <td></td>
                        <td></td>
                        <td>{dayData.remark}</td>
                        <td>
                          <button className="button" onClick={handleEdit}>
                            編集
                          </button>
                        </td>
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
