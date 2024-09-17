"use client";

import { Button } from "@mui/material";
import React, { useState } from "react";
import db from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // console.log(userName);
    // console.log(passWord);

    const userData = await addDoc(collection(db, "user"), {
      name: userName,
      pass: passWord,
    });
    console.log(userData);
    setUserName("");
    setPassWord("");
    router.push("/");
  };

  return (
    <>
      <div className="newId">
        <div>
          <h3>ユーザーID</h3>
        </div>
        <div>
          <input
            className="inputBox"
            value={userName}
            placeholder="ユーザーIDを入力してください"
            onChange={(e) => setUserName(e.target.value)}
          ></input>
        </div>
        <div>
          <h3>パスワード</h3>
        </div>
        <div>
          <input
            className="inputBox"
            value={passWord}
            placeholder="パスワードを入力してください"
            onChange={(e) => setPassWord(e.target.value)}
          ></input>
        </div>
        <Button onClick={handleClick}>登録</Button>
      </div>
    </>
  );
}

export default Page;
