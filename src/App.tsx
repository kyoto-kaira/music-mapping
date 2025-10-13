import React, { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";
import { FloatingCard } from "./components/FloatingCard";
import { ScatterPlot } from "./components/ScatterPlot";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Toaster } from "./components/ui/sonner";
import { useSongs, useSongSelection } from "./hooks/useSongs";
import { MapAxes, Song } from "./types";

export default function App() {
  const [mapAxes, setMapAxes] = useState<MapAxes>({
    xAxis: "",
    yAxis: "",
  });
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { songs, isLoading, loadInitialSongs, createMap, addSong, removeSong } = useSongs();
  const { 
    selectedSong, 
    selectedSongPosition, 
    newlyAddedSongId, 
    selectSong, 
    clearSelection, 
    markAsNewlyAdded 
  } = useSongSelection();

  // 初期データの読み込み
  useEffect(() => {
    loadInitialSongs();
  }, [loadInitialSongs]);

  const handleCreateMap = async (axes: MapAxes) => {
    const success = await createMap(axes);
    if (success) {
      setMapAxes(axes);
      setHasCoordinates(true);
    }
  };

  const handleAddSong = async (newSong: Omit<Song, "x" | "y">) => {
    if (!hasCoordinates) {
      toast.error("まずマップを作成してください");
      return;
    }

    const addedSong = await addSong(newSong);
    if (addedSong) {
      selectSong(addedSong);
      markAsNewlyAdded(addedSong.id);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    const success = await removeSong(songId);
    if (success) {
      clearSelection();
    }
  };

  const handleSongSelect = (song: Song, position?: { x: number; y: number }) => {
    selectSong(song, position);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar
        onCreateMap={handleCreateMap}
        isLoading={isLoading}
        mapAxes={mapAxes}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <ScatterPlot
            songs={songs}
            mapAxes={mapAxes}
            hasCoordinates={hasCoordinates}
            selectedSong={selectedSong}
            onSongSelect={handleSongSelect}
            isLoading={isLoading}
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
          hasCoordinates={hasCoordinates}
        />
      </div>

      <Toaster />
    </div>
  );
}
