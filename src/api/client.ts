import { ApiResponse, CreateMapResponse, DeleteSongResponse, SearchResult, Song } from '../../shared/types';
import { MOCK_SEARCH_RESULTS, MOCK_SONGS, addCoordinatesToSong, searchSongs } from '../data/mockData';

// ローカルストレージでマップ状態を管理
const STORAGE_KEY_MAP = 'music_mapping_map_state';
const STORAGE_KEY_MAP_ID = 'music_mapping_map_id';

class ApiClient {
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

    // 座標を付与して曲を追加
    const songWithCoordinates = addCoordinatesToSong(song);
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
    
    // 既存の曲に座標を付与
    const songsWithCoordinates: Song[] = MOCK_SONGS.map(song => 
      addCoordinatesToSong(song)
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

    const results = searchSongs(query, MOCK_SEARCH_RESULTS);

    return {
      success: true,
      data: results
    };
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
}

export const apiClient = new ApiClient();
