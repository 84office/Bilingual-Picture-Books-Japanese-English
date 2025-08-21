"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Book, CreationParams, View } from './lib/types';
import { generateStoryAndImages } from './actions';
import CreationForm from './components/CreationForm';
import LoadingScreen from './components/LoadingScreen';
import BookViewer from './components/BookViewer';
import Bookshelf from './components/Bookshelf';
import { Header } from './components/Header';

const HomePage: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [bookshelf, setBookshelf] = useState<Book[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('絵本の準備をしています...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem('ai-picture-books');
      if (savedBooks) {
        setBookshelf(JSON.parse(savedBooks));
      }
    } catch (e) {
      console.error('Failed to load books from localStorage', e);
    }
  }, []);

  const saveBooksToLocalStorage = useCallback((books: Book[]) => {
    try {
      localStorage.setItem('ai-picture-books', JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage', e);
    }
  }, []);

  const handleCreateBook = async (params: CreationParams) => {
    setView('loading');
    setError(null);
    setLoadingMessage('AIが絵本を一生懸命つくっています…');
    
    try {
      const newBook = await generateStoryAndImages(params);
      
      if (!newBook) {
        throw new Error('Book generation failed and returned no result.');
      }

      setCurrentBook(newBook);
      setView('viewer');
    } catch (err) {
      console.error(err);
      setError('絵本の作成中にエラーが発生しました。もう一度試してください。');
      setView('form');
    }
  };
  
  const handleAddToBookshelf = (book: Book) => {
    // Prevent adding duplicates
    if (!bookshelf.some(b => b.id === book.id)) {
      const updatedBookshelf = [...bookshelf, book];
      setBookshelf(updatedBookshelf);
      saveBooksToLocalStorage(updatedBookshelf);
    }
  };

  const handleViewBook = (book: Book) => {
    setCurrentBook(book);
    setView('viewer');
  };

  const handleDeleteFromBookshelf = (bookId: string) => {
    const updatedBookshelf = bookshelf.filter(b => b.id !== bookId);
    setBookshelf(updatedBookshelf);
    saveBooksToLocalStorage(updatedBookshelf);
  };
  
  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingScreen message={loadingMessage} />;
      case 'viewer':
        if (currentBook) {
          return <BookViewer 
                    book={currentBook} 
                    onClose={() => setView(bookshelf.length > 0 ? 'bookshelf' : 'form')}
                    onAddToBookshelf={handleAddToBookshelf}
                    isBookInShelf={bookshelf.some(b => b.id === currentBook.id)}
                 />;
        }
        return null;
      case 'bookshelf':
        return <Bookshelf 
                  books={bookshelf} 
                  onSelectBook={handleViewBook} 
                  onDeleteBook={handleDeleteFromBookshelf}
                  onCreateNew={() => setView('form')}
               />;
      default:
        return <CreationForm onSubmit={handleCreateBook} />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header 
        onHomeClick={() => setView('form')} 
        onBookshelfClick={() => setView('bookshelf')}
        showBookshelf={bookshelf.length > 0}
      />
      <main className="container mx-auto p-4 md:p-6">
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
        {renderContent()}
      </main>
    </div>
  );
};

export default HomePage;
