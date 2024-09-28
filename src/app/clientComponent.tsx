"use client"; // クライアントサイド用のコンポーネント

import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import { LogoutButton } from "./components/buttons";

export default function ClientComponent() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string })
      .then(() => {
        console.log("LIFF init succeeded.");
        if (liff.isLoggedIn()) {
          const token = liff.getIDToken();
          setIdToken(token);
        } else {
          liff.login();
        }
      })
      .catch((e) => {
        console.error("LIFF init failed.", e);
        setIdToken("");
      });

    liff.ready.then(async () => {
      const userProfile = await liff.getProfile();
      console.log(userProfile);
      setDisplayName(userProfile.displayName);
    });
  }, []);

  if (idToken === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Hello {displayName}</h1>
      </div>
      <LogoutButton />
    </>
  );
}
