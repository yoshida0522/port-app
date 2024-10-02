import { NextApiRequest, NextApiResponse } from 'next';

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, message } = req.body;

    const lineMessage = {
      to: '受信者のLINEユーザーID',  // メッセージを送りたいユーザーのuserId
      messages: [
        {
          type: 'text',
          text: `名前: ${name}\nメッセージ: ${message}`,
        },
      ],
    };

    try {
      const response = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(lineMessage),
      });

      if (response.ok) {
        res.status(200).json({ message: 'メッセージが送信されました' });
      } else {
        res.status(response.status).json({ message: 'メッセージ送信に失敗しました' });
      }
    } catch (error) {
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}