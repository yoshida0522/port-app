"use client";

import Link from "next/link";
import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import styles from "../styles/page.module.css";
import { useRouter } from "next/navigation";

function Page() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const router = useRouter();

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
      .catch((e: any) => {
        console.error("LIFF init failed.", e);
        setIdToken("");
      });

    liff.ready.then(async () => {
      const userProfile = await liff.getProfile();
      console.log(userProfile);
      setDisplayName(userProfile.displayName);
      // if (idToken) {
      //   router.push("/create");
      // }
    });
  }, []);

  if (idToken === null) {
    return <div>Loading...</div>;
  }

  // router.push("/create");

  return (
    // <div>
    //   <h1>Hello {displayName}</h1>
    // </div>

    // <div>
    //   <div className={styles.lineContainer}>
    //     <div className={styles.lineLoginBox}>
    //       <h2 className={styles.lineLogin}>ログイン</h2>
    //       <Link
    //         className={styles.lineLink}
    //         href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2006394583&redirect_uri=https://port-app-yoshida0522s-projects.vercel.app/create&state=uuidv4&scope=profile%20openid"
    //         // href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid"
    //       >
    //         <img
    //           className={styles.lineButton}
    //           src="/images/btn_login_base.png"
    //           alt="ログインボタン"
    //         />
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    <div>
      <div>
        <Link className={styles.lineLink} href="/create">
          <button>次へ</button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
