import { Client } from "@line/bot-sdk";
import { createHmac } from "crypto";

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(lineConfig);

export const config = {
  api: {
    bodyParser: false,
  },
};

const lineWebhookHandler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const signature = req.headers["x-line-signature"];
      const rawBody = await getRawBody(req);
      const validSignature = validateSignature(rawBody, signature);

      if (!validSignature) {
        return res.status(403).send("Signature validation failed");
      }

      const body = JSON.parse(rawBody);
      const events = body.events;

      for (const event of events) {
        await handleEvent(event);
      }
      res.status(200).end();
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

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

const validateSignature = (body, signature) => {
  const hash = createHmac("sha256", lineConfig.channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
};

const handleEvent = async (event) => {
  if (event.type === "message" && event.message.type === "text") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `${event.message.text}`,
    });
  }
};

export default lineWebhookHandler;
