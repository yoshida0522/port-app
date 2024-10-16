# 預かり保育予約管理アプリ

## アプリ URL

**幼稚園側管理アプリ**  
・https://azukari-child.vercel.app/

デモアカウント  
(管理者用)  
ユーザー ID：demo  
パスワード：1234

(一般ユーザー用)  
ユーザー ID: test  
パスワード：1111
<br>

**保護者用 LINE 公式アカウント**

アカウント名：預かり予約  
・https://lin.ee/BJHOPtH  
<br>
<br>

## アプリについて

幼稚園の延長保育の管理アプリです。

**保護者側**  
※スマホでの操作を想定しています。
<br>
<br>

【 LINE 公式アカウント画面 】

![LINEメニュー画面](https://github.com/user-attachments/assets/1844d9c2-7183-4b0c-bd76-8e26e5a7b0b5)
<br>
<br>

- 予約申込  
   保護者は LINE の公式アカウントにある申込ページから必要事項を入力して送信すると  
   自分の LINE に送信内容が送られてきます。
  <br>
  <br>
  ![予約申込画面](https://github.com/user-attachments/assets/66aa5344-76ec-46f9-ba7e-4cf31941f5c3)
  <br>
  <br>

- 予約確認  
   予約確認では当日以降の予約の確認と、翌日以降の予約の変更ができます。  
   ※当日の予約変更はできません。また、前日以前の予約は表示されません。
  <br>
  <br>
  ![予約確認](https://github.com/user-attachments/assets/eb67a3d3-9481-4b29-86dc-8b53d96ad17c)  
  <br>
  <br>
  <br>

**幼稚園側**  
※PC での操作を想定しています。

- ログイン  
   ログインは、管理者 ID または一般ユーザー ID のどちらかでログインしてください。
  <br>

  ![ログイン画面](https://github.com/user-attachments/assets/eb3c3472-1c64-4d18-92a4-16a58031a460)
  <br>
  <br>

- 新規登録・ID 管理  
   管理者 ID でログインした場合は、予約一覧の他に新規登録と ID 管理のメニューが表示されます。  
   ※一般ユーザー ID の場合は、予約一覧のみの表示になります。
  <br>

【 管理者用ホーム画面 】  
![管理者用ホーム画面](https://github.com/user-attachments/assets/f8433360-9afe-48e3-b6fe-034fb1566b06)
<br>

【 新登録画面 】  
![新規登録画面](https://github.com/user-attachments/assets/8a2f851f-b352-4124-b128-c05089d4cacd)
<br>

【 ID 管理画面 】  
![ID管理画面](https://github.com/user-attachments/assets/d8dc7bb4-24c6-4b91-838f-f86de6507eab)
<br>

【 一般ユーザー用ホーム画面 】  
![一般ユーザー用ホーム画面](https://github.com/user-attachments/assets/570dba0b-2219-4954-b68d-6512d8748c34)
<br>
<br>

- 予約一覧  
   予約一覧で保護者が送信した予約内容が確認できます。  
   カレンダーの日付を変えることで、指定した日の予約も確認できます。  
  <br>

![予約一覧画面](https://github.com/user-attachments/assets/248ca74a-76ba-45c6-854c-9be22111bfec)
<br>
<br>

- 園児別の一覧  
   予約一覧で表示されている園児名をクリックすることで、選択した園児の予約一覧を全て確認することができます。
  <br>

![園児別画面](https://github.com/user-attachments/assets/589f9d26-b273-4eaf-a67c-b1586683b17b)
<br>  
<br>

## 機能一覧

**保護者側機能**

- ログイン機能(LINE 認証)
- 予約申込(1 度に 5 件まで)
- 予約内容のリマインド機能
- 予約確認(一覧)

**幼稚園側機能**

- ログイン機能(ユーザー ID、パスワード)
- 新規登録
- ID 管理(管理者設定)
- 予約一覧
- 検索・編集・削除・保存
- 園児別の全予約一覧

## 使用技術

**【フロントエンド】**

- HTML
- CSS
- TypeScript
- Next.js(React)

**【バックエンド】**

- Firebase

**【バージョン管理】**

- GitHub

**【デプロイ】**

- Vercel

**【API】**

- LINE ログイン(認証)
- LINE Messaging API(リマインド)
  <br>
  <br>

## 注意点

LINE の API を使用するには下記の設定が必要です。  
事前に公式アカウントから取得をしてください。  
<br>
.env

```bash
NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
LINE_CHANNEL_SECRET="YOUR_CHANNEL_SECRET"
NEXT_PUBLIC_LIFF_ID="YOUR_LIFF_ID"
NEXT_PUBLIC_LIFF_USER_ID="YOUR_LIFF_USER_ID"
```
