# TechShare（技術ナレッジ共有アプリ）

## 1. アプリの概要
技術記事の作成・閲覧・編集・削除・検索ができるナレッジ共有Webアプリケーションです。記事本文はMarkdown形式で記述でき、作成画面でのリアルタイムプレビューや詳細画面での整形表示に対応しています。

## 2. 技術スタックと選んだ理由
- **React / Vite**：コンポーネント単位で画面を作りやすく、開発サーバーの起動や画面更新が高速なため採用しました。
- **React Router (`react-router-dom`)**：記事一覧・記事詳細・新規作成・編集などの画面遷移を整理するため使用しました。
- **Tailwind CSS**：ユーティリティクラスを使ってレイアウトやボタン、フォームなどの見た目を効率よく整えるために採用しました。
- **react-markdown**：記事本文のMarkdown記法（見出しやリストなど）を画面上で読みやすく表示するために使用しました。
- **json-server / Render / Vercel**：記事データのAPI管理と公開環境構築のために利用しました。

## 3. 工夫した点・難しかった点
- **工夫した点**：記事一覧のカード抜粋ではMarkdown記号を取り除いて読みやすくしつつ、詳細画面や編集プレビューでは見出しやリストとして整形表示されるようにしました。また、記事編集時に元の作成日が上書きされないよう保持する工夫をしました。
- **難しかった点**：環境変数（`VITE_API_URL`）を使った本番環境とローカル環境の切り替え、デプロイ後のルーティング（リロード時の表示）の確認に時間がかかりました。

## 4. デモURL
- フロントエンド公開URL：https://tech-share-app-gilt.vercel.app/
- バックエンドAPI URL：https://tech-share-app-ny3e.onrender.com

## 5. ローカルでの起動手順
1. リポジトリをクローンします。
```bash
git clone [https://github.com/atk1253t-commits/tech-share-app.git](https://github.com/atk1253t-commits/tech-share-app.git)
cd tech-share-app
2. 依存パッケージをインストールします。
npm install
3. ローカルAPIサーバー（json-server）を起動します。
npx json-server --watch db.json --port 3000
4. 別ターミナルでフロントエンドの開発サーバーを起動します。
npm run dev
