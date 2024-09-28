// "use client";

// import Signin from "./components/Signin";
// // import "./globals.css";
// import styles from "./styles/page.module.css";

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       <h1 className={styles.mainTitle}>預かり保育予約管理システム</h1>
//       <div>
//         <Signin />
//       </div>
//     </main>
//   );
// }
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./options";
import ClientComponent from "./clientComponent"; // クライアント用のコンポーネントを分ける

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signIn"); // セッションがなければリダイレクト
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div>Welcome: {session?.user?.name}</div>
      <ClientComponent />
    </main>
  );
}
