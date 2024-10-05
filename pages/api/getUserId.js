// export default function handler(req, res) {
//   res.status(200).json({ userId: "testUserId" });
// }

// export default async function handler(req, res) {
//   const { code } = req.query; // 認可コードを取得
//   const redirectUri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI; // リダイレクトURIを取得
//   const clientId = process.env.LINE_CHANNEL_ID; // チャネルIDを取得
//   const clientSecret = process.env.LINE_CHANNEL_SECRET; // チャネルシークレットを取得

//   try {
//     // アクセストークンを取得
//     const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "authorization_code",
//         code: code, // 取得した認可コード
//         redirect_uri: redirectUri, // リダイレクトURI
//         client_id: clientId, // チャネルID
//         client_secret: clientSecret, // チャネルシークレット
//       }),
//     });

//     if (!tokenResponse.ok) {
//       const errorText = await tokenResponse.text();
//       console.error(`Token response error: ${errorText}`);
//       throw new Error(
//         `Failed to fetch token: ${tokenResponse.status} ${tokenResponse.statusText}`
//       );
//     }

//     const tokenData = await tokenResponse.json();
//     const accessToken = tokenData.access_token;

//     // ユーザー情報を取得
//     const userInfoResponse = await fetch("https://api.line.me/v2/profile", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!userInfoResponse.ok) {
//       const errorText = await userInfoResponse.text();
//       console.error(`User info response error: ${errorText}`);
//       throw new Error(
//         `Failed to fetch user info: ${userInfoResponse.status} ${userInfoResponse.statusText}`
//       );
//     }

//     const userInfo = await userInfoResponse.json();
//     const lineUserId = userInfo.userId;

//     // ユーザーIDを返す
//     res.status(200).json({ userId: lineUserId });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// }
