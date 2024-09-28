import React, { useEffect, useState } from "react";
import liff from "@line/liff";

function LineRogin() {
  const [loginStatus, setLoginStatus] = useState("未ログイン");

  useEffect(() => {
    liff
      .init({ liffId: "2006394583-9qr0JZEk" })
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          setLoginStatus("ログイン済み");
        }
      })
      .catch((err) => {
        console.error("LIFF init failed", err);
      });
  }, []);

  return (
    <div>
      <h1 id="title">{loginStatus}</h1>
    </div>
  );
}

export default LineRogin;
