import { Volume2, VolumeX, Languages } from 'lucide-react';
import { useAudio } from '../components/AudioContext';
import { useLanguage } from '../components/LanguageContext';

export default function SettingsPage() {
  const { bgm, setBgm } = useAudio();
  const { language, setLanguage } = useLanguage();
  const copy = {
    en: {
      title: 'Garden Settings ⚙️',
      subtitle: 'Customize your deployment experience.',
      language: {
        title: 'Language',
        description: 'Choose how Kube Garden speaks to you.',
        actionLabel: 'Switch language',
        enLabel: 'English',
        jaLabel: '日本語',
      },
      bgm: {
        title: 'Background Music',
        description: 'Play relaxing background music during deployment.',
      },
      ai: {
        title: 'Gardener Agent Personality',
        description: 'Adjust how the agent communicates with you.',
        options: ['Helpful Gardener (Friendly)', 'Strict Operator (Concise)', 'Pirate Captain (Fun)'],
      },
    },
    ja: {
      title: 'ガーデン設定 ⚙️',
      subtitle: 'デプロイ体験をあなた好みにカスタマイズしましょう。',
      language: {
        title: '言語設定',
        description: 'Kube Garden の表示言語を選びます。',
        actionLabel: '言語を切り替える',
        enLabel: '英語',
        jaLabel: '日本語',
      },
      bgm: {
        title: 'BGM',
        description: 'デプロイ中に流してる音楽をオン·オフします。',
      },
      ai: {
        title: 'ガーデナーエージェントの性格',
        description: 'エージェントの話し方を選択します。',
        options: ['親切な庭師（フレンドリー）', '厳格なオペレーター（簡潔）', '海賊キャプテン（おちゃめ）'],
      },
    },
  } as const;
  const t = copy[language];

  return (
    <div className="h-full overflow-y-auto bg-stone-50 p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 font-logo">{t.title}</h2>
        <p className="text-slate-500">{t.subtitle}</p>
      </header>

      <div className="grid max-w-2xl gap-6">
        {/* Language Setting */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-violet-50 p-3 text-violet-600">
              <Languages size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{t.language.title}</h3>
              <p className="text-sm text-slate-500">{t.language.description}</p>
            </div>
          </div>
          <div className="flex gap-2" aria-label={t.language.actionLabel}>
            {(['en', 'ja'] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all border
                  ${language === code
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {code === 'en' ? t.language.enLabel : t.language.jaLabel}
              </button>
            ))}
          </div>
        </div>

        {/* BGM Setting */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-3 ${bgm ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              {bgm ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{t.bgm.title}</h3>
              <p className="text-sm text-slate-500">{t.bgm.description}</p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={bgm} onChange={() => setBgm(!bgm)} className="peer sr-only" />
            <div className="peer h-7 w-12 rounded-full border border-slate-200 bg-white after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-slate-200 after:transition-all after:content-[''] peer-checked:border-green-500 peer-checked:bg-emerald-100 peer-checked:after:translate-x-full peer-checked:after:bg-green-500 peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-green-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white"></div>
          </label>
        </div>

        {/* AI Persona Setting */}
        {/* TODO: Implement AI agent personality selection
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{t.ai.title}</h3>
              <p className="text-sm text-slate-500">{t.ai.description}</p>
            </div>
          </div>
          <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-green-500 focus:outline-none">
            {t.ai.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        */}
      </div>
    </div>
  );
}