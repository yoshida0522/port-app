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
        return { ...post, days: filteredDays };
      }

      return null;
    })
    .filter((post) => post !== null) as Post[];

  return (
    <div>
      <h3 className="center">
        <Link href="/reservation">一覧に戻る</Link>
      </h3>
      <div className="center">
        <h1>
          {decodedChildName ? `${decodedChildName}さんの予約一覧` : "予約一覧"}
        </h1>
      </div>
      <table border={1} className="listTitle">
        <thead>
          <tr className="subTitle">
            <th>園児名</th>
            <th>日にち</th>
            <th>登園予約時間</th>
            <th>降園予約時間</th>
            <th>登園時間</th>
            <th>降園時間</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, postIndex) => {
            const days = post.days || [];

            return (
              <React.Fragment key={postIndex}>
                {days.map((day, dayIndex) => (
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
