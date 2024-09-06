import { Button } from "@mui/material";
import React from "react";
import { auth } from "../firebase";
import "../globals.css";

function Signout() {
  return (
    <div className="rogButton">
      <Button onClick={() => auth.signOut()}>ログアウト</Button>
    </div>
  );
}

export default Signout;
