import React from 'react';

export const parseFurigana = (text: string): React.ReactNode => {
  const parts = text.split(/([一-龯]+)\(([^)]+)\)/g); // Splits by 漢字(ふりがな)
  return parts.map((part, index) => {
    // Every 3rd part is the kanji, and the 4th is the furigana.
    // Index 0, 1, 2, 3, 4, 5, 6...
    // Plain, Kanji, Furigana, Plain, Kanji, Furigana, Plain...
    const isKanjiGroup = index % 3 === 1;

    if (isKanjiGroup && parts[index + 1]) {
      const kanji = part;
      const furigana = parts[index + 1];
      // Use standard <ruby> structure for correct alignment.
      // Removed "inline-block" style and <rb> tag which were causing layout issues.
      return React.createElement(
        'ruby',
        { key: index },
        kanji,
        React.createElement('rt', { className: 'text-xs' }, furigana)
      );
    }
    
    const isFuriganaPart = index % 3 === 2;
    if (isFuriganaPart) {
      return null; // Don't render furigana part directly
    }

    return part; // Render plain text part
  });
};
