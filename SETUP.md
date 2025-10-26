# 🚀 セットアップガイド

このガイドでは、Music Mappingアプリを最初から最後までセットアップする手順を説明します。

## 📋 目次

1. [前提条件の確認](#前提条件の確認)
2. [Supabaseのセットアップ](#supabaseのセットアップ)
3. [OpenAI APIのセットアップ](#openai-apiのセットアップ)
4. [ローカル開発環境のセットアップ](#ローカル開発環境のセットアップ)
5. [Vercelへのデプロイ](#vercelへのデプロイ)
6. [トラブルシューティング](#トラブルシューティング)

---

## 1. 前提条件の確認

以下がインストールされていることを確認してください：

- **Node.js** (v18以上)
- **npm** または **yarn**
- **Git**

バージョン確認:
```bash
node --version  # v18.0.0 以上
npm --version   # 9.0.0 以上
git --version
```

---

## 2. Supabaseのセットアップ

#### ステップ1: プロジェクト作成

1. [Supabase](https://supabase.com) にアクセス
2. 「New Project」をクリック
3. 以下を入力:
   - **Name**: music-mapping（任意）
   - **Database Password**: 強力なパスワードを生成
   - **Region**: 最寄りのリージョンを選択
4. 「Create new project」をクリック（数分かかります）

#### ステップ2: APIキーの取得

1. プロジェクトダッシュボードで「Settings」→「API」に移動
2. 以下をメモ:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

#### ステップ3: データベーススキーマの作成

1. ダッシュボードで「SQL Editor」に移動
2. 「New query」をクリック
3. プロジェクトの `supabase/schema.sql` の内容をコピー&ペースト
4. 「Run」をクリック

確認方法:
- 「Table Editor」で `maps` と `songs` テーブルが作成されていることを確認

---

## 3. OpenAI APIのセットアップ

#### ステップ1: APIキー作成

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. アカウントにログインまたは作成
3. 左メニューから「API keys」を選択
4. 「Create new secret key」をクリック
5. キー名を入力（例: music-mapping）
6. 生成されたキーをメモ（**一度しか表示されません！**）

#### ステップ2: 課金設定（必要に応じて）

1. 「Settings」→「Billing」に移動
2. 支払い方法を追加
3. 使用量制限を設定（推奨: $10/月）

---

## 4. ローカル開発環境のセットアップ

### ステップ1: リポジトリのクローン

```bash
git clone https://github.com/yourusername/music-mapping.git
cd music-mapping
```

### ステップ2: 依存関係のインストール

```bash
npm install
```

### ステップ3: 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成:

```bash
# テンプレートをコピー
cp env.template .env.local
```

`.env.local` を編集:

```env
# Supabase（ステップ2.1で取得）
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### ステップ4: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開く

⚠️ **注意**: この時点では、検索や曲の追加は動作しません（APIがないため）

---

## 5. Vercelへのデプロイ

### ステップ1: Vercelアカウント作成

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでサインアップ

### ステップ2: プロジェクトのインポート

#### オプション A: Vercel Web UI

1. Vercelダッシュボードで「Add New...」→「Project」
2. GitHubリポジトリを選択
3. 「Import」をクリック

#### オプション B: Vercel CLI

```bash
# CLIをインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel
```

### ステップ3: 環境変数の設定

Vercelダッシュボードで:

1. プロジェクトを選択
2. 「Settings」→「Environment Variables」
3. 以下を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production, Preview, Development |
| `OPENAI_API_KEY` | OpenAIで取得 | Production, Preview, Development |

### ステップ4: 再デプロイ

環境変数を追加した後:

1. 「Deployments」タブに移動
2. 最新のデプロイメントの「...」メニューをクリック
3. 「Redeploy」を選択

または:

```bash
vercel --prod
```

### ステップ5: 動作確認

1. デプロイされたURLにアクセス
2. 新しいマップを作成
3. 曲を検索して追加
4. 散布図で表示されることを確認

---

## 6. トラブルシューティング

### 問題: Supabaseに接続できない

**エラー**: `Invalid Supabase URL` または `No API key`

**解決策**:
1. `.env.local` のURLとキーが正しいか確認
2. 環境変数名が `VITE_` で始まっているか確認
3. 開発サーバーを再起動 (`npm run dev`)

### 問題: 曲検索が動作しない

**エラー**: `iTunes検索に失敗しました`

**解決策**:
1. インターネット接続を確認
2. iTunes Search APIは無料・認証不要なので、通常は問題なし
3. レート制限に達している可能性（まれ）
4. Vercelのデプロイメントログを確認

コマンド:
```bash
vercel logs
```

### 問題: OpenAI APIエラー

**エラー**: `Rate limit exceeded` または `Insufficient quota`

**解決策**:
1. OpenAIの使用量を確認
2. 課金設定を確認
3. APIキーが有効か確認

### 問題: データベースエラー

**エラー**: `relation "maps" does not exist`

**解決策**:
1. Supabase SQL Editorで `schema.sql` を再実行
2. Table Editorでテーブルが作成されているか確認

### 問題: ビルドエラー

**エラー**: `Module not found` または型エラー

**解決策**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 型チェック
npm run type-check
```

### デバッグのヒント

#### ブラウザコンソールを確認

1. F12でデベロッパーツールを開く
2. Consoleタブでエラーメッセージを確認

#### Vercelログを確認

```bash
# 最新のログを確認
vercel logs

# 特定のデプロイメントのログ
vercel logs [deployment-url]
```

#### Supabaseログを確認

1. Supabaseダッシュボード
2. 「Logs」→「Postgres Logs」

---

## 🎉 完了！

これで完全にセットアップできました！

次のステップ:
- [ ] マップを作成してみる
- [ ] 好きな曲を追加してみる
- [ ] 友達とシェアする

質問や問題がある場合は、GitHubのIssueを作成してください。

