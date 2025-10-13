import {
    AddSongRequest,
    ApiResponse,
    CreateMapRequest,
    CreateMapResponse,
    DeleteSongResponse,
    SearchResult,
    Song
} from '../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // 曲関連のAPI
  async getSongs(): Promise<ApiResponse<Song[]>> {
    return this.request<Song[]>('/songs');
  }

  async addSong(song: Omit<Song, 'x' | 'y'>): Promise<ApiResponse<Song>> {
    const requestBody: AddSongRequest = { song };
    return this.request<Song>('/songs', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async removeSong(songId: string): Promise<ApiResponse<DeleteSongResponse>> {
    return this.request<DeleteSongResponse>(`/songs/${songId}`, {
      method: 'DELETE',
    });
  }

  // マップ関連のAPI
  async createMap(axes: { xAxis: string; yAxis: string }): Promise<ApiResponse<CreateMapResponse>> {
    const requestBody: CreateMapRequest = axes;
    return this.request<CreateMapResponse>('/maps', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  // 検索関連のAPI
  async searchSongs(query: string): Promise<ApiResponse<SearchResult[]>> {
    const params = new URLSearchParams({ q: query });
    return this.request<SearchResult[]>(`/search?${params}`);
  }
}

export const apiClient = new ApiClient();
