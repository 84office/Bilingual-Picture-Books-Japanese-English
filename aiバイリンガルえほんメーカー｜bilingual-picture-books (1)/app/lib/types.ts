export interface CreationParams {
  name: string;
  gender: 'おとこのこ' | 'おんなのこ';
  animals: string[];
  theme: string;
  language: 'japanese' | 'english' | 'bilingual';
}

export interface Page {
  text: string; // Japanese text with furigana
  textEn: string; // English text
  image: string; // base64 encoded image
}

export interface Book {
  id: string;
  title: string;
  pages: Page[];
  params: CreationParams;
  language: 'japanese' | 'english' | 'bilingual';
}

export type View = 'form' | 'loading' | 'viewer' | 'bookshelf';