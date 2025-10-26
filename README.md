# 🎵 Music Mapping

音楽を2次元マップ上に可視化するWebアプリケーションです。AIを活用して、曲の特徴を指定した軸に基づいて自動的にマッピングします。

## ✨ 特徴

- 🎨 **直感的なビジュアライゼーション**: 散布図で曲を可視化
- 🤖 **AI駆動のマッピング**: OpenAI APIで曲の特徴を自動分析
- 🎵 **Spotify統合**: 曲の検索とプレビュー再生
- 💾 **データベース管理**: Supabase (PostgreSQL) でデータを永続化
- 🚀 **Vercelデプロイ対応**: サーバーレス関数で簡単デプロイ
- 📱 **レスポンシブデザイン**: モバイルからデスクトップまで対応

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────────┐
│         フロントエンド (React + Vite)         │
│  - React Router (画面遷移)                   │
│  - Tailwind CSS (スタイリング)                │
│  - Recharts (散布図)                         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│      Vercel Serverless Functions (API)      │
│  - /api/search-songs (Spotify検索)           │
│  - /api/create-map (マップ作成)               │
│  - /api/add-song (曲の追加)                  │
└──────────────┬──────────────────────────────┘
               │
               ├─────────────┬─────────────────┐
               ▼             ▼                 ▼
       ┌──────────┐   ┌──────────┐    ┌──────────┐
       │ Supabase │   │ Spotify  │    │  OpenAI  │
       │   (DB)   │   │   API    │    │   API    │
       └──────────┘   └──────────┘    └──────────┘
```

### 技術スタック

**フロントエンド:**
- React 18 + TypeScript
- Vite (ビルドツール)
- React Router (ルーティング)
- Tailwind CSS + shadcn/ui (UI)
- Recharts (可視化)

**バックエンド:**
- Vercel Serverless Functions
- Supabase (PostgreSQL)
- OpenAI API (GPT-4o-mini)
- iTunes Search API

## 🚀 セットアップ

### 1. 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- OpenAI APIキー

### 2. リポジトリのクローン

```bash
git clone https://github.com/yourusername/music-mapping.git
cd music-mapping
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. Supabaseのセットアップ

#### 4.1 Supabaseプロジェクトを作成

1. [Supabase](https://supabase.com) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトURLとanon keyをメモ

#### 4.2 データベーススキーマの作成

Supabase Dashboard の SQL Editor で以下を実行:

```bash
# スキーマファイルをコピー&ペーストして実行
cat supabase/schema.sql
```

または、Supabase CLIを使用:

```bash
npm install -g supabase
supabase db push
```

### 5. 環境変数の設定

#### 5.1 フロントエンド用環境変数

プロジェクトルートに `.env.local` ファイルを作成:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 5.2 Vercel環境変数 (デプロイ時)

Vercel Dashboardで以下を設定:

```env
# Spotify API
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# OpenAI API
OPENAI_API_KEY=your-openai-api-key
```

### 6. OpenAI APIの設定

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. APIキーを生成
3. キーをメモ

### 7. 開発サーバーの起動

```bash
npm run dev
```

アプリは `http://localhost:5173` で起動します。

## 📦 Vercelへのデプロイ

### 1. Vercelアカウント作成

[Vercel](https://vercel.com) にサインアップ

### 2. プロジェクトをVercelにインポート

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel
```

### 3. 環境変数の設定

Vercel Dashboardで以下を設定:

1. Settings → Environment Variables
2. 上記の環境変数を追加

### 4. デプロイ

```bash
# プロダクションデプロイ
vercel --prod
```

## 🎮 使い方

### 1. マップの作成

1. ホーム画面で「新しいマップを作成」をクリック
2. マップ名を入力
3. X軸とY軸を設定（例: 「テンポ」×「エネルギー」）
4. 提案された組み合わせから選択も可能

### 2. 曲の検索と追加

1. マップビュー画面でサイドバーを開く（⌘K）
2. 曲名またはアーティスト名で検索
3. 検索結果から曲を追加（+ ボタン）
4. AIが自動的に適切な位置に配置

### 3. マップの操作

- **散布図**: クリックで曲の詳細を表示
- **サイドバー**: `⌘K` でトグル
- **選択解除**: `⌘R` または `ESC`

## 📁 プロジェクト構造

```
music-mapping/
├── api/                      # Vercel Serverless Functions
│   ├── search-songs.ts       # iTunes検索API
│   ├── create-map.ts         # マップ作成API
│   ├── add-song.ts           # 曲追加API
│   └── package.json
├── src/
│   ├── pages/                # ページコンポーネント
│   │   ├── Home.tsx          # ホーム画面
│   │   ├── CreateMap.tsx     # マップ作成画面
│   │   └── MapView.tsx       # マップビュー画面
│   ├── components/           # 再利用可能なコンポーネント
│   ├── services/             # ビジネスロジック
│   │   └── mapService.ts     # Supabase連携
│   ├── hooks/                # カスタムフック
│   ├── lib/                  # ライブラリ設定
│   │   └── supabase.ts       # Supabaseクライアント
│   └── types/                # 型定義
├── supabase/
│   └── schema.sql            # データベーススキーマ
├── shared/
│   └── types.ts              # 共通型定義
└── vercel.json               # Vercel設定
```

## 🔧 開発

### ローカル開発環境

```bash
# 開発サーバー起動
npm run dev

# 型チェック
npm run type-check

# ビルド
npm run build

# プレビュー
npm run preview
```

### API開発（ローカル）

Vercel Functionsをローカルでテストする場合:

```bash
# Vercel CLIをインストール
npm install -g vercel

# ローカル開発
vercel dev
```

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License

## 🙏 謝辞

- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
- [OpenAI API](https://openai.com/api/)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [shadcn/ui](https://ui.shadcn.com/)

## 📧 お問い合わせ

質問や提案がありましたら、Issueを作成してください。
