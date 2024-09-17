"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import db from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import "../../globals.css";

interface Day {
  date: string;
  name: string;

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

  useEffect(() => {
    const fetchData = async () => {
      const postData = collection(db, "posts");
      const q = query(postData, orderBy("firstDate", "asc"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });

      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      setPosts(postsArray as Post[]);
    };
    fetchData();
  }, []);

  const filteredPosts = posts
    .map((post) => {
      const filteredDays = post.days.filter(
        (day: { name: string }) => day.name === decodedChildName
      );
      if (filteredDays.length > 0) {
        // console.log(
        //   "Before Sorting:",
        //   filteredDays.map((day) => day.date)
        // );

        // // 並べ替え: date フィールドを手動で比較
        // filteredDays.sort((a, b) => {
        //   const [yearA, monthA, dayA] = a.date.split("-").map(Number);
        //   const [yearB, monthB, dayB] = b.date.split("-").map(Number);

        //   // 年、月、日を比較
        //   if (yearA !== yearB) return yearA - yearB;
        //   if (monthA !== monthB) return monthA - monthB;
        //   return dayA - dayB;
        // });

        // // デバッグ用ログ: 並べ替え後の結果を出力して確認
        // console.log(
        //   "After Sorting:",
        //   filteredDays.map((day) => day.date)
        // );

        return { ...post, days: filteredDays };
      }

      return null;
    })
    .filter((post) => post !== null) as Post[];

  return (
    <div>
      <h3 className="linkTitle">
        <Link href="/reservation">一覧に戻る</Link>
      </h3>
      <div className="reservationTitle">
        <h1>
          {decodedChildName ? `${decodedChildName}さんの予約一覧` : "予約一覧"}
        </h1>
      </div>
      <table border={1} className="listTitle">
        <thead>
          <tr className="subTitle">
            <th>園児名</th>
            <th>日にち</th>
            <th>登園時間</th>
            <th>退園時間</th>
            <th>登園実時間</th>
            <th>退園実時間</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, postIndex) => {
            const days = post.days || [];

            return (
              <React.Fragment key={postIndex}>
                {days.map((day: any, dayIndex: any) => (
                  <tr key={dayIndex}>
                    <td>{day.name}</td>
                    <td>{day.date}</td>
                    <td>{day.startTime}</td>
                    <td>{day.endTime}</td>
                    <td>{day.realStartTime}</td>
                    <td>{day.realEndTime}</td>
                    <td>{day.remark}</td>
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
