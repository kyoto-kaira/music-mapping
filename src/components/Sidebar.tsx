import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { CONSTANTS } from '../constants';
import { useSongSearch } from '../hooks/useSongs';
import { SidebarProps } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

export function Sidebar({ isOpen, onToggle, onAddSong, hasCoordinates }: SidebarProps) {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    performSearch 
  } = useSongSearch();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleAddSong = (result: typeof searchResults[0]) => {
    if (!hasCoordinates) {
      toast.error(CONSTANTS.MESSAGES.ERROR.MAP_CREATION_REQUIRED);
      return;
    }

    onAddSong({
      id: result.id,
      title: result.title,
      artist: result.artist,
      album: result.album,
      imageUrl: result.imageUrl,
      spotifyUrl: result.spotifyUrl,
      previewUrl: result.previewUrl
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
                placeholder={CONSTANTS.PLACEHOLDERS.SEARCH}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <Button 
                size="sm" 
                onClick={() => performSearch()}
                disabled={isSearching || !searchQuery.trim()}
              >
                {CONSTANTS.BUTTONS.SEARCH}
              </Button>
            </div>
            
            {!hasCoordinates && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {CONSTANTS.MESSAGES.INFO.MAP_CREATION_REQUIRED}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isSearching && (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">{CONSTANTS.MESSAGES.INFO.SEARCHING}</p>
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">{CONSTANTS.MESSAGES.INFO.NO_RESULTS}</p>
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && !searchQuery && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {CONSTANTS.MESSAGES.INFO.ENTER_SEARCH_TERM}
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