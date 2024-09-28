import Link from "next/link";
import React from "react";
import styles from "../styles/page.module.css";

function page() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2 className={styles.rogButton}>ログイン画面</h2>
          <form>
            <Link href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2006394583&redirect_uri=https://port-app-yoshida0522s-projects.vercel.app/create&state=uuidv4&scope=profile%20openid">
              LINEでログイン
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default page;
