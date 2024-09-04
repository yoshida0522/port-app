import { Button } from "@mui/material";
import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

function Signin() {
  function signin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }
  return (
    <div className="signInButton">
      <Button onClick={signin}>ログイン</Button>
    </div>
  );
}

export default Signin;
