import { ArrowLeft, Home } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FloatingCard } from '../components/FloatingCard';
import { ScatterPlot } from '../components/ScatterPlot';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/button';
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
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* ヘッダー */}
      <div className="border-b bg-card">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <Home className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="font-semibold">{mapData.name}</h1>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{mapData.axes.xAxis} × {mapData.axes.yAxis}</span>
                <span>•</span>
                <span>{songs.length} 曲</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘K</kbd>
            <span className="ml-1">サイドバー</span>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
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

