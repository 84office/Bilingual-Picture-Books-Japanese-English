
import React, { useState, useEffect } from 'react';
import type { Book } from '../app/lib/types';
import { useSpeechSynthesis } from '../app/lib/hooks/useSpeechSynthesis';
import { parseFurigana } from '../app/lib/utils/textParser';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, SpeakerOnIcon, SpeakerOffIcon, TextIcon, NoTextIcon, CloseIcon, GlobeIcon, BookshelfIcon } from './icons';

interface BookViewerProps {
  book: Book;
  onClose: () => void;
  onAddToBookshelf: (book: Book) => void;
  isBookInShelf: boolean;
}

const BookViewer: React.FC<BookViewerProps> = ({ book, onClose, onAddToBookshelf, isBookInShelf }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [textDisplay, setTextDisplay] = useState<'both' | 'ja' | 'en'>('both');
  const { speak, cancel, isSpeaking, isMuted, toggleMute } = useSpeechSynthesis();
  const [added, setAdded] = useState(isBookInShelf);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);
  
  useEffect(() => {
    setCurrentPage(0);
    setTextDisplay('both');
    setAdded(isBookInShelf);
    cancel();
  }, [book, isBookInShelf, cancel]);


  const handleNextPage = () => {
    if (currentPage < book.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      cancel();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      cancel();
    }
  };
  
  const handleAddToBookshelf = () => {
    onAddToBookshelf(book);
    setAdded(true);
  }

  const handleNarration = (lang: 'ja' | 'en') => {
    if (isSpeaking) {
      cancel();
    } else {
      const textToRead = lang === 'ja'
        ? book.pages[currentPage].text.replace(/\([^)]+\)/g, '') // Remove furigana for TTS
        : book.pages[currentPage].textEn;
      if (textToRead?.trim()) {
        speak(textToRead, lang);
      }
    }
  };

  const cycleTextDisplay = () => {
    setTextDisplay(prev => {
      if (prev === 'both') return 'ja';
      if (prev === 'ja') return 'en';
      return 'both';
    });
  };

  const getTextDisplayLabel = () => {
    if (textDisplay === 'ja') return '日本語のみ';
    if (textDisplay === 'en') return '英語のみ';
    return '両方表示';
  };


  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* This container becomes relative on desktop to contain the absolute positioned text */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden md:relative">
        {/* Image container */}
        <div className="aspect-[4/3]">
          <img
            key={currentPage} // Re-trigger animation on page change
            src={book.pages[currentPage].image}
            alt={`Illustration for page ${currentPage + 1}`}
            className="w-full h-full object-cover animate-fade-in"
          />
        </div>
        
        {/* Text container: stacked on mobile, overlay on desktop */}
        {isTextVisible && (
          <div className="p-4 text-slate-800 text-base leading-relaxed border-t border-slate-200
                          md:absolute md:bottom-0 md:left-0 md:right-0 md:border-t-0
                          md:bg-black/50 md:p-4 md:text-white md:text-lg md:leading-relaxed md:backdrop-blur-sm">
            {(book.language === 'japanese' || (book.language === 'bilingual' && (textDisplay === 'ja' || textDisplay === 'both'))) && book.pages[currentPage].text && (
              <div className="mb-1">{parseFurigana(book.pages[currentPage].text)}</div>
            )}
            {(book.language === 'english' || (book.language === 'bilingual' && (textDisplay === 'en' || textDisplay === 'both'))) && book.pages[currentPage].textEn && (
              <div className="opacity-90 font-sans">{book.pages[currentPage].textEn}</div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-slate-600 font-bold">
          {currentPage + 1} / {book.pages.length}
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevPage} disabled={currentPage === 0} className="p-3 bg-white rounded-full shadow-md disabled:opacity-50 transition transform hover:scale-110"><ChevronLeftIcon /></button>
          <button onClick={handleNextPage} disabled={currentPage === book.pages.length - 1} className="p-3 bg-white rounded-full shadow-md disabled:opacity-50 transition transform hover:scale-110"><ChevronRightIcon /></button>
        </div>
      </div>

      <div className="mt-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg flex flex-wrap justify-center items-center gap-3 md:gap-4">
        {isSpeaking ? (
           <button onClick={() => cancel()} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full font-bold transition transform hover:scale-105">
             <PauseIcon/> やめる
           </button>
        ) : (
          <>
            {book.language !== 'english' && book.pages[currentPage].text && (
              <button onClick={() => handleNarration('ja')} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full font-bold transition transform hover:scale-105">
                  <PlayIcon/> 日本語でよむ
              </button>
            )}
            {book.language !== 'japanese' && book.pages[currentPage].textEn && (
              <button onClick={() => handleNarration('en')} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-full font-bold transition transform hover:scale-105">
                  <PlayIcon/> Read in English
              </button>
            )}
          </>
        )}
        <button onClick={toggleMute} className="p-3 bg-white rounded-full shadow-md transition transform hover:scale-110">
          {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
        </button>
        <button onClick={() => setIsTextVisible(!isTextVisible)} className="p-3 bg-white rounded-full shadow-md transition transform hover:scale-110">
          {isTextVisible ? <NoTextIcon /> : <TextIcon />}
        </button>
        {book.language === 'bilingual' && isTextVisible && (
          <button onClick={cycleTextDisplay} className="flex items-center gap-2 px-3 py-2 bg-white text-slate-700 rounded-full font-bold shadow-md transition transform hover:scale-105">
            <GlobeIcon /> {getTextDisplayLabel()}
          </button>
        )}
        {!added && (
           <button onClick={handleAddToBookshelf} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-bold transition transform hover:scale-105">
             <BookshelfIcon /> 本棚に追加
           </button>
        )}
        <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full font-bold transition transform hover:scale-105">
          <CloseIcon/> 閉じる
        </button>
      </div>
    </div>
  );
};

export default BookViewer;
