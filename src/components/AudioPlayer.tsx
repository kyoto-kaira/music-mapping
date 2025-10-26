import { Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CONSTANTS } from '../constants';
import { AudioPlayerProps } from '../types';
import { formatTime } from '../utils';
import { Button } from './ui/button';

export function AudioPlayer({ previewUrl, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset state when previewUrl changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop previous audio and reset state
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
  }, [previewUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };


  if (!previewUrl) {
    return (
      <Button
        variant="secondary"
        size="sm"
        disabled
        className={className}
      >
        <Volume2 className="w-4 h-4 mr-2" />
        {CONSTANTS.BUTTONS.NO_PREVIEW}
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <audio ref={audioRef} src={previewUrl} preload="metadata" />
      
      <Button
        variant="secondary"
        size="sm"
        onClick={togglePlayback}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4 mr-2" />
        ) : (
          <Play className="w-4 h-4 mr-2" />
        )}
        {isLoading ? CONSTANTS.BUTTONS.LOADING : isPlaying ? CONSTANTS.BUTTONS.PAUSE : CONSTANTS.BUTTONS.PREVIEW_PLAY}
      </Button>
      
      {duration > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}