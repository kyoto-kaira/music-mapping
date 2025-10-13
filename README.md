# Music Mapping App

楽曲を2次元マップ上に配置して可視化するアプリケーションです。

## アーキテクチャ

- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Node.js + Express + TypeScript
- **共通型定義**: `shared/types.ts`

## セットアップ

### 1. 依存関係のインストール

```bash
# 全ての依存関係を一度にインストール
npm run install:all

# または個別にインストール
npm install
cd backend && npm install
```

### 2. 環境変数の設定

フロントエンドのルートディレクトリに `.env.local` ファイルを作成：

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. 開発サーバーの起動

```bash
# フロントエンドとバックエンドを同時に起動
npm run dev

# または個別に起動
npm run dev:frontend  # フロントエンドのみ
npm run dev:backend   # バックエンドのみ
```

## API エンドポイント

- `GET /api/songs` - 初期曲一覧の取得
- `POST /api/maps` - マップ作成（座標付与）
- `GET /api/search?q=...` - 楽曲検索
- `POST /api/songs` - 曲の追加
- `DELETE /api/songs/:id` - 曲の削除

## 型定義

共通の型定義は `shared/types.ts` に集約されており、フロントエンドとバックエンドで共有されています。

## 開発

- フロントエンド: `http://localhost:5173`
- バックエンド: `http://localhost:3001`
- ヘルスチェック: `http://localhost:3001/health`
