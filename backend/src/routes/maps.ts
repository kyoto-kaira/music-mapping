import express from 'express';
import { ApiResponse, CreateMapRequest, CreateMapResponse, Song } from '../../../shared/types';
import { MOCK_SONGS, addCoordinatesToSong } from '../data/mockData';
import { updateMapState } from './songs';

const router = express.Router();

// POST /api/maps - マップ作成
router.post('/', (req, res) => {
  try {
    const { xAxis, yAxis }: CreateMapRequest = req.body;
    
    if (!xAxis || !yAxis) {
      return res.status(400).json({
        success: false,
        message: 'Both xAxis and yAxis are required',
        code: 'MISSING_AXES'
      });
    }

    // マップIDを生成
    const mapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 既存の曲に座標を付与
    const songsWithCoordinates: Song[] = MOCK_SONGS.map(song => 
      addCoordinatesToSong(song)
    );

    // マップ状態を更新
    updateMapState(mapId, songsWithCoordinates);

    const response: ApiResponse<CreateMapResponse> = {
      success: true,
      data: {
        mapId,
        songs: songsWithCoordinates
      }
    };
    res.json(response);
  } catch (error) {
    console.error('Error creating map:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create map',
      code: 'CREATE_MAP_ERROR'
    });
  }
});

export { router as mapsRouter };
