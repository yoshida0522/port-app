// import { NextApiRequest, NextApiResponse } from "next";

// const lineEndpoint = "https://api.line.me/v2/bot/message/push";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { childName, days, userId } = req.body;

//     const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

//     const message = days
//       .map((day) => {
//         return `【園児名】${day.name}\n【日にち】${day.date}\n【登園時間】${day.startTime}\n【お迎え時間】${day.endTime}\n【備考】${day.remark}\n`;
//       })
//       .join("\n");

//     const payload = {
//       to: userId,
//       messages: [
//         {
//           type: "text",
//           text: message,
//         },
//       ],
//     };

//     try {
//       const response = await fetch(lineEndpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${lineToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         return res.status(response.status).json({ error: data.message });
//       }

//       res.status(200).json({ success: true, data });
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import { Client } from "@line/bot-sdk";

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(lineConfig);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { childName, days, userId } = req.body;

    const messages = days.map((day) => ({
      type: "text",
      text: `${childName}さんの予定は以下の通りです：\n${day.date} ${day.startTime} - ${day.endTime}`,
    }));

    try {
      await Promise.all(messages.map((msg) => client.pushMessage(userId, msg)));
      res.status(200).json({ message: "Messages sent successfully" });
    } catch (error) {
      // 詳細なエラー出力
      console.error(
        "LINEメッセージ送信失敗:",
        error.response?.data || error.message
      );
      res
        .status(500)
        .json({
          error: "Failed to send LINE message",
          details: error.response?.data,
        });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
