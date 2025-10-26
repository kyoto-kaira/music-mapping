import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteMap, getAllMaps, MapData, updateMapName } from '../services/mapService';

export function Home() {
  const navigate = useNavigate();
  const [savedMaps, setSavedMaps] = useState<MapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleStartEditing = (mapId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMapId(mapId);
    setEditedName(currentName);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleCancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMapId(null);
    setEditedName('');
  };

  const handleSaveName = async (mapId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!editedName.trim()) {
      setEditingMapId(null);
      return;
    }

    const success = await updateMapName(mapId, editedName.trim());
    if (success) {
      setSavedMaps(savedMaps.map(m => 
        m.id === mapId ? { ...m, name: editedName.trim() } : m
      ));
      setEditingMapId(null);
      toast.success('マップ名を更新しました');
    } else {
      toast.error('マップ名の更新に失敗しました');
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent, mapId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveName(mapId, e as any);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      setEditingMapId(null);
      setEditedName('');
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
                      {editingMapId === map.id ? (
                        <div className="map-title-edit-wrapper">
                          <div className="map-title-edit" onClick={handleInputClick}>
                            <input
                              ref={inputRef}
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              onKeyDown={(e) => handleNameKeyDown(e, map.id)}
                              className="map-title-input"
                              maxLength={50}
                              onClick={handleInputClick}
                            />
                            <div className="map-title-actions">
                              <button
                                className="map-title-action-btn success"
                                onClick={(e) => handleSaveName(map.id, e)}
                                title="保存"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                className="map-title-action-btn cancel"
                                onClick={handleCancelEditing}
                                title="キャンセル"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="map-title">
                          <button 
                            className="map-title-edit-btn-inline"
                            onClick={(e) => handleStartEditing(map.id, map.name, e)}
                            title="マップ名を編集"
                          >
                            <Edit2 size={14} />
                          </button>
                          {map.name}
                          <span className="map-icon">🎵</span>
                        </div>
                      )}
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

                  {editingMapId !== map.id && (
                    <div className="map-actions">
                      <button 
                        className="btn btn-delete btn-delete-only" 
                        onClick={(e) => handleDeleteMap(map.id, map.name, e)}
                        title="削除"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
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

