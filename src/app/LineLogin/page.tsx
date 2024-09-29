// "use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/page.module.css";

function Page() {
  // useEffect(() => {
  //   const clientId = process.env.NEXT_PUBLIC_LIFF_ID;
  //   console.log("Client ID:", clientId);

  //   if (!process.env.NEXT_PUBLIC_LINE_REDIRECT_URI) {
  //     throw new Error("LINEのリダイレクトURIが設定されていません");
  //   }

  //   const redirectUri = encodeURIComponent(
  //     process.env.NEXT_PUBLIC_LINE_REDIRECT_URI
  //   );
  //   console.log("Redirect URI:", redirectUri);
  // }, []);

  // const state = uuidv4();
  // const clientId = process.env.NEXT_PUBLIC_LIFF_ID;
  // if (!process.env.NEXT_PUBLIC_LINE_REDIRECT_URI) {
  //   throw new Error("LINEのリダイレクトURIが設定されていません");
  // }

  // const redirectUri = encodeURIComponent(
  //   process.env.NEXT_PUBLIC_LINE_REDIRECT_URI
  // );

  // console.log(clientId);
  // console.log(redirectUri);
  // console.log(state);

  return (
    <div>
      <div className={styles.lineContainer}>
        <div className={styles.lineLoginBox}>
          <h2 className={styles.lineLogin}>ログイン</h2>
          {/* <form> */}
          <Link
            className={styles.lineLink}
            href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2006394583&redirect_uri=https://port-app-yoshida0522s-projects.vercel.app/create&state=uuidv4&scope=profile%20openid"
            // href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid"
          >
            <img
              className={styles.lineButton}
              src="/images/btn_login_base.png"
              alt="ログインボタン"
            />
          </Link>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
}

export default Page;
