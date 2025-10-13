// 音楽関連の型定義
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

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
}

export interface SongPosition {
  x: number;
  y: number;
}

// コンポーネントのプロパティ型定義
export interface ScatterPlotProps {
  songs: Song[];
  mapAxes: MapAxes;
  hasCoordinates: boolean;
  selectedSong: Song | null;
  onSongSelect: (song: Song, position?: SongPosition) => void;
  isLoading: boolean;
  newlyAddedSongId?: string | null;
}

export interface AudioPlayerProps {
  previewUrl?: string;
  className?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddSong: (song: Omit<Song, 'x' | 'y'>) => void;
  hasCoordinates: boolean;
}

export interface TopBarProps {
  onCreateMap: (axes: MapAxes) => void;
  isLoading: boolean;
  mapAxes: MapAxes;
}

export interface FloatingCardProps {
  song: Song;
  position?: SongPosition | null;
  onRemove: (songId: string) => void;
  onClose: () => void;
  isNewlyAdded?: boolean;
}

// API関連の型定義
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface CreateMapRequest {
  xAxis: string;
  yAxis: string;
}

export interface AddSongRequest {
  song: Omit<Song, 'x' | 'y'>;
}

// 状態管理の型定義
export interface AppState {
  songs: Song[];
  selectedSong: Song | null;
  isLoading: boolean;
  mapAxes: MapAxes;
  hasCoordinates: boolean;
  sidebarOpen: boolean;
  newlyAddedSongId: string | null;
  selectedSongPosition: SongPosition | null;
}
