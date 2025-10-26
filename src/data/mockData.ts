import { SearchResult, Song } from '../../shared/types';

// モックデータ
export const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    previewUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    spotifyUrl: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
    previewUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Someone Like You",
    artist: "Adele",
    album: "21",
    spotifyUrl: "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV",
    previewUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
  },
  {
    id: "4",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    spotifyUrl: "https://open.spotify.com/track/1AJpDn8nTXjlxmJLI8Gm26",
    previewUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=300&fit=crop",
  },
  {
    id: "5",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    spotifyUrl: "https://open.spotify.com/track/40riOy7x9W7GXjyGp4pjAv",
    previewUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    imageUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300&h=300&fit=crop",
  },
];

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: 'search-1',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    spotifyUrl: 'https://open.spotify.com/track/4Dvkj6JhhA12EX05fT7y2e'
  },
  {
    id: 'search-2',
    title: 'Bad Habit',
    artist: 'Steve Lacy',
    album: 'Gemini Rights',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    spotifyUrl: 'https://open.spotify.com/track/4k6Uh1HXdhtusDW5y8Guitj'
  },
  {
    id: 'search-3',
    title: 'Unholy',
    artist: 'Sam Smith ft. Kim Petras',
    album: 'Gloria',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop',
    spotifyUrl: 'https://open.spotify.com/track/3nqQXoyQOWXiESFLlDF1hG'
  }
];

// 座標生成のユーティリティ関数
export const generateRandomCoordinates = (): { x: number; y: number } => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
});

export const addCoordinatesToSong = (song: Omit<Song, 'x' | 'y'>): Song => ({
  ...song,
  ...generateRandomCoordinates(),
});

// 検索関数
export const searchSongs = (query: string, songs: SearchResult[]): SearchResult[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return songs.filter(song =>
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery)
  );
};

