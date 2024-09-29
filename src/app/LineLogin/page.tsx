// "use client";

import Link from "next/link";
import React from "react";
import styles from "../styles/page.module.css";

function Page() {
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
