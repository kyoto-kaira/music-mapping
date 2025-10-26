# 🎵 Music Mapping

音楽を2次元マップ上に可視化するWebアプリケーションです。AIを活用して、曲の特徴を指定した軸に基づいて自動的にマッピングします。

## ✨ 特徴

- 🎨 **直感的なビジュアライゼーション**: 散布図で曲を可視化
- 🤖 **AI駆動のマッピング**: OpenAI API (GPT-4o-mini) で曲の特徴を自動分析
- 🎵 **iTunes統合**: iTunes Search APIで曲の検索とプレビュー再生
- 💾 **データベース管理**: Supabase (PostgreSQL) でデータを永続化
- 🚀 **Vercelデプロイ対応**: サーバーレス関数で簡単デプロイ
- 📱 **レスポンシブデザイン**: モバイルからデスクトップまで対応
- ✏️ **マップ管理**: マップ名の編集、削除機能

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────────┐
│         フロントエンド (React + Vite)         │
│  - React Router (画面遷移)                   │
│  - Tailwind CSS (スタイリング)                │
│  - Recharts (散布図)                         │
│  - shadcn/ui (UIコンポーネント)               │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│      Vercel Serverless Functions (API)      │
│  - /api/search-songs (iTunes検索)            │
│  - /api/create-map (マップ作成)               │
│  - /api/add-song (曲の追加)                  │
└──────────────┬──────────────────────────────┘
               │
               ├─────────────┬─────────────────┐
               ▼             ▼                 ▼
       ┌──────────┐   ┌──────────┐    ┌──────────┐
       │ Supabase │   │  iTunes  │    │  OpenAI  │
       │   (DB)   │   │   API    │    │   API    │
       └──────────┘   └──────────┘    └──────────┘
```

### 技術スタック

**フロントエンド:**
- React 18 + TypeScript
- Vite 6 (ビルドツール)
- React Router 7 (ルーティング)
- Tailwind CSS + shadcn/ui (UI)
- Recharts (可視化)
- Sonner (トースト通知)
- Lucide React (アイコン)

**バックエンド:**
- Vercel Serverless Functions
- Supabase (PostgreSQL)
- OpenAI API (GPT-4o-mini)
- iTunes Search API (認証不要)

## 🚀 セットアップ

詳細なセットアップガイドは [SETUP.md](./SETUP.md) を参照してください。

### クイックスタート

#### 1. 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- OpenAI APIキー

#### 2. リポジトリのクローン

```bash
git clone https://github.com/yourusername/music-mapping.git
cd music-mapping
```

#### 3. 依存関係のインストール

```bash
npm install
```

#### 4. Supabaseのセットアップ

1. [Supabase](https://supabase.com) で新しいプロジェクトを作成
2. SQL Editorで `supabase/schema.sql` を実行
3. プロジェクトURLとanon keyをメモ

#### 5. 環境変数の設定

`.env.local` ファイルを作成:

```bash
cp env.template .env.local
```

`.env.local` を編集:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 6. 開発サーバーの起動

```bash
npm run dev
```

アプリは `http://localhost:5173` で起動します。

**注意**: 曲の検索と追加機能を使用するには、Vercelにデプロイしてサーバーレス関数を有効にする必要があります。

## 📦 Vercelへのデプロイ

### 1. Vercelアカウント作成

[Vercel](https://vercel.com) にGitHubアカウントでサインアップ

### 2. プロジェクトをVercelにインポート

#### オプションA: Web UI
1. Vercelダッシュボードで「Add New...」→「Project」
2. GitHubリポジトリを選択してインポート

#### オプションB: CLI
```bash
npm install -g vercel
vercel login
vercel
```

### 3. 環境変数の設定

Vercel Dashboardで以下を設定:

| 環境変数 | 値 | 説明 |
|---------|-----|------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabaseプロジェクト URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase anon key |
| `OPENAI_API_KEY` | `sk-...` | OpenAI API キー |

**重要**: すべての環境変数をProduction、Preview、Developmentに設定してください。

### 4. 再デプロイ

環境変数を追加した後、最新のデプロイメントを再デプロイします。

```bash
vercel --prod
```

## 🎮 使い方

### 1. マップの作成

1. ホーム画面で「新しいマップを作成」をクリック
2. マップ名を入力（例: 「私のプレイリスト」）
3. X軸とY軸を設定（例: 「テンポ」×「エネルギー」）
4. AIが提案する組み合わせから選択も可能

### 2. 曲の検索と追加

1. マップビュー画面でサイドバーを開く（`⌘K` / `Ctrl+K`）
2. 曲名またはアーティスト名で検索（iTunes Search API使用）
3. 検索結果から曲を選択（`+` ボタン）
4. OpenAI APIが自動的に適切な位置に配置

### 3. マップの操作

#### 散布図での操作
- **曲をクリック**: 曲の詳細を表示
- **プレビュー再生**: 曲カードの再生ボタンをクリック（30秒プレビュー）
- **iTunesで開く**: 曲カードのリンクをクリック

#### キーボードショートカット
- `⌘K` / `Ctrl+K`: サイドバーをトグル
- `⌘R` / `Ctrl+R`: 選択解除
- `ESC`: 選択解除またはサイドバーを閉じる

### 4. マップの管理

- **マップ名の編集**: ホーム画面でマップカードの編集アイコンをクリック
- **マップの削除**: ホーム画面でマップカードの削除アイコンをクリック
- **マップを開く**: マップカードをクリック

## 📁 プロジェクト構造

```
music-mapping/
├── api/                      # Vercel Serverless Functions
│   ├── search-songs.ts       # iTunes Search API統合
│   ├── create-map.ts         # マップ作成 + AI マッピング
│   ├── add-song.ts           # 曲追加 + AI 座標計算
│   └── package.json          # API依存関係
├── src/
│   ├── pages/                # ページコンポーネント
│   │   ├── Home.tsx          # ホーム画面（マップ一覧）
│   │   ├── CreateMap.tsx     # マップ作成画面
│   │   └── MapView.tsx       # マップビュー画面（散布図）
│   ├── components/           # 再利用可能なコンポーネント
│   │   ├── ScatterPlot.tsx   # 散布図コンポーネント
│   │   ├── Sidebar.tsx       # サイドバー（曲検索）
│   │   ├── TopBar.tsx        # トップバー（ナビゲーション）
│   │   ├── FloatingCard.tsx  # 曲詳細カード
│   │   ├── AudioPlayer.tsx   # オーディオプレビュー
│   │   └── ui/               # shadcn/ui コンポーネント
│   ├── services/             # ビジネスロジック
│   │   └── mapService.ts     # Supabase連携（CRUD操作）
│   ├── hooks/                # カスタムフック
│   │   └── useSongs.ts       # 曲データ管理
│   ├── api/                  # API クライアント
│   │   └── client.ts         # Vercel Functions呼び出し
│   ├── lib/                  # ライブラリ設定
│   │   └── supabase.ts       # Supabaseクライアント + 型定義
│   ├── types/                # 型定義
│   ├── constants/            # 定数定義
│   ├── utils/                # ユーティリティ関数
│   └── data/                 # モックデータ（開発用）
├── supabase/
│   └── schema.sql            # データベーススキーマ（maps, songs）
├── shared/
│   └── types.ts              # 共通型定義（API/フロントエンド）
├── public/                   # 静的ファイル
├── build/                    # ビルド出力
├── vercel.json               # Vercel設定
├── vite.config.ts            # Vite設定
├── env.template              # 環境変数テンプレート
├── package.json              # フロントエンド依存関係
└── README.md                 # このファイル
```

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動（ホットリロード有効）
npm run dev

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview

# Vercel用ビルド
npm run vercel-build
```

### API開発（ローカル）

Vercel Functionsをローカルでテストする場合:

```bash
# Vercel CLIをインストール
npm install -g vercel

# ローカル開発サーバー起動（API有効）
vercel dev
```

**注意**: `vercel dev` を使用すると、`http://localhost:3000` でフロントエンドとAPIの両方にアクセスできます。

### データベース管理

Supabaseダッシュボードから直接管理できます:
- **Table Editor**: データの閲覧・編集
- **SQL Editor**: クエリの実行
- **Database**: スキーマの確認

## 💡 機能の詳細

### AIによるマッピング

OpenAI GPT-4o-miniを使用して、以下の処理を行います:

1. **マップ作成時**: 複数の曲を一括で軸に基づいて配置
2. **曲追加時**: 新しい曲を既存のマップに適切に配置

AIは曲のタイトル、アーティスト名、および指定された軸（例: 「テンポ」「エネルギー」）を考慮して、-1.0から+1.0の範囲で座標を計算します。

### データの永続化

Supabaseを使用して、以下のデータを管理します:

- **マップ**: マップ名、X/Y軸の定義
- **曲**: 曲情報、座標、マップとの関連付け

すべてのデータはリアルタイムで同期され、複数のデバイスからアクセスできます。

### iTunes Search API

認証不要で以下の機能を提供:

- 曲名・アーティスト名での検索
- アルバムアートワークの取得
- 30秒のプレビュー音源
- iTunes Storeへのリンク

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発のガイドライン

- TypeScriptの型安全性を維持
- コンポーネントは再利用可能に設計
- UIはアクセシビリティを考慮
- コミットメッセージは明確に

## 📝 ライセンス

MIT License

## 🙏 謝辞

このプロジェクトは以下のサービス・ライブラリを使用しています:

- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) - 曲の検索とメタデータ
- [OpenAI API](https://openai.com/api/) - AI駆動のマッピング
- [Supabase](https://supabase.com) - データベースとバックエンド
- [Vercel](https://vercel.com) - ホスティングとサーバーレス関数
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
- [Recharts](https://recharts.org/) - データ可視化
- [React Router](https://reactrouter.com/) - ルーティング
- [Tailwind CSS](https://tailwindcss.com/) - スタイリング

## 📧 お問い合わせ

質問や提案がありましたら、GitHubのIssueを作成してください。

---

**Music Mapping** で音楽の新しい楽しみ方を発見しましょう！ 🎵✨
