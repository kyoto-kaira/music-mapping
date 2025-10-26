import { ApiResponse, CreateMapResponse, DeleteSongResponse, SearchResult, Song } from '../../shared/types';
import { MOCK_SONGS } from '../data/mockData';

// ローカルストレージでマップ状態を管理
const STORAGE_KEY_MAP = 'music_mapping_map_state';
const STORAGE_KEY_MAP_ID = 'music_mapping_map_id';
const STORAGE_KEY_MAP_AXES = 'music_mapping_map_axes';

// iTunes Search APIのレスポンス型
interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  trackViewUrl: string;
  previewUrl?: string;
}

interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesTrack[];
}

// 座標生成のためのリクエスト型
interface CoordinateGenerationRequest {
  previewUrl?: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

// 座標生成関数（将来的にAIエンドポイントを呼び出す）
async function generateCoordinates(request: CoordinateGenerationRequest): Promise<{ x: number; y: number }> {
  // TODO: 将来的には以下のようにAIエンドポイントを呼び出す
  // const response = await fetch('/api/generate-coordinates', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request)
  // });
  // const data = await response.json();
  // return { x: data.x, y: data.y };
  
  // 現状はランダム値を返す
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  };
}

class ApiClient {
  // iTunes APIから曲情報（特にpreviewUrl）を取得
  private async fetchSongFromiTunes(title: string, artist: string): Promise<{ previewUrl?: string } | null> {
    try {
      const query = `${title} ${artist}`;
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=1`;
      
      const response = await fetch(url);
      if (!response.ok) return null;

      const data: iTunesSearchResponse = await response.json();
      if (data.results.length === 0) return null;

      return {
        previewUrl: data.results[0].previewUrl
      };
    } catch (error) {
      console.error('Error fetching song from iTunes:', error);
      return null;
    }
  }

  // 曲関連のAPI
  async getSongs(): Promise<ApiResponse<Song[]>> {
    const currentSongs = this.getCurrentSongs();
    return {
      success: true,
      data: currentSongs.map(song => ({
        ...song,
        x: undefined,
        y: undefined
      }))
    };
  }

  async addSong(song: Omit<Song, 'x' | 'y'>): Promise<ApiResponse<Song>> {
    const currentSongs = this.getCurrentSongs();
    const currentMapId = localStorage.getItem(STORAGE_KEY_MAP_ID);
    
    if (!currentMapId) {
      return {
        success: false,
        data: undefined,
        message: 'Map must be created before adding songs',
        code: 'MAP_NOT_CREATED'
      };
    }

    // 既存の曲かチェック
    const existingSong = currentSongs.find(s => s.id === song.id);
    if (existingSong) {
      return {
        success: false,
        data: undefined,
        message: 'すでにこの曲は追加されています',
        code: 'SONG_ALREADY_EXISTS'
      };
    }

    // 軸情報を取得
    const axes = this.getCurrentAxes();
    if (!axes) {
      return {
        success: false,
        data: undefined,
        message: 'Map axes not found',
        code: 'AXES_NOT_FOUND'
      };
    }

    // 座標を生成（プレビューURL、X軸、Y軸を使用）
    const coordinates = await generateCoordinates({
      previewUrl: song.previewUrl,
      xAxisLabel: axes.xAxis,
      yAxisLabel: axes.yAxis,
    });

    const songWithCoordinates: Song = {
      ...song,
      x: coordinates.x,
      y: coordinates.y,
    };

    currentSongs.push(songWithCoordinates);
    this.saveCurrentSongs(currentSongs);

    return {
      success: true,
      data: songWithCoordinates
    };
  }

  async removeSong(songId: string): Promise<ApiResponse<DeleteSongResponse>> {
    const currentSongs = this.getCurrentSongs();
    const songIndex = currentSongs.findIndex(song => song.id === songId);
    
    if (songIndex === -1) {
      return {
        success: false,
        data: undefined,
        message: 'Song not found',
        code: 'SONG_NOT_FOUND'
      };
    }

    currentSongs.splice(songIndex, 1);
    this.saveCurrentSongs(currentSongs);

    return {
      success: true,
      data: { id: songId }
    };
  }

  // マップ関連のAPI
  async createMap(axes: { xAxis: string; yAxis: string }): Promise<ApiResponse<CreateMapResponse>> {
    const { xAxis, yAxis } = axes;
    
    if (!xAxis || !yAxis) {
      return {
        success: false,
        data: undefined,
        message: 'Both xAxis and yAxis are required',
        code: 'MISSING_AXES'
      };
    }

    // マップIDを生成
    const mapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 軸情報を保存
    this.saveAxes({ xAxis, yAxis });
    
    // 既存の曲に座標を付与（並列処理）
    // iTunes APIから実際のpreviewUrlを取得
    const songsWithCoordinates: Song[] = await Promise.all(
      MOCK_SONGS.map(async (song) => {
        // iTunes APIから実際の曲情報を取得
        const iTunesData = await this.fetchSongFromiTunes(song.title, song.artist);
        const previewUrl = iTunesData?.previewUrl || song.previewUrl;
        
        // 座標を生成
        const coordinates = await generateCoordinates({
          previewUrl: previewUrl,
          xAxisLabel: xAxis,
          yAxisLabel: yAxis,
        });
        
        return {
          ...song,
          previewUrl: previewUrl,
          x: coordinates.x,
          y: coordinates.y,
        };
      })
    );

    // マップ状態を保存
    localStorage.setItem(STORAGE_KEY_MAP_ID, mapId);
    this.saveCurrentSongs(songsWithCoordinates);

    return {
      success: true,
      data: {
        mapId,
        songs: songsWithCoordinates
      }
    };
  }

  // 検索関連のAPI
  async searchSongs(query: string): Promise<ApiResponse<SearchResult[]>> {
    if (!query || typeof query !== 'string') {
      return {
        success: false,
        data: undefined,
        message: 'Search query is required',
        code: 'MISSING_QUERY'
      };
    }

    if (!query.trim()) {
      return {
        success: true,
        data: []
      };
    }

    try {
      // iTunes Search APIを使用して検索
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=25`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`iTunes API returned ${response.status}`);
      }

      const data: iTunesSearchResponse = await response.json();

      // iTunes APIのレスポンスをSearchResult形式に変換
      const results: SearchResult[] = data.results.map((track) => ({
        id: track.trackId.toString(),
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        imageUrl: track.artworkUrl100,
        spotifyUrl: track.trackViewUrl, // iTunes URLをspotifyUrlフィールドに格納
        previewUrl: track.previewUrl
      }));

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Error searching iTunes:', error);
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'iTunes検索に失敗しました',
        code: 'ITUNES_SEARCH_ERROR'
      };
    }
  }

  // ヘルパーメソッド
  private getCurrentSongs(): Song[] {
    const stored = localStorage.getItem(STORAGE_KEY_MAP);
    if (!stored) return [...MOCK_SONGS];
    try {
      return JSON.parse(stored);
    } catch {
      return [...MOCK_SONGS];
    }
  }

  private saveCurrentSongs(songs: Song[]): void {
    localStorage.setItem(STORAGE_KEY_MAP, JSON.stringify(songs));
  }

  private getCurrentAxes(): { xAxis: string; yAxis: string } | null {
    const stored = localStorage.getItem(STORAGE_KEY_MAP_AXES);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private saveAxes(axes: { xAxis: string; yAxis: string }): void {
    localStorage.setItem(STORAGE_KEY_MAP_AXES, JSON.stringify(axes));
  }
}

export const apiClient = new ApiClient();
