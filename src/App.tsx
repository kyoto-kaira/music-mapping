import { useState, useEffect } from "react";
import { TopBar } from "./components/TopBar";
import { ScatterPlot } from "./components/ScatterPlot";
import { Sidebar } from "./components/Sidebar";
import { FloatingCard } from "./components/FloatingCard";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  spotifyUrl?: string;
  previewUrl?: string;
  imageUrl?: string;
  x?: number;
  y?: number;
}

export interface MapAxes {
  xAxis: string;
  yAxis: string;
}

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [mapAxes, setMapAxes] = useState<MapAxes>({
    xAxis: "",
    yAxis: "",
  });
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newlyAddedSongId, setNewlyAddedSongId] = useState<
    string | null
  >(null);

  // Mock popular songs data
  useEffect(() => {
    const loadInitialSongs = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) =>
          setTimeout(resolve, 1000),
        );

        const mockSongs: Song[] = [
          {
            id: "1",
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            spotifyUrl:
              "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
            previewUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            imageUrl:
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
          },
          {
            id: "2",
            title: "Shape of You",
            artist: "Ed Sheeran",
            album: "÷ (Divide)",
            spotifyUrl:
              "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
            previewUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            imageUrl:
              "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
          },
          {
            id: "3",
            title: "Someone Like You",
            artist: "Adele",
            album: "21",
            spotifyUrl:
              "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV",
            previewUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            imageUrl:
              "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
          },
          {
            id: "4",
            title: "Bohemian Rhapsody",
            artist: "Queen",
            album: "A Night at the Opera",
            spotifyUrl:
              "https://open.spotify.com/track/1AJpDn8nTXjlxmJLI8Gm26",
            previewUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            imageUrl:
              "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=300&fit=crop",
          },
          {
            id: "5",
            title: "Hotel California",
            artist: "Eagles",
            album: "Hotel California",
            spotifyUrl:
              "https://open.spotify.com/track/40riOy7x9W7GXjyGp4pjAv",
            previewUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            imageUrl:
              "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300&h=300&fit=crop",
          },
        ];

        setSongs(mockSongs);
      } catch (error) {
        toast.error("初期データの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSongs();
  }, []);

  const handleCreateMap = async (axes: MapAxes) => {
    if (!axes.xAxis.trim() || !axes.yAxis.trim()) {
      toast.error("X軸とY軸の両方を入力してください");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to remap coordinates
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock coordinates based on axes
      const updatedSongs = songs.map((song) => ({
        ...song,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));

      setSongs(updatedSongs);
      setMapAxes(axes);
      setHasCoordinates(true);
      toast.success("マップを作成しました");
    } catch (error) {
      toast.error("マップの作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSong = async (
    newSong: Omit<Song, "x" | "y">,
  ) => {
    if (!hasCoordinates) {
      toast.error("まずマップを作成してください");
      return;
    }

    try {
      // Simulate API call to add song with coordinates
      await new Promise((resolve) => setTimeout(resolve, 800));

      const songWithCoordinates: Song = {
        ...newSong,
        x: Math.random() * 100,
        y: Math.random() * 100,
      };

      setSongs((prev) => [...prev, songWithCoordinates]);

      // Auto-select the newly added song to show where it was placed
      setSelectedSong(songWithCoordinates);
      setNewlyAddedSongId(songWithCoordinates.id);

      // Clear the newly added status after 3 seconds
      setTimeout(() => {
        setNewlyAddedSongId(null);
      }, 3000);

      toast.success("曲を追加しました");
    } catch (error) {
      toast.error("曲の追加に失敗しました");
    }
  };

  const handleRemoveSong = async (songId: string) => {
    try {
      // Simulate API call to remove song
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSongs((prev) =>
        prev.filter((song) => song.id !== songId),
      );
      setSelectedSong(null);
      toast.success("曲を削除しました");
    } catch (error) {
      toast.error("曲の削除に失敗しました");
    }
  };

  const handleSongSelect = (
    song: Song,
    position?: { x: number; y: number },
  ) => {
    setSelectedSong(song);
    setSelectedSongPosition(position);
  };

  const [selectedSongPosition, setSelectedSongPosition] =
    useState<{ x: number; y: number } | null>(null);

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
              onClose={() => {
                setSelectedSong(null);
                setSelectedSongPosition(null);
              }}
              isNewlyAdded={
                newlyAddedSongId === selectedSong.id
              }
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