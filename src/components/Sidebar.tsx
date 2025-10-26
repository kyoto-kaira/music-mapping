import { AlertCircle, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { CONSTANTS } from '../constants';
import { useSongSearch } from '../hooks/useSongs';
import { SidebarProps } from '../types';

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
      <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-content">
          <div className="sidebar-search-section">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                className="search-input"
                placeholder={CONSTANTS.PLACEHOLDERS.SEARCH}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching || !hasCoordinates}
              />
              <button 
                className="search-btn"
                onClick={() => performSearch()}
                disabled={isSearching || !searchQuery.trim() || !hasCoordinates}
              >
                {CONSTANTS.BUTTONS.SEARCH}
              </button>
            </div>
            
            {!hasCoordinates && (
              <div className="sidebar-warning">
                <AlertCircle className="warning-icon" />
                <p className="warning-text">
                  {CONSTANTS.MESSAGES.INFO.MAP_CREATION_REQUIRED}
                </p>
              </div>
            )}
          </div>
          
          <div className="sidebar-results">
            {isSearching && (
              <div className="sidebar-loading">
                <div className="sidebar-spinner"></div>
                <p className="sidebar-loading-text">{CONSTANTS.MESSAGES.INFO.SEARCHING}</p>
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && searchQuery && (
              <div className="sidebar-empty">
                <p className="sidebar-empty-text">{CONSTANTS.MESSAGES.INFO.NO_RESULTS}</p>
              </div>
            )}
            
            {!isSearching && searchResults.length === 0 && !searchQuery && (
              <div className="sidebar-empty">
                <p className="sidebar-empty-text">
                  {CONSTANTS.MESSAGES.INFO.ENTER_SEARCH_TERM}
                </p>
              </div>
            )}
            
            {searchResults.map((result) => (
              <div key={result.id} className="search-result-card">
                <img 
                  src={result.imageUrl} 
                  alt={result.title}
                  className="result-image"
                />
                <div className="result-info">
                  <p className="result-title">{result.title}</p>
                  <p className="result-artist">{result.artist}</p>
                  <p className="result-album">{result.album}</p>
                </div>
                <button
                  className="result-add-btn"
                  onClick={() => handleAddSong(result)}
                  disabled={!hasCoordinates}
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </>
  );
}