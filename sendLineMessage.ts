import axios from "axios";

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

export const sendLineMessage = async (userId: string, message: string) => {
  console.log("ユーザーID:", userId);
  console.log("メッセージ:", message);

  if (!process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("アクセストークンが設定されていません");
    return;
  }

  try {
    const response = await axios.post(
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );
    console.log("メッセージが送信されました", response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Axiosのエラーの場合
      console.error(
        "メッセージ送信エラー:",
        error.response?.data || error.message
      );
    } else {
      // その他のエラー
      console.error("メッセージ送信エラー:", error);
    }
  }
};
