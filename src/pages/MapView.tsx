import { ArrowLeft, Home } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FloatingCard } from '../components/FloatingCard';
import { ScatterPlot } from '../components/ScatterPlot';
import { Sidebar } from '../components/Sidebar';
import { useSongs, useSongSelection } from '../hooks/useSongs';
import { addSongToMap, getMapById, MapWithSongs, removeSongFromMap } from '../services/mapService';
import { Song } from '../types';

export function MapView() {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const [mapData, setMapData] = useState<MapWithSongs | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { songs, setSongs, addSong } = useSongs();
  const {
    selectedSong,
    selectedSongPosition,
    newlyAddedSongId,
    selectSong,
    clearSelection,
    markAsNewlyAdded,
  } = useSongSelection();

  useEffect(() => {
    if (mapId) {
      loadMap(mapId);
    }
  }, [mapId]);

  const loadMap = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await getMapById(id);
      if (data) {
        setMapData(data);
        setSongs(data.songs);
      } else {
        toast.error('マップが見つかりませんでした');
        navigate('/');
      }
    } catch (error) {
      toast.error('マップの読み込みに失敗しました');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSong = async (newSong: Omit<Song, 'x' | 'y'>) => {
    if (!mapData || !mapId) return;

    const addedSong = await addSong(newSong, mapData.axes);
    if (addedSong) {
      // Supabaseに保存
      const success = await addSongToMap(mapId, addedSong);
      if (success) {
        selectSong(addedSong);
        markAsNewlyAdded(addedSong.id);
      }
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!mapId) return;
    
    const success = await removeSongFromMap(mapId, songId);
    if (success) {
      clearSelection();
      setSongs((prev) => prev.filter((s) => s.id !== songId));
    }
  };

  const handleSongSelect = (song: Song, position?: { x: number; y: number }) => {
    selectSong(song, position);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // グローバルキーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K でサイドバーをトグル
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }

      // Ctrl/Cmd + R で選択をクリア
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        clearSelection();
      }

      // ESC で選択をクリア
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, clearSelection]);

  if (isLoading || !mapData) {
    return (
      <div className="map-view-page">
        <div className="bg-shapes">
          <div className="shape shape1"></div>
          <div className="shape shape2"></div>
          <div className="shape shape3"></div>
        </div>
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <p className="loading-text-large">読み込み中...</p>
            <p className="loading-subtext">マップデータを取得しています</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view-page">
      {/* Background gradient */}
      <div className="map-view-gradient"></div>

      {/* ヘッダー */}
      <div className="map-view-header">
        <div className="map-view-header-content">
          <div className="map-view-header-left">
            <button className="header-back-btn" onClick={handleBackToHome}>
              <ArrowLeft size={16} />
              <Home size={16} />
            </button>
            <div className="header-divider" />
            <div className="header-info">
              <h1 className="header-title">{mapData.name}</h1>
              <div className="header-meta">
                <span>{mapData.axes.xAxis} × {mapData.axes.yAxis}</span>
                <span>•</span>
                <span>{songs.length} 曲</span>
              </div>
            </div>
          </div>

          <div className="header-shortcut">
            <kbd className="kbd-key">⌘K</kbd>
            <span>サイドバー</span>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="map-view-content">
        <div className="map-view-plot">
          <ScatterPlot
            songs={songs}
            mapAxes={mapData.axes}
            hasCoordinates={true}
            selectedSong={selectedSong}
            onSongSelect={handleSongSelect}
            isLoading={false}
            newlyAddedSongId={newlyAddedSongId}
          />

          {selectedSong && (
            <FloatingCard
              song={selectedSong}
              position={selectedSongPosition}
              onRemove={handleRemoveSong}
              onClose={clearSelection}
              isNewlyAdded={newlyAddedSongId === selectedSong.id}
            />
          )}
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onAddSong={handleAddSong}
          hasCoordinates={true}
        />
      </div>
    </div>
  );
}

