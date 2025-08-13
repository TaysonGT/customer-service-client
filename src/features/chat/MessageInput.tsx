import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaPaperclip, FaStop, FaPlay, FaPause, FaTrash } from 'react-icons/fa';
import { MdEmojiEmotions, MdSend } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import RecordRTC from 'recordrtc';
import { IMessageType } from '../../types/types';

const MessageInput = memo(({ 
  onSend,
  showEmoji,
  setShowEmoji,
  className = '',
  handleTyping
}: { 
  onSend: (content: string, type: IMessageType, meta?:{duration?: number, height?:number, width?:number}) => void;
  showEmoji: boolean;
  setShowEmoji: (show: boolean) => void;
  handleTyping: () => void;
  className?: string;
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = useCallback(() => {
    if (inputMessage.trim()) {
      onSend(inputMessage, 'text');
      setInputMessage('');
    } else if (audioURL) {
      onSend(audioURL, 'audio', {duration});
      setAudioURL(null);
    }
  }, [inputMessage, audioURL, onSend]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
      });
      recorderRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Recording failed:', error);
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;
    
    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current!.getBlob();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setAudioURL(URL.createObjectURL(blob));
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    });
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    } else {
      audioRef.current.play();
      playbackTimerRef.current = setInterval(() => {
        setPlaybackTime(audioRef.current?.currentTime || 0);
      }, 200);
    }
    setIsPlaying(!isPlaying);
  };

  const discardRecording = () => {
    setAudioURL(null);
    setIsPlaying(false);
    setPlaybackTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && audioURL) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
    }
  }, [audioURL]);

  return (
    <div className={`${className} p-4 bg-white w-full`}>
      <div className="flex items-center gap-2">
        <div className='flex gap-2 text-lg text-gray-500'>
          <button className="p-2 hover:text-blue-500" aria-label="Attach file">
            <FaPaperclip />
          </button>
          <button
            className={`p-2 ${isRecording ? 'text-red-500' : 'hover:text-blue-500'}`}
            onClick={isRecording ? stopRecording : startRecording}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </button>
        </div>

        {isRecording ? (
          <div className="flex-1 bg-gray-100 rounded-2xl p-3 flex items-center justify-center">
            <div className="font-mono text-sm text-gray-700">
              {formatTime(recordingTime)}
            </div>
          </div>
        ) : audioURL ? (
          <div className="flex-1 bg-gray-100 rounded-2xl p-3 flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <div className="flex-1 font-mono text-sm text-gray-700">
              {formatTime(playbackTime)} / {formatTime(duration)}
            </div>
            <button
              onClick={discardRecording}
              className="p-2 text-red-500 hover:text-red-700"
              aria-label="Discard recording"
            >
              <FaTrash />
            </button>
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => {
                setIsPlaying(false);
                setPlaybackTime(0);
                if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
              }}
            />
          </div>
        ) : (
          <div className="relative flex-1 bg-gray-100 rounded-2xl">
            <textarea
              ref={messageRef}
              value={inputMessage}
              onChange={(e) => {
                handleTyping();
                setInputMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full bg-transparent border-none py-3 px-4 max-h-[150px] focus:outline-none resize-none"
              placeholder="Type a message..."
              rows={1}
            />
            <AnimatePresence>
              {inputMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-2 bottom-2"
                >
                  <button
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                    aria-label="Toggle emoji picker"
                  >
                    <MdEmojiEmotions className="text-xl" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() && !audioURL}
          className={`p-3 rounded-full ${(inputMessage.trim() || audioURL) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}
          aria-label="Send message"
        >
          <MdSend className="text-xl" />
        </button>
      </div>
    </div>
  );
});

export default MessageInput;