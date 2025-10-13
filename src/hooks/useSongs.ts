import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { CONSTANTS } from '../constants';
import {
    MOCK_SEARCH_RESULTS,
    MOCK_SONGS,
    addCoordinatesToSong,
    searchSongs,
    simulateMapCreation,
    simulateSearch,
    simulateSongAddition,
    simulateSongRemoval
} from '../data/mockData';
import { MapAxes, Song, SongPosition } from '../types';

export const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(CONSTANTS.API_SIMULATION_DELAYS.INITIAL_LOAD);
      setSongs(MOCK_SONGS);
    } catch (error) {
      toast.error(CONSTANTS.MESSAGES.ERROR.INITIAL_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMap = useCallback(async (axes: MapAxes) => {
    if (!axes.xAxis.trim() || !axes.yAxis.trim()) {
      toast.error(CONSTANTS.MESSAGES.ERROR.AXES_REQUIRED);
      return false;
    }

    setIsLoading(true);
    try {
      await simulateMapCreation();
      
      const updatedSongs = songs.map(song => ({
        ...song,
        x: Math.random() * CONSTANTS.COORDINATE_RANGE,
        y: Math.random() * CONSTANTS.COORDINATE_RANGE,
      }));

      setSongs(updatedSongs);
      toast.success(CONSTANTS.MESSAGES.SUCCESS.MAP_CREATED);
      return true;
    } catch (error) {
      toast.error(CONSTANTS.MESSAGES.ERROR.MAP_CREATION_FAILED);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [songs]);

  const addSong = useCallback(async (newSong: Omit<Song, 'x' | 'y'>) => {
    try {
      await simulateSongAddition();
      
      const songWithCoordinates = addCoordinatesToSong(newSong);
      setSongs(prev => [...prev, songWithCoordinates]);
      
      toast.success(CONSTANTS.MESSAGES.SUCCESS.SONG_ADDED);
      return songWithCoordinates;
    } catch (error) {
      toast.error(CONSTANTS.MESSAGES.ERROR.SONG_ADDITION_FAILED);
      return null;
    }
  }, []);

  const removeSong = useCallback(async (songId: string) => {
    try {
      await simulateSongRemoval();
      setSongs(prev => prev.filter(song => song.id !== songId));
      toast.success(CONSTANTS.MESSAGES.SUCCESS.SONG_REMOVED);
      return true;
    } catch (error) {
      toast.error(CONSTANTS.MESSAGES.ERROR.SONG_REMOVAL_FAILED);
      return false;
    }
  }, []);

  return {
    songs,
    isLoading,
    loadInitialSongs,
    createMap,
    addSong,
    removeSong,
  };
};

export const useSongSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof MOCK_SEARCH_RESULTS>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      await simulateSearch();
      const filteredResults = searchSongs(searchTerm, MOCK_SEARCH_RESULTS);
      setSearchResults(filteredResults);
    } catch (error) {
      toast.error(CONSTANTS.MESSAGES.ERROR.SEARCH_FAILED);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
  };
};

export const useSongSelection = () => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedSongPosition, setSelectedSongPosition] = useState<SongPosition | null>(null);
  const [newlyAddedSongId, setNewlyAddedSongId] = useState<string | null>(null);

  const selectSong = useCallback((song: Song, position?: SongPosition) => {
    setSelectedSong(song);
    setSelectedSongPosition(position || null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSong(null);
    setSelectedSongPosition(null);
  }, []);

  const markAsNewlyAdded = useCallback((songId: string) => {
    setNewlyAddedSongId(songId);
    setTimeout(() => {
      setNewlyAddedSongId(null);
    }, CONSTANTS.NEW_SONG_HIGHLIGHT_DURATION);
  }, []);

  return {
    selectedSong,
    selectedSongPosition,
    newlyAddedSongId,
    selectSong,
    clearSelection,
    markAsNewlyAdded,
  };
};

// API呼び出しのシミュレーション関数
const simulateApiCall = async (delay: number = CONSTANTS.API_SIMULATION_DELAYS.INITIAL_LOAD): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, delay));
};
