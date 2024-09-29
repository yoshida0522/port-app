// export default function handler(req, res) {
//   res.status(200).json({ userId: "testUserId" });
// }

export default async function handler(req, res) {
  const { code } = req.query; // 認証フローから受け取ったコード
  const redirectUri =
    "https://port-app-yoshida0522s-projects.vercel.app/create"; // リダイレクトURI
  const clientId = "2006394583-9qr0JZEk"; // チャネルID
  const clientSecret = "x/ag3vz6W38FBNkyEMSoC5doF7kBMELs6wiSuchQjY0="; // チャネルシークレット

  try {
    // アクセストークンを取得
    const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // ユーザー情報を取得
    const userInfoResponse = await fetch("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userInfo = await userInfoResponse.json();
    const lineUserId = userInfo.userId; // LINEユーザーIDを取得

    // ユーザーIDを返す
    res.status(200).json({ userId: lineUserId });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Failed to fetch user ID" });
  }
}
