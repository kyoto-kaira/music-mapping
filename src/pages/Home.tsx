import { Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleDeleteMap = async (mapId: string, mapName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 確認ダイアログを表示
    const isConfirmed = window.confirm(
      `「${mapName}」を削除してもよろしいですか？\n\nこの操作は取り消せません。`
    );
    
    if (!isConfirmed) {
      return;
    }
    
    const success = await deleteMap(mapId);
    if (success) {
      setSavedMaps(savedMaps.filter(m => m.id !== mapId));
    }
  };

  return (
    <div className="home-page">
      {/* Animated background elements */}
      <div className="bg-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      <div className="home-container">
        {/* Header */}
        <div className="home-header">
          <div className="logo">
            <div className="logo-icon">🎵</div>
            <div className="logo-text">Music Mapping</div>
          </div>
          <div className="subtitle">音楽を可視化して、新しい音楽体験を。</div>
          <div className="description">あなたの好きな曲を軸にマッピングしてみましょう。</div>
          <button className="create-btn" onClick={handleCreateNewMap}>
            <span style={{ fontSize: '20px' }}>+</span>
            <span>新しいマップを作成</span>
          </button>
        </div>

        {/* Maps section */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner-large"></div>
              <p className="loading-text-large">読み込み中...</p>
              <p className="loading-subtext">マップを取得しています</p>
            </div>
          </div>
        ) : savedMaps.length > 0 ? (
          <>
            <div className="section-title">
              <span>保存されたマップ</span>
            </div>

            <div className="maps-grid">
              {savedMaps.map((map) => (
                <div 
                  key={map.id} 
                  className="map-card map-card-clickable"
                  onClick={() => handleOpenMap(map.id)}
                >
                  <div className="map-header">
                    <div className="map-info">
                      <div className="map-title">
                        {map.name}
                        <span className="map-icon">🎵</span>
                      </div>
                      <div className="map-meta">
                        {map.songCount} 曲 • {new Date(map.lastModified).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                  </div>

                  <div className="map-details">
                    <div className="axis-info">
                      <div className="axis-item">
                        <div className="axis-label">X軸</div>
                        <div className="axis-value">{map.axes.xAxis}</div>
                      </div>
                      <div className="axis-item">
                        <div className="axis-label">Y軸</div>
                        <div className="axis-value">{map.axes.yAxis}</div>
                      </div>
                    </div>
                  </div>

                  <div className="map-actions">
                    <button 
                      className="btn btn-delete btn-delete-only" 
                      onClick={(e) => handleDeleteMap(map.id, map.name, e)}
                      title="削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="map-card">
              <div className="empty-content">
                <div className="empty-icon">🎵</div>
                <h3 className="empty-title">マップがまだありません</h3>
                <p className="empty-description">
                  最初のマップを作成して、音楽の世界を探索しましょう！
                </p>
                <button className="create-btn" onClick={handleCreateNewMap}>
                  <Plus size={20} />
                  <span>マップを作成</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

