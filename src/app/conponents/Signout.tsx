import { Button } from "@mui/material";
import React from "react";
import { auth } from "../firebase";

function Signout() {
  return (
    <div>
      <Button onClick={() => auth.signOut()}>サインアウト</Button>
    </div>
  );
}

export default Signout;
