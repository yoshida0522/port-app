// import { NextApiRequest, NextApiResponse } from 'next';

// const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // 全てのオリジンを許可
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 許可されるHTTPメソッド
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 許可されるHTTPヘッダー

//     if (req.method === 'OPTIONS') {
//         return res.status(200).end(); // OPTIONSリクエストには200で応答
//       }

//     if (req.method === 'POST') {
//     const { name, message } = req.body;

//     const user = localStorage.getItem("userId");

//     const lineMessage = {
//       to: user,  // メッセージを送りたいユーザーのuserId
//       messages: [
//         {
//           type: 'text',
//           text: `名前: ${name}\nメッセージ: ${message}`,
//         },
//       ],
//     };

//     try {
//       const response = await fetch('https://api.line.me/v2/bot/message/push', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
//         },
//         body: JSON.stringify(lineMessage),
//       });

//       if (response.ok) {
//         res.status(200).json({ message: 'メッセージが送信されました' });
//       } else {
//         res.status(response.status).json({ message: 'メッセージ送信に失敗しました' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'サーバーエラーが発生しました' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
