import { supabase } from '../lib/supabase';
import { MapAxes, Song } from '../types';

export interface MapData {
  id: string;
  name: string;
  axes: MapAxes;
  songCount: number;
  createdAt: string;
  lastModified: string;
}

export interface MapWithSongs extends MapData {
  songs: Song[];
}

// マップ一覧を取得
export async function getAllMaps(): Promise<MapData[]> {
  try {
    const { data, error } = await supabase
      .from('maps')
      .select('id, name, x_axis, y_axis, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // 各マップの曲数を取得
    const mapsWithCounts = await Promise.all(
      (data || []).map(async (map) => {
        const { count } = await supabase
          .from('songs')
          .select('*', { count: 'exact', head: true })
          .eq('map_id', map.id);

        return {
          id: map.id,
          name: map.name,
          axes: {
            xAxis: map.x_axis,
            yAxis: map.y_axis,
          },
          songCount: count || 0,
          createdAt: map.created_at,
          lastModified: map.updated_at,
        };
      })
    );

    return mapsWithCounts;
  } catch (error) {
    console.error('Error loading maps:', error);
    return [];
  }
}

// 特定のマップを取得（曲を含む）
export async function getMapById(mapId: string): Promise<MapWithSongs | null> {
  try {
    const { data: mapData, error: mapError } = await supabase
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .single();

    if (mapError) throw mapError;
    if (!mapData) return null;

    const { data: songsData, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .eq('map_id', mapId);

    if (songsError) throw songsError;

    const songs: Song[] = (songsData || []).map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || undefined,
      spotifyUrl: song.spotify_url || undefined,
      previewUrl: song.preview_url || undefined,
      imageUrl: song.image_url || undefined,
      x: song.x,
      y: song.y,
    }));

    return {
      id: mapData.id,
      name: mapData.name,
      axes: {
        xAxis: mapData.x_axis,
        yAxis: mapData.y_axis,
      },
      songCount: songs.length,
      createdAt: mapData.created_at,
      lastModified: mapData.updated_at,
      songs,
    };
  } catch (error) {
    console.error('Error loading map:', error);
    return null;
  }
}

// マップを作成
export async function createMap(
  name: string,
  axes: MapAxes
): Promise<{ id: string; songs: Song[] } | null> {
  try {
    const { data: mapData, error: mapError } = await supabase
      .from('maps')
      .insert({
        name,
        x_axis: axes.xAxis,
        y_axis: axes.yAxis,
      })
      .select()
      .single();

    if (mapError) throw mapError;
    if (!mapData) throw new Error('Failed to create map');

    return {
      id: mapData.id,
      songs: [],
    };
  } catch (error) {
    console.error('Error creating map:', error);
    return null;
  }
}

// マップに曲を追加
export async function addSongToMap(mapId: string, song: Song): Promise<boolean> {
  try {
    const { error } = await supabase.from('songs').insert({
      id: song.id,
      map_id: mapId,
      title: song.title,
      artist: song.artist,
      album: song.album || null,
      spotify_url: song.spotifyUrl || null,
      preview_url: song.previewUrl || null,
      image_url: song.imageUrl || null,
      x: song.x!,
      y: song.y!,
    });

    if (error) throw error;

    // マップの更新日時を更新
    await supabase
      .from('maps')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', mapId);

    return true;
  } catch (error) {
    console.error('Error adding song:', error);
    return false;
  }
}

// マップから曲を削除
export async function removeSongFromMap(mapId: string, songId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('map_id', mapId)
      .eq('id', songId);

    if (error) throw error;

    // マップの更新日時を更新
    await supabase
      .from('maps')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', mapId);

    return true;
  } catch (error) {
    console.error('Error removing song:', error);
    return false;
  }
}

// マップを削除
export async function deleteMap(mapId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('maps').delete().eq('id', mapId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting map:', error);
    return false;
  }
}

