import { ArrowLeft, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ホームに戻る
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">新しいマップを作成</CardTitle>
            <CardDescription className="text-base">
              音楽の特徴を2つの軸で表現してマップを作成します
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* マップ名 */}
            <div className="space-y-2">
              <Label htmlFor="mapName">マップ名</Label>
              <Input
                id="mapName"
                placeholder="例: お気に入りの曲コレクション"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                disabled={isCreating}
              />
            </div>

            {/* X軸 */}
            <div className="space-y-2">
              <Label htmlFor="xAxis">X軸（横軸）</Label>
              <Input
                id="xAxis"
                placeholder={CONSTANTS.PLACEHOLDERS.X_AXIS}
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                disabled={isCreating}
              />
            </div>

            {/* Y軸 */}
            <div className="space-y-2">
              <Label htmlFor="yAxis">Y軸（縦軸）</Label>
              <Input
                id="yAxis"
                placeholder={CONSTANTS.PLACEHOLDERS.Y_AXIS}
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                disabled={isCreating}
              />
            </div>

            {/* 提案 */}
            <div className="space-y-3">
              <Label>軸の組み合わせ例</Label>
              <div className="grid grid-cols-2 gap-2">
                {AXIS_SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isCreating}
                    className="justify-start text-left h-auto py-2 px-3"
                  >
                    <div className="text-xs">
                      <div className="font-medium">{suggestion.x} × {suggestion.y}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* 作成ボタン */}
            <Button
              onClick={handleCreateMap}
              disabled={isCreating || !mapName.trim() || !xAxis.trim() || !yAxis.trim()}
              className="w-full gap-2 py-6 text-lg"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  作成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  マップを作成
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

