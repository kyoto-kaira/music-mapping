import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Song } from '../App';
import { toast } from 'sonner@2.0.3';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddSong: (song: Omit<Song, 'x' | 'y'>) => void;
  hasCoordinates: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
}

export function Sidebar({ isOpen, onToggle, onAddSong, hasCoordinates }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockSearchResults: SearchResult[] = [
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

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Simulate API search delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock results based on search term
      const filteredResults = mockSearchResults.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      toast.error('検索に失敗しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddSong = (result: SearchResult) => {
    if (!hasCoordinates) {
      toast.error('まずマップを作成してください');
      return;
    }

    onAddSong({
      id: result.id,
      title: result.title,
      artist: result.artist,
      album: result.album,
      imageUrl: result.imageUrl,
      spotifyUrl: result.spotifyUrl,
      previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    });
  };

  return (
    <>
      <div className={`bg-sidebar border-l transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="曲名やアーティスト名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <Button 
                size="sm" 
                onClick={() => handleSearch()}
                disabled={isSearching || !searchQuery.trim()}
              >
                検索
              </Button>
            </div>
            
            {!hasCoordinates && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  曲を追加するにはまずマップを作成してください
                </p>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isSearching && (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">検索中...</p>
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">検索結果が見つかりませんでした</p>
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && !searchQuery && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  曲名やアーティスト名を入力して検索してください
                </p>
              </div>
            )}
            
            {searchResults.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={result.imageUrl} 
                      alt={result.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{result.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.artist}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {result.album}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddSong(result)}
                      disabled={!hasCoordinates}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="fixed top-1/2 right-4 z-10 shadow-lg"
        onClick={onToggle}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>
    </>
  );
}