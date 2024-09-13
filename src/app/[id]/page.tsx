"use client";

import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import db from "../firebase";
import { useRouter } from "next/router";
// import { useRouter } from "next/navigation";

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

function Page() {
  const [posts, setPosts] = useState<Post[]>([]);

  // エラー箇所
  // const router = useRouter();
  // const { name } = router.query;
  // console.log({ name });

  useEffect(() => {
    const fetchData = async () => {
      const postData = collection(db, "posts");
      const querySnapshot = await getDocs(postData);

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
      const filteredName = post.days.filter(
        (day: { name: string }) => day.name === "ささき"
      );

      if (filteredName.length > 0) {
        return { ...post, days: filteredName };
      }

      return null;
    })
    .filter((post) => post !== null) as Post[];

  return (
    <>
      <h3 className="linkTitle">
        <Link href="/">トップページに戻る</Link>
      </h3>
      <div className="reservationTitle">
        <h1>予約一覧</h1>
      </div>
      <table border={1} className="listTitle">
        <tbody>
          <tr className="subTitle">
            <th>園児名</th>
            <th>日にち</th>
            <th>登園時間</th>
            <th>退園時間</th>
            <th>登園実時間</th>
            <th>退園実時間</th>
            <th>備考欄</th>
          </tr>
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
    </>
  );
}

export default Page;
