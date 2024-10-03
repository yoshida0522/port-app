"use client";

import { useEffect, useState } from "react";
import db from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_USER_ID as string,
        });
        console.log("LIFFの初期化に成功しました");

        if (liff.isLoggedIn()) {
          const token = liff.getIDToken();
          setIdToken(token);
        } else {
          liff.login();
        }

        const userProfile = await liff.getProfile();
        console.log(userProfile);
        setUser(userProfile.userId);
        setName(userProfile.displayName);
      } catch (e) {
        console.error("LIFFの初期化に失敗しました", e);
        setIdToken("");
      } finally {
        setLoading(false);
      }
    };
    initializeLiff();
  }, []);

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
    };
    fetchData();
  }, []);

  if (idToken === null || loading) {
    return <div>Loading...</div>;
  }

  console.log(user);

  const filteredPosts = posts
    .map((post) => {
      const filteredDays = post.days.filter((day) => {
        const dayDate = new Date(day.date);
        const today = new Date();

        // 当日以降の日付を残す
        return dayDate >= today && day.userId === user;
      });
      return filteredDays.length > 0 ? { ...post, days: filteredDays } : null;
    })
    .filter((post) => post !== null) as Post[];

  return (
    <div className={styles.childImg}>
      <div className={styles.childCenter}>
        <h1>{name ? `${name}さんの予約一覧` : "予約一覧"}</h1>
      </div>
      <table border={1} className={styles.childListTitle}>
        <thead>
          <tr className={styles.childSubTitle}>
            <th>園児名</th>
            <th>日にち</th>
            <th>登園時間</th>
            <th>お迎え時間</th>
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
