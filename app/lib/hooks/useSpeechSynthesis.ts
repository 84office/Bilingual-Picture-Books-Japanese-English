import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<{ja: SpeechSynthesisVoice | null, en: SpeechSynthesisVoice | null}>({ja: null, en: null});

  useEffect(() => {
    const loadAndSetVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length === 0) return;

      const selectVoice = (langPrefix: string, priorityList: string[]): SpeechSynthesisVoice | null => {
        const availableVoices = allVoices.filter(v => v.lang.startsWith(langPrefix));
        if (availableVoices.length === 0) return null;

        // Prioritize voices based on keywords for higher quality and desired gender
        for (const keyword of priorityList) {
          const found = availableVoices.find(v => v.name.includes(keyword));
          if (found) {
            return found;
          }
        }
        
        // Fallback for English: prefer US English default if available
        if (langPrefix === 'en') {
            const usDefault = availableVoices.find(v => v.lang === 'en-US' && v.default);
            if (usDefault) return usDefault;
        }

        // Final fallback to the first available voice for the language
        return availableVoices[0];
      };

      // Prioritized lists of known high-quality, gentle female voices for Japanese and English
      const jaVoicePriority = ['O-ren', 'Kyoko', 'Ayumi', 'Haruka', 'Google 日本語'];
      const enVoicePriority = ['Neural', 'Samantha', 'Zira', 'Allison', 'Google US English'];
      
      const bestJaVoice = selectVoice('ja', jaVoicePriority);
      const bestEnVoice = selectVoice('en', enVoicePriority);

      setVoices({ ja: bestJaVoice, en: bestEnVoice });
    };

    // getVoices() can be asynchronous. Use onvoiceschanged to ensure the list is loaded.
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = loadAndSetVoices;
    } else {
      loadAndSetVoices();
    }

    return () => {
      speechSynthesis.onvoiceschanged = null;
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, lang: 'ja' | 'en') => {
    if (isMuted || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = lang === 'ja' ? voices.ja : voices.en;
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
    utterance.pitch = 1; // Natural pitch
    utterance.rate = 0.85; // Slower, clearer rate suitable for children
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('SpeechSynthesisUtterance.onerror', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(utterance);
  }, [voices, isMuted]);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  const toggleMute = () => {
      setIsMuted(prev => {
          if(!prev === true){ // if we are muting
              cancel();
          }
          return !prev;
      })
  }

  return { speak, cancel, isSpeaking, isMuted, toggleMute };
};