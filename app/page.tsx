@@ .. @@
import type { Book, CreationParams, View } from "./lib/types";
// ★ サーバーアクションは使わないので削除
// import { generateStoryAndImages } from './actions';
-import CreationForm from "./components/CreationForm";
import LoadingScreen from "./components/LoadingScreen";
import BookViewer from "./components/BookViewer";
import Bookshelf from "./components/Bookshelf";
import CreationForm from "../components/CreationForm";
import LoadingScreen from "../components/LoadingScreen";
import BookViewer from "../components/BookViewer";
import Bookshelf from "../components/Bookshelf";
import { Header } from "../components/Header";