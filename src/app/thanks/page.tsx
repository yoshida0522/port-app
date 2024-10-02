import React, { useEffect, useState } from "react";
// import styles from "./styles/page.module.css";

function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  return (
    <div>
      <h1>送信しました!</h1>
      {userId ? <p>ユーザーID: {userId}</p> : <p>ユーザーIDが見つかりません</p>}
    </div>
  );
}

export default Page;
