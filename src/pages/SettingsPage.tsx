import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Bot } from 'lucide-react';

export default function SettingsPage() {
  const [bgm, setBgm] = React.useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/mainbgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    if (bgm) {
      audioRef.current
        .play()
        .catch(() => {
          // Ignore autoplay block; input toggle will resolve on interaction
        });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [bgm]);

  return (
    <div className="h-full overflow-y-auto bg-stone-50 p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Garden Settings ⚙️</h2>
        <p className="text-slate-500">Customize your deployment experience.</p>
      </header>

      <div className="grid max-w-2xl gap-6">
        {/* BGM Setting */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-3 ${bgm ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
               {bgm ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Background Music</h3>
              <p className="text-sm text-slate-500">Play relaxing background music during deployment.</p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={bgm} onChange={() => setBgm(!bgm)} className="peer sr-only" />
            <div className="peer h-7 w-12 rounded-full border border-slate-200 bg-white after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-slate-200 after:transition-all after:content-[''] peer-checked:border-green-500 peer-checked:bg-emerald-100 peer-checked:after:translate-x-full peer-checked:after:bg-green-500 peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-green-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white"></div>
          </label>
        </div>

        {/* AI Persona Setting */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
               <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">AI Agent Personality</h3>
              <p className="text-sm text-slate-500">Adjust how the agent communicates with you.</p>
            </div>
          </div>
          <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-green-500 focus:outline-none">
            <option>Helpful Gardener (Friendly)</option>
            <option>Strict Operator (Concise)</option>
            <option>Pirate Captain (Fun)</option>
          </select>
        </div>
      </div>
    </div>
  );
}