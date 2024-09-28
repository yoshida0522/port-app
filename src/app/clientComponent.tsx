"use client";

import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import { LogoutButton } from "./components/buttons";

export default function ClientComponent() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // エラー表示用

  useEffect(() => {
    async function initializeLiff() {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string });
        console.log("LIFF init succeeded.");

        if (liff.isLoggedIn()) {
          const token = liff.getIDToken();
          setIdToken(token);

          const userProfile = await liff.getProfile();
          setDisplayName(userProfile.displayName);
        } else {
          liff.login();
        }
      } catch (e) {
        console.error("LIFF init failed:", e);
        setError("LIFF initialization failed.");
      }
    }

    initializeLiff();
  }, []);

  // エラーが発生した場合はエラーメッセージを表示
  if (error) {
    return <div>Error: {error}</div>;
  }

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
