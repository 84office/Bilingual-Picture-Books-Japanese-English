// app/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Book, CreationParams, View } from "./lib/types";
// ★ サーバーアクションは使わないので削除
// import { generateStoryAndImages } from './actions';
import LoadingScreen from "./components/LoadingScreen";
import BookViewer from "./components/BookViewer";
import Bookshelf from "./components/Bookshelf";
import CreationForm from "./components/CreationForm";
import { Header } from "./components/Header";
type ApiBook = {
  title: string;
  pages: { text: string; textEn: string; image?: string }[];
};

// UUID 生成（ブラウザ対応）
const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const HomePage: React.FC = () => {
  const [view, setView] = useState<View>("form");
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [bookshelf, setBookshelf] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ローカルストレージから本棚を読み込み
  useEffect(() => {
    const saved = localStorage.getItem("bookshelf");
    if (saved) {
      try {
        setBookshelf(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookshelf from localStorage:", e);
      }
    }
  }, []);

  // 本棚をローカルストレージに保存
  const saveBookshelf = useCallback((books: Book[]) => {
    localStorage.setItem("bookshelf", JSON.stringify(books));
    setBookshelf(books);
  }, []);

  const handleCreateBook = async (params: CreationParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiBook: ApiBook = await response.json();

      // APIのJSON → あなたの Book 型へ整形
      const newBook: Book = {
        id: uuid(),
        title: apiBook.title ?? "Untitled",
        language: params.language,
        // あなたの型に合わせて必要なら imageUrl などを付与
        pages: apiBook.pages?.map((p) => ({
          text: p.text,
          textEn: p.textEn,
          image: p.image || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800", // デフォルト画像
        })),
        params: params,
      };

      setCurrentBook(newBook);
      setView("book");

      // 本棚に追加
      const updatedBookshelf = [...bookshelf, newBook];
      saveBookshelf(updatedBookshelf);
    } catch (err) {
      console.error("Error creating book:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (book: Book) => {
    setCurrentBook(book);
    setView("book");
  };

  const handleDeleteBook = (bookId: string) => {
    const updatedBookshelf = bookshelf.filter((book) => book.id !== bookId);
    saveBookshelf(updatedBookshelf);

    // 現在表示中の本が削除された場合、フォーム画面に戻る
    if (currentBook?.id === bookId) {
      setCurrentBook(null);
      setView("form");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    switch (view) {
      case "form":
        return <CreationForm onSubmit={handleCreateBook} />;
      case "book":
        return currentBook ? (
          <BookViewer book={currentBook} />
        ) : (
          <div>No book selected</div>
        );
      case "bookshelf":
        return (
          <Bookshelf
            books={bookshelf}
            onSelectBook={handleSelectBook}
            onDeleteBook={handleDeleteBook}
          />
        );
      default:
        return <CreationForm onSubmit={handleCreateBook} />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header
        onHomeClick={() => setView("form")}
        onBookshelfClick={() => setView("bookshelf")}
        showBookshelf={bookshelf.length > 0}
      />
      <main className="container mx-auto p-4 md:p-6">
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default HomePage;