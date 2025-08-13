import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

type AudioPlayerProps = {
  url: string|null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
};

const AudioPlayer = ({ url, isPlaying, onPause, onPlay }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Format time (seconds) to MM:SS
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause()
    } else {
      audioRef.current.play();
      onPlay()
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      onPause();
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [url]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="
        flex items-center gap-3 
        p-2.5 pl-3.5 
        bg-gray-50 
        rounded-lg 
        w-full max-w-md 
        h-14
        border border-gray-200
        ">
        {/* Play/Pause Button - Better proportional sizing */}
        <button
            onClick={togglePlayPause}
            className="
            flex items-center justify-center 
            w-9 h-9 /* Slightly smaller for better proportion */
            rounded-full 
            bg-blue-500 text-white 
            hover:bg-blue-600 
            transition-colors
            shrink-0 /* Prevent button from shrinking */
            "
            aria-label={isPlaying ? 'Pause' : 'Play'}
        >
            {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
        </button>

        {/* Progress Bar - Improved spacing and proportions */}
        <div className="flex-1 flex flex-col gap-1 min-w-0 /* Prevent overflow */">
            <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
            </div>
            <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="
                w-full 
                h-1 /* Thinner track */
                bg-gray-300 
                rounded-full 
                appearance-none 
                cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 /* Smaller thumb */
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-blue-500
            "
            />
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={url||'#'} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;