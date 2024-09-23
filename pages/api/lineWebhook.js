import { Client } from "@line/bot-sdk";
import { createHmac } from "crypto";

// LINEのチャネル設定
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(lineConfig);

// APIルートの設定
export const config = {
  api: {
    bodyParser: false, // LINE Webhookではbody parserを無効にする必要があります
  },
};

// 匿名関数を変数に代入
const lineWebhookHandler = async (req, res) => {
  if (req.method === "POST") {
    const signature = req.headers["x-line-signature"];

    // bodyの生データを取得
    const rawBody = await getRawBody(req);

    // LINE Webhookの署名を検証
    const validSignature = validateSignature(rawBody, signature);
    if (!validSignature) {
      return res.status(403).send("Signature validation failed");
    }

    // JSONにパース
    const body = JSON.parse(rawBody);
    const events = body.events;

    events.map((event) => {
      handleEvent(event);
    });
    res.status(200).end();
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

// 生のリクエストボディを取得
const getRawBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
};

// 署名を検証
const validateSignature = (body, signature) => {
  const hash = createHmac("sha256", lineConfig.channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
};

// 関数をデフォルトエクスポート
export default lineWebhookHandler;

const handleEvent = async (event) => {
  if (event.type === "message" && event.message.type === "text") {
    // メッセージに応答する処理
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `${event.message.text}`,
    });
  }
};
