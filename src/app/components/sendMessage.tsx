// import React from "react";
// import Server from "./Server";

// interface User {
//   userId: string; // ユーザーのLINE IDの型を明確にする
// }

// function SendMessage({ user }: { user: User }) {
//   const sendToServer = async () => {
//     try {
//       // サーバーにPOSTリクエストを送る
//       const response = await fetch("/send-message", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user, // ユーザーのLINE ID
//           message: "こんにちは！これはテストです",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("メッセージ送信に失敗しました");
//       }

//       alert("メッセージが送信されました");
//     } catch (error) {
//       console.error("エラーが発生しました", error);
//     }
//   };

//   const express = require("express");
//   const axios = require("axios");
//   const app = express();
//   app.use(express.json());

//   const CHANNEL_ACCESS_TOKEN =
//     "FAxhlZyOgWCI4WUZg1GrXjDwvsJCVWyJP1NJG8ywQXt9GeDvwE2KMHoPqU1mkkpxDvHpJS9e5GwdSed8ylLDbZ/rZnBLDWJd6yY2mxhwODoP/8w1EyYFM5w7GasQkXtgd9j17PWApIIK/V1ikwaGMAdB04t89/1O/w1cDnyilFU=";

//   app.post(
//     "/send-message",
//     (
//       req: { body: { user: any; message: any } },
//       res: {
//         send: (arg0: string) => void;
//         status: (arg0: number) => {
//           (): any;
//           new (): any;
//           send: { (arg0: string): void; new (): any };
//         };
//       }
//     ) => {
//       const { user, message } = req.body;

//       // Messaging APIを使ってユーザーにメッセージを送る
//       axios
//         .post(
//           "https://api.line.me/v2/bot/message/push",
//           {
//             to: user,
//             messages: [
//               {
//                 type: "text",
//                 text: message,
//               },
//             ],
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then(() => {
//           res.send("メッセージが送信されました");
//         })
//         .catch((error: any) => {
//           console.error("メッセージ送信に失敗しました", error);
//           res.status(500).send("メッセージ送信に失敗しました");
//         });
//     }
//   );

//   app.listen(3000, () => {
//     console.log("Server is running on port 3000");
//   });
// }

// export default SendMessage;
