import React from 'react';
import { HomeIcon, BookshelfIcon } from './icons';

interface HeaderProps {
    onHomeClick: () => void;
    onBookshelfClick: () => void;
    showBookshelf: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick, onBookshelfClick, showBookshelf }) => {
    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div onClick={onHomeClick} className="cursor-pointer">
                    <h1 className="text-xl md:text-2xl font-display text-orange-500">AIバイリンガルえほんメーカー｜Bilingual Picture Books</h1>
                </div>
                {showBookshelf && (
                    <nav>
                        <ul className="flex items-center gap-4">
                            <li>
                                <button onClick={onHomeClick} className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors">
                                    <HomeIcon/>
                                    <span className="hidden sm:inline font-bold">ホーム</span>
                                </button>
                            </li>
                             <li>
                                <button onClick={onBookshelfClick} className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors">
                                    <BookshelfIcon/>
                                    <span className="hidden sm:inline font-bold">本棚</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};