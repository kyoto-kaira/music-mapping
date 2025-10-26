import { Song } from '../../shared/types';

// モックデータ（初期曲データとして使用）
// previewUrlはiTunes Search APIから自動的に取得されます
export const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    spotifyUrl: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Someone Like You",
    artist: "Adele",
    album: "21",
    spotifyUrl: "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
  },
  {
    id: "4",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    spotifyUrl: "https://open.spotify.com/track/1AJpDn8nTXjlxmJLI8Gm26",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=300&fit=crop",
  },
  {
    id: "5",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    spotifyUrl: "https://open.spotify.com/track/40riOy7x9W7GXjyGp4pjAv",
    imageUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300&h=300&fit=crop",
  },
];

