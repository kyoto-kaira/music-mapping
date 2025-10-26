import { ArrowLeft, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CONSTANTS } from '../constants';
import { createMap } from '../services/mapService';

const AXIS_SUGGESTIONS = [
  { x: 'テンポ', y: 'エネルギー' },
  { x: '明るさ', y: '激しさ' },
  { x: 'ポジティブ', y: 'アコースティック' },
  { x: 'ダンサブル', y: 'メロディアス' },
  { x: '爽やか', y: '情熱的' },
  { x: 'リラックス', y: 'アップテンポ' },
];

export function CreateMap() {
  const navigate = useNavigate();
  const [mapName, setMapName] = useState('');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleSuggestionClick = (suggestion: { x: string; y: string }) => {
    setXAxis(suggestion.x);
    setYAxis(suggestion.y);
  };

  const handleCreateMap = async () => {
    if (!mapName.trim() || !xAxis.trim() || !yAxis.trim()) {
      toast.error('すべての項目を入力してください');
      return;
    }

    setIsCreating(true);
    try {
      const result = await createMap(mapName, { xAxis, yAxis });
      
      if (result) {
        toast.success(CONSTANTS.MESSAGES.SUCCESS.MAP_CREATED);
        navigate(`/map/${result.id}`);
      } else {
        toast.error('マップの作成に失敗しました');
      }
    } catch (error) {
      console.error('Map creation failed:', error);
      toast.error('マップの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-map-page">
      {/* Animated background elements */}
      <div className="bg-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      <div className="create-map-container">
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>ホームに戻る</span>
        </button>

        <div className="create-card">
          <div className="create-header">
            <div className="sparkle-icon">
              <Sparkles size={40} />
            </div>
            <h1 className="create-title">新しいマップを作成</h1>
            <p className="create-description">
              音楽の特徴を2つの軸で表現してマップを作成します
            </p>
          </div>

          <div className="create-content">
            {/* マップ名 */}
            <div className="form-group">
              <label htmlFor="mapName" className="form-label">マップ名</label>
              <input
                id="mapName"
                className="form-input"
                placeholder="例: お気に入りの曲コレクション"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                disabled={isCreating}
              />
            </div>

            {/* X軸 */}
            <div className="form-group">
              <label htmlFor="xAxis" className="form-label">X軸（横軸）</label>
              <input
                id="xAxis"
                className="form-input"
                placeholder={CONSTANTS.PLACEHOLDERS.X_AXIS}
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                disabled={isCreating}
              />
            </div>

            {/* Y軸 */}
            <div className="form-group">
              <label htmlFor="yAxis" className="form-label">Y軸（縦軸）</label>
              <input
                id="yAxis"
                className="form-input"
                placeholder={CONSTANTS.PLACEHOLDERS.Y_AXIS}
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                disabled={isCreating}
              />
            </div>

            {/* 提案 */}
            <div className="form-group">
              <label className="form-label">軸の組み合わせ例</label>
              <div className="suggestions-grid">
                {AXIS_SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isCreating}
                  >
                    {suggestion.x} × {suggestion.y}
                  </button>
                ))}
              </div>
            </div>

            {/* 作成ボタン */}
            <button
              onClick={handleCreateMap}
              disabled={isCreating || !mapName.trim() || !xAxis.trim() || !yAxis.trim()}
              className="submit-btn"
            >
              {isCreating ? (
                <>
                  <div className="spinner-small" />
                  作成中...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  マップを作成
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

