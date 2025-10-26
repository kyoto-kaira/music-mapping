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
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
export interface CreateMapRequest {
    xAxis: string;
    yAxis: string;
}
export interface CreateMapResponse {
    mapId: string;
    songs: Song[];
}
export interface AddSongRequest {
    song: Omit<Song, 'x' | 'y'>;
}
export interface DeleteSongResponse {
    id: string;
}
export interface ApiError {
    success: false;
    message: string;
    code?: string;
}
export interface SearchQuery {
    q: string;
}
export interface MapState {
    mapId: string | null;
    axes: MapAxes;
    songs: Song[];
    hasCoordinates: boolean;
}
//# sourceMappingURL=types.d.ts.map