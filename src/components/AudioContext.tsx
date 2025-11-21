import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  bgm: boolean;
  setBgm: (value: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [bgm, setBgm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 오디오 객체 초기화 (한 번만)
    if (!audioRef.current) {
      audioRef.current = new Audio('/mainbgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    // BGM 상태에 따라 재생/정지
    if (bgm) {
      audioRef.current
        .play()
        .catch(() => {
          // Autoplay 차단 무시
        });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // cleanup 함수 제거 - 컴포넌트가 언마운트되어도 음악 유지
  }, [bgm]);

  return (
    <AudioContext.Provider value={{ bgm, setBgm }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}