import { NextApiRequest, NextApiResponse } from "next";
import * as line from "@line/bot-sdk";

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};

const client = new line.Client(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const message = req.body.message;

    await client.pushMessage("U6a934c65da47bd1a06d768e5e35da61f", {
      type: "text",
      text: message,
    });

    res
      .status(200)
      .json({ message: `${message}というメッセージが送信されました。` });
  } catch (e) {
    res.status(500).json({ message: `error! ${e} ` });
  }
}
