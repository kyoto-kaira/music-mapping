import express from 'express';
import { ApiResponse, SearchResult } from '../../../shared/types';
import { MOCK_SEARCH_RESULTS, searchSongs } from '../data/mockData';

const router = express.Router();

// GET /api/search - 楽曲検索
router.get('/', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
        code: 'MISSING_QUERY'
      });
    }

    if (!q.trim()) {
      const response: ApiResponse<SearchResult[]> = {
        success: true,
        data: []
      };
      return res.json(response);
    }

    // モックデータから検索
    const results = searchSongs(q, MOCK_SEARCH_RESULTS);

    const response: ApiResponse<SearchResult[]> = {
      success: true,
      data: results
    };
    res.json(response);
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search songs',
      code: 'SEARCH_ERROR'
    });
  }
});

export { router as searchRouter };
