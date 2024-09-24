import { Button } from "@mui/material";
import React, { useState } from "react";
import { auth } from "../firebase";
import "../globals.css";
// import Signin from "./Signin";
import { useRouter } from "next/navigation";

function Signout() {
  const [isLogOut, setIsLogOut] = useState(true);
  const router = useRouter();

  const handleClick = async () => {
    await auth.signOut();
    localStorage.removeItem("loggedInUser");
    setIsLogOut(false);
    // router.refresh();
  };

  // if (!isLogOut) {
  //   return <Signin />; // ログイン成功時にMainコンポーネントを表示
  // }

  return (
    <div className="rogButton">
      {/* <Button onClick={() => auth.signOut()}>ログアウト</Button>
       */}
      <Button onClick={handleClick}>ログアウト</Button>
    </div>
  );
}

export default Signout;
