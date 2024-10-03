import axios from "axios";

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

export const sendLineMessage = async (userId: string, message: string) => {
  try {
    await axios.post(
      LINE_API_URL,
      {
        to: userId,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN}`, // 環境変数にアクセストークンを設定
        },
      }
    );
    console.log("メッセージが送信されました");
  } catch (error) {
    console.error("メッセージ送信エラー:", error);
  }
};
