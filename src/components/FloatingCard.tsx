import { ExternalLink, GripVertical, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FloatingCardProps } from '../types';
import { AudioPlayer } from './AudioPlayer';

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
    const svgContainer = document.querySelector('.map-view-plot') as HTMLElement;
    const svgRect = svgContainer?.getBoundingClientRect();
    
    if (!svgRect) return;
    
    // Get header height to account for it
    const header = document.querySelector('.map-view-header') as HTMLElement;
    const headerHeight = header?.getBoundingClientRect().height || 64;
    
    // Convert SVG coordinates to screen coordinates
    const screenX = svgRect.left + position.x;
    const screenY = svgRect.top + position.y;
    
    // Calculate optimal position with better spacing
    const offset = 15;
    const margin = 20;
    const topMargin = headerHeight + 20; // Add extra space below header
    
    // Try to position to the right first, then left if not enough space
    let x = screenX + offset;
    let y = screenY - rect.height / 2;
    
    // Check if card would go off screen horizontally
    if (x + rect.width > windowWidth - margin) {
      x = screenX - rect.width - offset; // Show on left side
    }
    
    // Ensure minimum margins (especially from top)
    x = Math.max(margin, Math.min(x, windowWidth - rect.width - margin));
    y = Math.max(topMargin, Math.min(y, windowHeight - rect.height - margin));
    
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
      className={`floating-card ${
        isDragging ? 'floating-card-dragging' : ''
      } ${isNewlyAdded ? 'floating-card-new' : ''}`}
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
      <div className="floating-card-content">
        <div className="floating-card-header">
          <div className="floating-card-drag-handle">
            <GripVertical className="drag-icon" />
            <div className="floating-card-info">
              <div className="floating-card-title-row">
                <h3 className="floating-card-title">{song.title}</h3>
                {isNewlyAdded && (
                  <span className="floating-card-badge">NEW</span>
                )}
              </div>
              <p className="floating-card-artist">{song.artist}</p>
              {song.album && (
                <p className="floating-card-album">{song.album}</p>
              )}
            </div>
          </div>
          <button className="floating-card-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        {song.imageUrl && (
          <img 
            src={song.imageUrl} 
            alt={song.title}
            className="floating-card-image"
            draggable={false}
          />
        )}
        
        {song.previewUrl && (
          <div className="floating-card-player">
            <AudioPlayer previewUrl={song.previewUrl} className="w-full" />
          </div>
        )}
        
        <div className="floating-card-actions">
          {song.spotifyUrl && (
            <button className="floating-card-btn floating-card-btn-spotify" onClick={handleSpotifyClick}>
              <ExternalLink size={16} />
              <span>Apple Music</span>
            </button>
          )}
          
          <button 
            className="floating-card-btn floating-card-btn-delete" 
            onClick={handleRemove}
            title="削除 (Deleteキー)"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}