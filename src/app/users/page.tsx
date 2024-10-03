"use client";

import { useEffect, useState } from "react";
import db from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import styles from "../styles/page.module.css";
import liff from "@line/liff";

interface Day {
  date: string;
  name: string;
  userId: string;

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

const UsersPage = () => {
  // const decodedChildName = decodeURIComponent(childName || "");
  // const storedUserId = localStorage.getItem("userId");
  // const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState("");

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

  useEffect(() => {
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string })
      .then(() => {
        console.log("LIFFの初期化に成功しました");
        if (liff.isLoggedIn()) {
          const token = liff.getIDToken();
          setIdToken(token);
        } else {
          liff.login();
        }
      })
      .catch((e: any) => {
        console.error("LIFFの初期化に失敗しました", e);
        setIdToken("");
      });

    liff.ready.then(async () => {
      const userProfile = await liff.getProfile();
      console.log(userProfile);
      setUser(userProfile.userId);
    });
  }, []);

  if (idToken === null) {
    return <div>Loading...</div>;
  }

  console.log(user);

  const filteredPosts = posts
    .map((post) => {
      const filteredDays = post.days.filter(
        (day: { userId: string }) => day.userId === user
      );
      if (filteredDays.length > 0) {
        return { ...post, days: filteredDays };
      }

      return null;
    })
    .filter((post) => post !== null) as Post[];

  return (
    <div className={styles.childImg}>
      {/* <h3 className={styles.childCenter}>
        <Link href="/reservation">一覧に戻る</Link>
      </h3> */}
      {/* <img src="/images/音符.png" alt="背景画像" /> */}
      <div className={styles.childCenter}>
        <h1>{user ? `${user}さんの予約一覧` : "予約一覧"}</h1>
      </div>
      <table border={1} className={styles.childListTitle}>
        <thead>
          <tr className={styles.childSubTitle}>
            <th>園児名</th>
            <th>日にち</th>
            <th>登園予約時間</th>
            <th>降園予約時間</th>
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

export default UsersPage;
