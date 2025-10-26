import { ApiResponse, CreateMapResponse, DeleteSongResponse, SearchResult, Song } from '../../shared/types';

// 環境判定：Vercel Functions が利用可能かどうか
const isVercelFunctionsAvailable = () => {
  // 本番環境（Vercel）または vercel dev 環境
  return import.meta.env.PROD && typeof window !== 'undefined' && window.location.hostname !== 'localhost';
};

// APIベースURL
const API_BASE_URL = '';  // Vercelでは相対パス

// iTunes Search API関連の型定義
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

// エラーハンドリング用のヘルパー関数
function handleApiError(error: any, defaultMessage: string): ApiResponse<any> {
  console.error(defaultMessage, error);
  return {
    success: false,
    data: undefined,
    message: error?.message || defaultMessage,
    code: error?.code || 'API_ERROR',
  };
}

class ApiClient {
  // 曲を追加（開発環境：ランダム座標 / 本番環境：AIで座標を計算）
  async addSong(
    song: Omit<Song, 'x' | 'y'>,
    axes: { xAxis: string; yAxis: string }
  ): Promise<ApiResponse<Song>> {
    try {
      // Vercel Functions が利用できない環境ではランダムな座標を割り当て
      if (!isVercelFunctionsAvailable()) {
        const songWithCoordinates: Song = {
          ...song,
          x: Math.random() * 2 - 1, // -1 ~ 1
          y: Math.random() * 2 - 1, // -1 ~ 1
        };
        return {
          success: true,
          data: songWithCoordinates,
        };
      }

      // Vercel環境ではAIで座標を計算
      const response = await fetch(`${API_BASE_URL}/api/add-song`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          song,
          xAxis: axes.xAxis,
          yAxis: axes.yAxis,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          data: undefined,
          message: data.message || '曲の追加に失敗しました',
          code: data.code || 'SONG_ADDITION_FAILED',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return handleApiError(error, '曲の追加に失敗しました');
    }
  }

  // 曲を削除（ダミー実装 - 実際はフロントエンドで管理）
  async removeSong(songId: string): Promise<ApiResponse<DeleteSongResponse>> {
    return {
      success: true,
      data: { id: songId },
    };
  }

  // マップを作成（開発環境：即座に作成 / 本番環境：AIで初期曲をマッピング）
  async createMap(axes: { xAxis: string; yAxis: string }): Promise<ApiResponse<CreateMapResponse>> {
    try {
      // Vercel Functions が利用できない環境では即座にマップIDを返す
      if (!isVercelFunctionsAvailable()) {
        const mapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          data: {
            mapId,
            songs: [],
          },
        };
      }

      // Vercel環境ではAIで初期曲をマッピング
      const response = await fetch(`${API_BASE_URL}/api/create-map`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xAxis: axes.xAxis,
          yAxis: axes.yAxis,
          songs: [], // 初期は空のマップを作成
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          data: undefined,
          message: data.message || 'マップの作成に失敗しました',
          code: data.code || 'MAP_CREATION_FAILED',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return handleApiError(error, 'マップの作成に失敗しました');
    }
  }

  // 曲を検索（開発環境：直接iTunes API / 本番環境：Vercel Functions経由）
  async searchSongs(query: string): Promise<ApiResponse<SearchResult[]>> {
    if (!query || typeof query !== 'string') {
      return {
        success: false,
        data: undefined,
        message: 'Search query is required',
        code: 'MISSING_QUERY',
      };
    }

    if (!query.trim()) {
      return {
        success: true,
        data: [],
      };
    }

    try {
      // Vercel Functions が利用できない環境では直接iTunes APIを呼び出し
      if (!isVercelFunctionsAvailable()) {
        return await this.searchSongsFromiTunes(query);
      }

      // Vercel環境ではVercel Functions経由
      const response = await fetch(
        `${API_BASE_URL}/api/search-songs?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          data: undefined,
          message: data.message || '検索に失敗しました',
          code: data.code || 'SEARCH_FAILED',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return handleApiError(error, '検索に失敗しました');
    }
  }

  // iTunes APIから直接検索（開発環境用）
  private async searchSongsFromiTunes(query: string): Promise<ApiResponse<SearchResult[]>> {
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=25`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`iTunes API returned ${response.status}`);
      }

      const data: iTunesSearchResponse = await response.json();

      const results: SearchResult[] = data.results.map((track) => ({
        id: track.trackId.toString(),
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        imageUrl: track.artworkUrl100,
        spotifyUrl: track.trackViewUrl,
        previewUrl: track.previewUrl,
      }));

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return handleApiError(error, 'iTunes検索に失敗しました');
    }
  }
}

export const apiClient = new ApiClient();
