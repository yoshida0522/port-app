"use client";

import Link from "next/link";
import "../globals.css";
import { db } from "../firebase.js";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

export default function Page() {
  const [posts, setPosts] = useState([]);

  const postData = collection(db, "posts");
  getDocs(postData)
    .then((querySnapshot) => {
      console.log(querySnapshot.docs.map((doc) => doc.data()));
    })

    .catch((error) => {
      console.error("Error getting documents: ", error);
    });

  // useEffect(() => {
  //   const postData = getDocs(collection(db, "posts"));
  //   postData.forEach((snapShot) => {
  //     console.log(snapShot.docs.map((doc) => doc.data));
  //   });
  // }, []);

  //

  return (
    <>
      <h3 className="linkTitle">
        <Link href="/">トップページに戻る</Link>
      </h3>
      <h1 className="reservationTitle">予約一覧</h1>
      <table border={1} className="listTitle">
        <tbody>
          <tr className="subTitle">
            <th>ID</th>
            <th>園児名</th>
            <th>希望日時1</th>
            <th>希望日時2</th>
            <th>希望日時3</th>
            <th>希望日時4</th>
            <th>希望日時5</th>
            <th>備考欄</th>
          </tr>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.name}</td>
              <td>{post.date1}</td>
              <td>{post.date2}</td>
              <td>{post.date3}</td>
              <td>{post.date4}</td>
              <td>{post.date5}</td>
              <td>{post.note}</td>
              <td>
                <button className="button">編集</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
