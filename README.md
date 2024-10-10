# 預かり保育予約管理アプリ

## アプリ URL

・https://azukari-child.vercel.app/

デモアカウント  
(管理者用)  
ユーザー ID：demo  
パスワード：1234

(一般ユーザー用)  
ユーザー ID: test  
パスワード：1111

## アプリについて

幼稚園の延長保育の管理アプリです。

**ユーザー側**
保護者は LINE の公式アカウントにある申込ページから必要事項を入力して送信すると  
自分の LINE に送信内容が送られてきます。
また、予約確認では当日以降の予約の確認と、予約の変更ができます。  
※当日の予約変更はできません。

**幼稚園側**
ログインは、管理者 ID または一般ユーザー ID のどちらかでログインしてください。  
管理者 ID でログインした場合は、予約一覧の他に新規登録と ID 管理のメニューが表示されます。  
※一般ユーザー ID の場合は、予約一覧のみの表示になります。

**保護者側**
保護者が送信した予約内容の確認ができます。  
カレンダーで日にちを選択すると、その日の予約が表示されます。  
園児名をクリックすることで、園児別の予約も確認できます。

## 機能一覧

**ユーザー側**

- ログイン機能(LINE 認証)
- 予約申込(1 度に 5 件まで)
- 予約内容のリマインド機能
- 予約確認(一覧)

**幼稚園側**

- ログイン機能(ユーザー ID、パスワード)
- 新規登録
- ID 管理(管理者設定)
- 予約一覧
- 検索・編集・削除・保存
- 園児別の全予約一覧

## 使用技術

**フロントエンド**

- HTML
- CSS
- TypeScript
- Next.js(React)
  **バックエンド**
- Firebase  
  **バージョン管理**
- GitHub  
  **デプロイ**
- Vercel  
  **API**
- LINE ログイン(認証)
- LINE Messaging API(リマインド)

```bash
.env
NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
LINE_CHANNEL_SECRET="YOUR_CHANNEL_SECRET"
NEXT_PUBLIC_LIFF_ID="YOUR_LIFF_ID"
NEXT_PUBLIC_LIFF_USER_ID="YOUR_LIFF_USER_ID"
```
