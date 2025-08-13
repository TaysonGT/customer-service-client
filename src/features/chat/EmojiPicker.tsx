import React, { useState, useEffect } from 'react';
import { EmojiClickData } from 'emoji-picker-react';

interface Props {
  onSelect: (emoji: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a simple cache
const emojiCache = {
  data: null as any,
  promise: null as Promise<void> | null,
};

const EmojiPickerBox: React.FC<Props> = ({ onSelect, setIsOpen }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!emojiCache.data && !emojiCache.promise) {
      emojiCache.promise = import('emoji-picker-react').then(module => {
        emojiCache.data = module.default;
        setIsReady(true);
      });
    } else if (emojiCache.data) {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return <div className="...">Loading...</div>;
  }

  const Picker = emojiCache.data;
  return (
    <div className="fixed left-1/2 right-1/2 -translate-1/2 z-10">
      <Picker
        onEmojiClick={(emojiData: EmojiClickData) => {
          onSelect(emojiData.emoji);
          setIsOpen(false);
        }}
        width={300}
        height={400}
      />
    </div>
  );
};

export default EmojiPickerBox;