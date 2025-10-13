# 環境変数設定例

## 開発環境用 (.env.local)
```
# フロントエンドのAPIベースURL（開発時）
VITE_API_BASE_URL=http://localhost:3001/api

# バックエンドのフロントエンドURL（CORS用）
FRONTEND_URL=http://localhost:5173
```

## Vercel本番環境用
Vercelのダッシュボードで以下の環境変数を設定してください：

### フロントエンド用
```
VITE_API_BASE_URL=https://your-app-name.vercel.app/api
```

### バックエンド用
```
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

## 注意事項
- Vercelでは環境変数は自動的にビルド時に注入されます
- `VITE_`プレフィックスが付いた環境変数はフロントエンドで使用可能です
- バックエンド用の環境変数には`VITE_`プレフィックスを付けないでください
