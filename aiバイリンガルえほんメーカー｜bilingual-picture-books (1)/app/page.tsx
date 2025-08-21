// app/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Book, CreationParams, View } from "./lib/types";
// ★ サーバーアクションは使わないので削除
// import { generateStoryAndImages } from './actions';
import CreationForm from "./components/CreationForm";
import LoadingScreen from "./components/LoadingScreen";
import BookViewer from "./components/BookViewer";
import Bookshelf from "./components/Bookshelf";
import { Header } from "./components/Header";

// API から返る JSON の最低限の形
type ApiBook = {
  title: string;
  pages: { a: string; b: string; imageUrl?: string }[];
};

// UUID 生成（ブラウザ対応）
const uuid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`);

const HomePage: React.FC = () => {
  const [view, setView] = useState<View>("form");
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [bookshelf, setBookshelf] = useState<Book[]>([]);
  const [loadingMessage, setLoadingMessage] =
    useState<string>("絵本の準備をしています...");
  const [error, setError] = useState<string | null>(null);

  // 起動時に本棚を復元
  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem("ai-picture-books");
      if (savedBooks) setBookshelf(JSON.parse(savedBooks));
    } catch (e) {
      console.error("Failed to load books from localStorage", e);
    }
  }, []);

  const saveBooksToLocalStorage = useCallback((books: Book[]) => {
    try {
      localStorage.setItem("ai-picture-books", JSON.stringify(books));
    } catch (e) {
      console.error("Failed to save books to localStorage", e);
    }
  }, []);

  // ★ ここで /api/generate を呼び出して Book を作る
  const handleCreateBook = async (params: CreationParams) => {
    setView("loading");
    setError(null);
    setLoadingMessage("AIが絵本を一生懸命つくっています…");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params }),
      });

      const data = (await res.json()) as ApiBook | { error?: string };
      if (!res.ok || (data as any)?.error) {
        throw new Error((data as any)?.error || "API error");
      }

      const apiBook = data as ApiBook;

      // APIのJSON → あなたの Book 型へ整形
      const newBook: Book = {
        id: uuid(),
        title: apiBook.title ?? "Untitled",
        // あなたの型に合わせて必要なら imageUrl などを付与
        pages: apiBook.pages?.map((p) => ({
          a: p.a,
          b: p.b,
          imageUrl: p.imageUrl, // 画像生成を後で追加する場合に備えて保持
        })) as any,
        createdAt: new Date().toISOString(), // 型に無ければ無視されます
      };

      setCurrentBook(newBook);
      setView("viewer");
    } catch (err) {
      console.error(err);
      setError(
        "絵本の作成中にエラーが発生しました。もう一度試してください。"
      );
      setView("form");
    }
  };

  const handleAddToBookshelf = (book: Book) => {
    if (!bookshelf.some((b) => b.id === book.id)) {
      const updatedBookshelf = [...bookshelf, book];
      setBookshelf(updatedBookshelf);
      saveBooksToLocalStorage(updatedBookshelf);
    }
  };

  const handleViewBook = (book: Book) => {
    setCurrentBook(book);
    setView("viewer");
  };

  const handleDeleteFromBookshelf = (bookId: string) => {
    const updatedBookshelf = bookshelf.filter((b) => b.id !== bookId);
    setBookshelf(updatedBookshelf);
    saveBooksToLocalStorage(updatedBookshelf);
  };

  const renderContent = () => {
    switch (view) {
      case "loading":
        return <LoadingScreen message={loadingMessage} />;
      case "viewer":
        return (
          currentBook && (
            <BookViewer
              book={currentBook}
              onClose={() => setView(bookshelf.length > 0 ? "bookshelf" : "form")}
              onAddToBookshelf={handleAddToBookshelf}
              isBookInShelf={bookshelf.some((b) => b.id === currentBook.id)}
            />
          )
        );
      case "bookshelf":
        return (
          <Bookshelf
            books={bookshelf}
            onSelectBook={handleViewBook}
            onDeleteBook={handleDeleteFromBookshelf}
            onCreateNew={() => setView("form")}
          />
        );
      default:
        // ★ CreationForm はそのまま使い、onSubmit で API 呼び出し
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
