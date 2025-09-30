import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExternalLink, Trash2, X, GripVertical } from 'lucide-react';
import { Song } from '../App';
import { AudioPlayer } from './AudioPlayer';

interface FloatingCardProps {
  song: Song;
  position?: { x: number; y: number } | null;
  onRemove: (songId: string) => void;
  onClose: () => void;
  isNewlyAdded?: boolean;
}

export function FloatingCard({ song, position, onRemove, onClose, isNewlyAdded = false }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Set initial position based on clicked point
  useEffect(() => {
    if (!cardRef.current || !position) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Position near the clicked point, but adjust to stay on screen
    let x = position.x + 20; // Offset slightly from click point
    let y = position.y - rect.height / 2; // Center vertically around click point
    
    // Adjust if card would go off screen
    if (x + rect.width > windowWidth - 20) {
      x = position.x - rect.width - 20; // Show on left side instead
    }
    if (y < 20) y = 20;
    if (y + rect.height > windowHeight - 20) {
      y = windowHeight - rect.height - 20;
    }
    if (x < 20) x = 20;
    
    setCardPosition({ x, y });
  }, [position, song.id]);

  const handleRemove = () => {
    onRemove(song.id);
  };

  const handleSpotifyClick = () => {
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && 
        (e.target.closest('button') || e.target.closest('audio'))) {
      return; // Don't start drag if clicking on buttons or audio elements
    }
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setCardPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setCardPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      ref={cardRef}
      className={`fixed z-50 animate-in fade-in-0 zoom-in-95 duration-200 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: `${cardPosition.x}px`,
        top: `${cardPosition.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Card className="w-80 shadow-lg border-2 select-none">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-lg leading-tight truncate">{song.title}</h3>
                  {isNewlyAdded && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5 animate-pulse">
                      NEW
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground truncate">{song.artist}</p>
                {song.album && (
                  <p className="text-sm text-muted-foreground truncate">{song.album}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {song.imageUrl && (
            <img 
              src={song.imageUrl} 
              alt={song.title}
              className="w-full h-32 object-cover rounded mb-3"
              draggable={false}
            />
          )}
          
          {song.previewUrl && (
            <div className="mb-3">
              <AudioPlayer previewUrl={song.previewUrl} className="w-full" />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {song.spotifyUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSpotifyClick}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Spotify
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}