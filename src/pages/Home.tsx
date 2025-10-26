import { Music2, Plus, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { deleteMap, getAllMaps, MapData } from '../services/mapService';

export function Home() {
  const navigate = useNavigate();
  const [savedMaps, setSavedMaps] = useState<MapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMaps();
  }, []);

  const loadMaps = async () => {
    setIsLoading(true);
    const maps = await getAllMaps();
    setSavedMaps(maps);
    setIsLoading(false);
  };

  const handleCreateNewMap = () => {
    navigate('/create');
  };

  const handleOpenMap = (mapId: string) => {
    navigate(`/map/${mapId}`);
  };

  const handleDeleteMap = async (mapId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await deleteMap(mapId);
    if (success) {
      setSavedMaps(savedMaps.filter(m => m.id !== mapId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Music Mapping
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            音楽を可視化して、新しい音楽体験を。
            <br />
            あなたの好きな曲を軸にマッピングしてみましょう。
          </p>
        </div>

        {/* 新規作成ボタン */}
        <div className="flex justify-center mb-12">
          <Button
            size="lg"
            onClick={handleCreateNewMap}
            className="gap-2 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <Plus className="w-5 h-5" />
            新しいマップを作成
          </Button>
        </div>

        {/* マップ一覧 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : savedMaps.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              保存されたマップ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMaps.map((map) => (
                <Card
                  key={map.id}
                  className="hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleOpenMap(map.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{map.name}</span>
                      <Music2 className="w-5 h-5 text-primary flex-shrink-0" />
                    </CardTitle>
                    <CardDescription>
                      {map.songCount} 曲 • {new Date(map.lastModified).toLocaleDateString('ja-JP')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">X軸:</span>
                        <span className="font-medium">{map.axes.xAxis}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Y軸:</span>
                        <span className="font-medium">{map.axes.yAxis}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenMap(map.id)}
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      開く
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteMap(map.id, e)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      削除
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="max-w-md mx-auto border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Music2 className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">マップがまだありません</h3>
              <p className="text-sm text-muted-foreground mb-6">
                最初のマップを作成して、音楽の世界を探索しましょう！
              </p>
              <Button onClick={handleCreateNewMap} className="gap-2">
                <Plus className="w-4 h-4" />
                マップを作成
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

