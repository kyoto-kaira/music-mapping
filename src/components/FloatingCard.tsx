import { ExternalLink, GripVertical, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FloatingCardProps } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

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
    
    // Get the SVG container's position to convert SVG coordinates to screen coordinates
    const svgContainer = document.querySelector('.h-full.relative') as HTMLElement;
    const svgRect = svgContainer?.getBoundingClientRect();
    
    if (!svgRect) return;
    
    // Convert SVG coordinates to screen coordinates
    const screenX = svgRect.left + position.x;
    const screenY = svgRect.top + position.y;
    
    // Calculate optimal position with better spacing
    const offset = 15;
    const margin = 20;
    
    // Try to position to the right first, then left if not enough space
    let x = screenX + offset;
    let y = screenY - rect.height / 2;
    
    // Check if card would go off screen horizontally
    if (x + rect.width > windowWidth - margin) {
      x = screenX - rect.width - offset; // Show on left side
    }
    
    // Ensure minimum margins
    x = Math.max(margin, Math.min(x, windowWidth - rect.width - margin));
    y = Math.max(margin, Math.min(y, windowHeight - rect.height - margin));
    
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click event from bubbling up to global click handler
    e.stopPropagation();
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

  // Global mouse events for dragging and outside click detection
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

    const handleGlobalClick = (e: MouseEvent) => {
      // Don't close if dragging
      if (isDragging) return;
      
      // Check if click is outside the card
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close card on Escape key
      if (e.key === 'Escape') {
        onClose();
      }
      // Remove song on Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        onRemove(song.id);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    // Add event listeners
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDragging, dragOffset, onClose, onRemove, song.id]);

  return (
    <div 
      ref={cardRef}
      className={`fixed z-50 animate-in fade-in-0 zoom-in-95 duration-300 ease-out ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: `${cardPosition.x}px`,
        top: `${cardPosition.y}px`,
        transform: 'translateZ(0)', // Enable hardware acceleration
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCardClick}
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
              title="削除 (Deleteキー)"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}