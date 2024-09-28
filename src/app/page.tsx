"use client";

import Signin from "./components/Signin";
// import "./globals.css";
import styles from "./styles/page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.mainTitle}>預かり保育予約管理システム</h1>
      <div>
        <Signin />
      </div>
    </main>
  );
}

// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "./options";
// import ClientComponent from "./clientComponent"; // クライアント用のコンポーネントを分ける

// export default async function Home() {
//   let session = null;

//   try {
//     session = await getServerSession(authOptions);
//     console.log("Session:", session);

//     if (!session) {
//       console.log("No session found, redirecting...");
//       redirect("/sign_in"); // リダイレクトを実行
//       // return; ここで処理を停止
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error fetching session:", error.message);
//       return <div>Server Error: {error.message}</div>; // エラー内容を表示
//     } else {
//       console.error("Unknown error occurred:", error);
//       return <div>Server Error: Unknown error occurred</div>;
//     }
//   }

//   // sessionがある場合のみここに到達する
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center">
//       <div>Welcome: {session.user?.name}</div>
//       <ClientComponent />
//     </main>
//   );
// }
