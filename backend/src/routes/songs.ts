import express from 'express';
import { AddSongRequest, ApiResponse, DeleteSongResponse, Song } from '../../../shared/types';
import { MOCK_SONGS, addCoordinatesToSong } from '../data/mockData';

const router = express.Router();

// 現在のマップ状態を管理（実際のアプリではデータベースを使用）
let currentMapId: string | null = null;
let currentSongs: Song[] = [...MOCK_SONGS];

// GET /api/songs - 初期曲一覧の取得
router.get('/', (req, res) => {
  try {
    const response: ApiResponse<Song[]> = {
      success: true,
      data: currentSongs.map(song => ({
        ...song,
        x: undefined,
        y: undefined
      }))
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch songs',
      code: 'FETCH_SONGS_ERROR'
    });
  }
});

// POST /api/songs - 曲の追加
router.post('/', (req, res) => {
  try {
    const { song }: AddSongRequest = req.body;
    
    if (!song) {
      return res.status(400).json({
        success: false,
        message: 'Song data is required',
        code: 'MISSING_SONG_DATA'
      });
    }

    // マップが作成されていない場合は409を返す
    if (!currentMapId) {
      return res.status(409).json({
        success: false,
        message: 'Map must be created before adding songs',
        code: 'MAP_NOT_CREATED'
      });
    }

    // 既存の曲かチェック
    const existingSong = currentSongs.find(s => s.id === song.id);
    if (existingSong) {
      return res.status(409).json({
        success: false,
        message: 'Song already exists in the map',
        code: 'SONG_ALREADY_EXISTS'
      });
    }

    // 座標を付与して曲を追加
    const songWithCoordinates = addCoordinatesToSong(song);
    currentSongs.push(songWithCoordinates);

    const response: ApiResponse<Song> = {
      success: true,
      data: songWithCoordinates
    };
    res.json(response);
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add song',
      code: 'ADD_SONG_ERROR'
    });
  }
});

// DELETE /api/songs/:id - 曲の削除
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const songIndex = currentSongs.findIndex(song => song.id === id);
    if (songIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
        code: 'SONG_NOT_FOUND'
      });
    }

    currentSongs.splice(songIndex, 1);

    const response: ApiResponse<DeleteSongResponse> = {
      success: true,
      data: { id }
    };
    res.json(response);
  } catch (error) {
    console.error('Error removing song:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove song',
      code: 'REMOVE_SONG_ERROR'
    });
  }
});

// マップ状態を更新する関数（mapsルートから呼び出される）
export const updateMapState = (mapId: string, songs: Song[]) => {
  currentMapId = mapId;
  currentSongs = songs;
};

export const getCurrentMapState = () => ({
  mapId: currentMapId,
  songs: currentSongs
});

export { router as songsRouter };
