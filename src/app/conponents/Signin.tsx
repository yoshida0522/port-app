import { Button } from "@mui/material";
import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import "../globals.css";
import Link from "next/link";

function Signin() {
  function signin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <div className="rogButton">
      <div>
        <input
          className="inputBox"
          placeholder="ユーザーIDを入力してください"
        ></input>
      </div>
      <div>
        <input
          className="inputBox"
          placeholder="パスワードを入力してください"
        ></input>
      </div>
      <div>
        <Button onClick={signin}>ログイン</Button>
      </div>
      <div>
        <Link href="newRegistration/">新規登録</Link>
      </div>
    </div>
  );
}

export default Signin;
