import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { mapsRouter } from './routes/maps';
import { searchRouter } from './routes/search';
import { songsRouter } from './routes/songs';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(helmet());

// 許可するフロントエンドのオリジン（開発: 5173 / プレビュー: 4173）
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:4173'
];

app.use(cors({
  origin: (origin, callback) => {
    // ブラウザ外(例えばcurl)や同一オリジンの場合は許可
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルート
app.use('/api/songs', songsRouter);
app.use('/api/maps', mapsRouter);
app.use('/api/search', searchRouter);

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// エラーハンドリング
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404ハンドリング
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
