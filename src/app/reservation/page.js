"use client";

import Link from "next/link";
import "../globals.css";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

export default function Page() {
  const [posts, setPosts] = useState([]);

  const postData = collection(db, "posts");
  getDocs(postData).then((querySnapshot) => {
    console.log(querySnapshot.docs.map((doc) => doc.data()));
  });

  // useEffect(() => {
  //   const postData = getDocs(collection(db, "posts"));
  //   postData.forEach((snapShot) => {
  //     console.log(snapShot.docs.map((doc) => doc.data));
  //   });
  // }, []);

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
            <th>希望日時</th>
            <th>希望日時</th>
            <th>希望日時</th>
            <th>希望日時</th>
            <th>希望日時</th>
            <th>備考欄</th>
          </tr>
          <tr>
            <td>123456</td>
            <td>いっせい</td>
            <td>2024/9/2</td>
            <td>2024/9/3</td>
            <td>2024/9/4</td>
            <td>2024/9/5</td>
            <td>2024/9/6</td>
            <td>16時から</td>
            <td>
              <button className="button">編集</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
