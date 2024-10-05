// import { Client } from "@line/bot-sdk";
// import { createHmac } from "crypto";

// const admin = require("firebase-admin");
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: "https://console.firebase.google.com/project/portfolio-33e86", // 必要に応じてURLを追加
//   });
// }
// const db = admin.firestore();

// const lineConfig = {
//   channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN,
//   channelSecret: process.env.LINE_CHANNEL_SECRET,
// };

// const client = new Client(lineConfig);

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const lineWebhookHandler = async (req, res) => {
//   console.log("Webhook received:", req.body);
//   if (req.method === "POST") {
//     try {
//       const signature = req.headers["x-line-signature"];
//       const rawBody = await getRawBody(req);
//       const validSignature = validateSignature(rawBody, signature);

//       if (!validSignature) {
//         return res.status(403).send("Signature validation failed");
//       }

//       const body = JSON.parse(rawBody);
//       const events = body.events;

//       // 各イベントを処理
//       for (const event of events) {
//         await handleEvent(event);
//         if (event.type === "message" && event.message.type === "text") {
//           const userId = event.source.userId; // ユーザーIDを取得
//           console.log("Received message from user:", userId);

//           // 返信メッセージ
//           const replyMessage = {
//             type: "text",
//             text: `Your user ID is: ${userId}`,
//           };

//           // ユーザーにメッセージを返信
//           await client.replyMessage(event.replyToken, replyMessage);
//         } else if (event.type === "follow") {
//           const userId = event.source.userId; // フォローイベントからユーザーIDを取得
//           console.log("New follower:", userId);
//         }
//       }

//       res.status(200).end();
//     } catch (error) {
//       console.error("Error processing webhook:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   } else {
//     res.status(405).send("Method Not Allowed");
//   }
// };

// // リクエストの生データを取得するヘルパー関数
// const getRawBody = (req) => {
//   return new Promise((resolve, reject) => {
//     let data = "";
//     req.on("data", (chunk) => {
//       data += chunk;
//     });
//     req.on("end", () => {
//       resolve(data);
//     });
//     req.on("error", (err) => {
//       reject(err);
//     });
//   });
// };

// // LINEの署名検証
// const validateSignature = (body, signature) => {
//   const hash = createHmac("sha256", lineConfig.channelSecret)
//     .update(body)
//     .digest("base64");
//   return hash === signature;
// };

// // const handleEvent = async (event) => {
// //   if (event.type === "message" && event.message.type === "text") {
// //     try {
// //       // メッセージ送信
// //       await client.replyMessage(event.replyToken, {
// //         type: "text",
// //         text: `${event.message.text}`,
// //       });
// //       console.log("Message sent successfully");
// //     } catch (error) {
// //       // エラーログをより詳細に出力
// //       console.error("LINE API error:", error);
// //       console.error(
// //         "Error details:",
// //         error.originalError?.response?.data || error.message
// //       );
// //     }
// //     return client.replyMessage(event.replyToken, {
// //       type: "text",
// //       text: `${event.message.text}`,
// //     });
// //   }
// // };

// const handleEvent = async (event) => {
//   const userId = event.source.userId;
//   console.log("Received user ID:", userId);

//   // FirestoreにユーザーIDを保存
//   await db.collection("users").doc(userId).set({
//     userId: userId,
//     timestamp: new Date(),
//   });

//   console.log("ユーザーIDが保存されました:", userId);

//   if (event.type === "message" && event.message.type === "text") {
//     return await client.replyMessage(event.replyToken, {
//       type: "text",
//       text: `あなたのユーザーIDは: ${userId}`,
//     });
//   }
// };

// export default lineWebhookHandler;

//
//
//
//

// import { lineWebhook } from "../../sendLineMessage"; // あなたのlineWebhook関数が定義されている場所

// const lineConfig = {
//   channelSecret: process.env.LINE_CHANNEL_SECRET,
// };

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // すべてのオリジンを許可
//   if (req.method === "POST") {
//     const events = req.body.events;

//     // LINEプラットフォームからのリクエストを処理
//     if (events) {
//       for (const event of events) {
//         const userId = event.source.userId;
//         if (!userId) {
//           console.error("ユーザーIDが取得できませんでした");
//           continue; // 次のイベントに進む
//         }
//         const message = event.message.text;

//         // メッセージの送信処理
//         await lineWebhook(userId, `受け取ったメッセージ: ${message}`);
//       }
//     }

//     // LINEにステータスコード200でレスポンスを返す
//     res.status(200).send("OK");
//   } else {
//     // POSTリクエスト以外には405を返す
//     res.status(405).send("Method Not Allowed");
//   }
// }
