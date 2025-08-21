import React, { useState } from 'react';
import type { CreationParams } from '../lib/types';
import { ANIMALS, THEMES, LANGUAGES } from '../lib/constants';

interface CreationFormProps {
  onSubmit: (params: CreationParams) => void;
}

const CreationForm: React.FC<CreationFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'おとこのこ' | 'おんなのこ'>('おとこのこ');
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [theme, setTheme] = useState(THEMES[0].name);
  const [language, setLanguage] = useState<'japanese' | 'english' | 'bilingual'>('japanese');

  const toggleAnimal = (animalName: string) => {
    setSelectedAnimals(prev =>
      prev.includes(animalName)
        ? prev.filter(a => a !== animalName)
        : [...prev, animalName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedAnimals.length > 0) {
      onSubmit({ name, gender, animals: selectedAnimals, theme, language });
    } else {
      alert('なまえを いれて、すきな どうぶつを えらんでね！');
    }
  };

  const cardBaseClasses = "p-4 rounded-2xl cursor-pointer transition-all duration-200 transform text-center shadow-md border-4";
  const unselectedClasses = "bg-white border-transparent hover:scale-105 hover:shadow-lg";
  const selectedClasses = "bg-yellow-200 border-yellow-400 scale-105 shadow-xl";

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-10 space-y-8 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-display text-center text-amber-600">あたらしい絵本をつくる</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Name Input */}
        <div className="space-y-3">
          <label htmlFor="name" className="text-xl font-bold text-slate-700 flex items-center gap-2"><span className="text-3xl">✏️</span>きみの なまえは？</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="ひらがな や カタカナで いれてね"
            className="w-full p-4 text-lg border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-400 transition"
            required
          />
        </div>

        {/* Gender Selection */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2"><span className="text-3xl">👤</span>せいべつは？</h3>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setGender('おとこのこ')} className={`${cardBaseClasses} ${gender === 'おとこのこ' ? 'bg-blue-200 border-blue-400 scale-105 shadow-xl' : unselectedClasses}`}>
              <span className="text-4xl">👦</span>
              <p className="font-bold text-lg mt-2 text-blue-800">おとこのこ</p>
            </button>
            <button type="button" onClick={() => setGender('おんなのこ')} className={`${cardBaseClasses} ${gender === 'おんなのこ' ? 'bg-pink-200 border-pink-400 scale-105 shadow-xl' : unselectedClasses}`}>
              <span className="text-4xl">👧</span>
              <p className="font-bold text-lg mt-2 text-pink-800">おんなのこ</p>
            </button>
          </div>
        </div>

        {/* Animal Selection */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2"><span className="text-3xl">🐾</span>どんな どうぶつが すき？ <span className="text-sm font-normal">(いくつでも えらんでね)</span></h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {ANIMALS.map(animal => (
              <div key={animal.id} onClick={() => toggleAnimal(animal.name)} className={`${cardBaseClasses} ${selectedAnimals.includes(animal.name) ? selectedClasses : unselectedClasses}`}>
                <span className="text-4xl">{animal.emoji}</span>
                <p className="font-bold mt-2 text-slate-700">{animal.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2"><span className="text-3xl">📖</span>どんな おはなしが いい？</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {THEMES.map(t => (
              <div key={t.id} onClick={() => setTheme(t.name)} className={`${cardBaseClasses} ${theme === t.name ? selectedClasses : unselectedClasses}`}>
                <span className="text-3xl">{t.emoji}</span>
                <p className="font-bold text-sm md:text-base mt-2 text-slate-700">{t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2"><span className="text-3xl">🌐</span>ことばを えらんでね</h3>
          <div className="grid grid-cols-3 gap-4">
            {LANGUAGES.map(l => (
              <div key={l.id} onClick={() => setLanguage(l.id as any)} className={`${cardBaseClasses} ${language === l.id ? selectedClasses : unselectedClasses}`}>
                <span className="text-3xl">{l.emoji}</span>
                <p className="font-bold text-sm md:text-base mt-2 text-slate-700">{l.name}</p>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full py-5 text-2xl font-display bg-orange-500 text-white rounded-2xl shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={!name.trim() || selectedAnimals.length === 0}>
          絵本をつくる！
        </button>
      </form>
    </div>
  );
};

export default CreationForm;