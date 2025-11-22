import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  bgm: boolean;
  setBgm: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [bgm, setBgm] = useState(() => {
    const saved = localStorage.getItem('bgm');
    return saved ? JSON.parse(saved) : false;
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('bgmVolume');
    return saved ? parseFloat(saved) : 0.4;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 오디오 객체 초기화 (한 번만)
    if (!audioRef.current) {
      audioRef.current = new Audio('/mainbgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    // 볼륨 업데이트
    if (audioRef.current) {
      audioRef.current.volume = volume;
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
  }, [bgm, volume]);

  // localStorage에 bgm 상태 저장
  useEffect(() => {
    localStorage.setItem('bgm', JSON.stringify(bgm));
  }, [bgm]);

  // localStorage에 볼륨 저장
  useEffect(() => {
    localStorage.setItem('bgmVolume', volume.toString());
  }, [volume]);

  return (
    <AudioContext.Provider value={{ bgm, setBgm, volume, setVolume }}>
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