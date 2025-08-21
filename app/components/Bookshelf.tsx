import React from 'react';
import type { Book } from '@/app/lib/types';
import { TrashIcon } from './icons';
import { parseFurigana } from '@/app/lib/utils/textParser';

interface BookshelfProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onCreateNew: () => void;
}

const Bookshelf: React.FC<BookshelfProps> = ({ books, onSelectBook, onDeleteBook, onCreateNew }) => {
  const handleDelete = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation(); // Prevent onSelectBook from firing
    if (window.confirm('この絵本を本棚からさくじょしますか？')) {
      onDeleteBook(bookId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl md:text-4xl font-display text-amber-600">わたしの本棚</h2>
        <button onClick={onCreateNew} className="px-5 py-3 text-lg font-bold bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
          + あたらしい絵本
        </button>
      </div>
      
      {books.length === 0 ? (
        <div className="text-center py-20 bg-white/60 rounded-2xl">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-slate-600 text-lg">まだ本棚に絵本がありません。</p>
          <p className="text-slate-500 mt-2">さっそく、あたらしい絵本をつくってみよう！</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {books.map(book => (
            <div 
              key={book.id} 
              onClick={() => onSelectBook(book)} 
              className="group relative aspect-[3/4] bg-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:-translate-y-2 duration-300"
            >
              <img src={book.pages[0].image} alt={book.title} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
              <h3 className="absolute bottom-2 left-2 right-2 text-white text-sm font-bold p-1 leading-tight">{parseFurigana(book.title)}</h3>
              <button 
                onClick={(e) => handleDelete(e, book.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete book"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookshelf;