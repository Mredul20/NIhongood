export interface KanaChar {
  char: string;
  romaji: string;
  type: "hiragana" | "katakana";
  group: string;
  row: number;
  col: number;
}

export const HIRAGANA: KanaChar[] = [
  // Vowels
  { char: "あ", romaji: "a", type: "hiragana", group: "vowel", row: 0, col: 0 },
  { char: "い", romaji: "i", type: "hiragana", group: "vowel", row: 0, col: 1 },
  { char: "う", romaji: "u", type: "hiragana", group: "vowel", row: 0, col: 2 },
  { char: "え", romaji: "e", type: "hiragana", group: "vowel", row: 0, col: 3 },
  { char: "お", romaji: "o", type: "hiragana", group: "vowel", row: 0, col: 4 },
  // K-row
  { char: "か", romaji: "ka", type: "hiragana", group: "k", row: 1, col: 0 },
  { char: "き", romaji: "ki", type: "hiragana", group: "k", row: 1, col: 1 },
  { char: "く", romaji: "ku", type: "hiragana", group: "k", row: 1, col: 2 },
  { char: "け", romaji: "ke", type: "hiragana", group: "k", row: 1, col: 3 },
  { char: "こ", romaji: "ko", type: "hiragana", group: "k", row: 1, col: 4 },
  // S-row
  { char: "さ", romaji: "sa", type: "hiragana", group: "s", row: 2, col: 0 },
  { char: "し", romaji: "shi", type: "hiragana", group: "s", row: 2, col: 1 },
  { char: "す", romaji: "su", type: "hiragana", group: "s", row: 2, col: 2 },
  { char: "せ", romaji: "se", type: "hiragana", group: "s", row: 2, col: 3 },
  { char: "そ", romaji: "so", type: "hiragana", group: "s", row: 2, col: 4 },
  // T-row
  { char: "た", romaji: "ta", type: "hiragana", group: "t", row: 3, col: 0 },
  { char: "ち", romaji: "chi", type: "hiragana", group: "t", row: 3, col: 1 },
  { char: "つ", romaji: "tsu", type: "hiragana", group: "t", row: 3, col: 2 },
  { char: "て", romaji: "te", type: "hiragana", group: "t", row: 3, col: 3 },
  { char: "と", romaji: "to", type: "hiragana", group: "t", row: 3, col: 4 },
  // N-row
  { char: "な", romaji: "na", type: "hiragana", group: "n", row: 4, col: 0 },
  { char: "に", romaji: "ni", type: "hiragana", group: "n", row: 4, col: 1 },
  { char: "ぬ", romaji: "nu", type: "hiragana", group: "n", row: 4, col: 2 },
  { char: "ね", romaji: "ne", type: "hiragana", group: "n", row: 4, col: 3 },
  { char: "の", romaji: "no", type: "hiragana", group: "n", row: 4, col: 4 },
  // H-row
  { char: "は", romaji: "ha", type: "hiragana", group: "h", row: 5, col: 0 },
  { char: "ひ", romaji: "hi", type: "hiragana", group: "h", row: 5, col: 1 },
  { char: "ふ", romaji: "fu", type: "hiragana", group: "h", row: 5, col: 2 },
  { char: "へ", romaji: "he", type: "hiragana", group: "h", row: 5, col: 3 },
  { char: "ほ", romaji: "ho", type: "hiragana", group: "h", row: 5, col: 4 },
  // M-row
  { char: "ま", romaji: "ma", type: "hiragana", group: "m", row: 6, col: 0 },
  { char: "み", romaji: "mi", type: "hiragana", group: "m", row: 6, col: 1 },
  { char: "む", romaji: "mu", type: "hiragana", group: "m", row: 6, col: 2 },
  { char: "め", romaji: "me", type: "hiragana", group: "m", row: 6, col: 3 },
  { char: "も", romaji: "mo", type: "hiragana", group: "m", row: 6, col: 4 },
  // Y-row
  { char: "や", romaji: "ya", type: "hiragana", group: "y", row: 7, col: 0 },
  { char: "ゆ", romaji: "yu", type: "hiragana", group: "y", row: 7, col: 2 },
  { char: "よ", romaji: "yo", type: "hiragana", group: "y", row: 7, col: 4 },
  // R-row
  { char: "ら", romaji: "ra", type: "hiragana", group: "r", row: 8, col: 0 },
  { char: "り", romaji: "ri", type: "hiragana", group: "r", row: 8, col: 1 },
  { char: "る", romaji: "ru", type: "hiragana", group: "r", row: 8, col: 2 },
  { char: "れ", romaji: "re", type: "hiragana", group: "r", row: 8, col: 3 },
  { char: "ろ", romaji: "ro", type: "hiragana", group: "r", row: 8, col: 4 },
  // W-row + N
  { char: "わ", romaji: "wa", type: "hiragana", group: "w", row: 9, col: 0 },
  { char: "を", romaji: "wo", type: "hiragana", group: "w", row: 9, col: 4 },
  { char: "ん", romaji: "n", type: "hiragana", group: "special", row: 10, col: 0 },
];

export const KATAKANA: KanaChar[] = [
  // Vowels
  { char: "ア", romaji: "a", type: "katakana", group: "vowel", row: 0, col: 0 },
  { char: "イ", romaji: "i", type: "katakana", group: "vowel", row: 0, col: 1 },
  { char: "ウ", romaji: "u", type: "katakana", group: "vowel", row: 0, col: 2 },
  { char: "エ", romaji: "e", type: "katakana", group: "vowel", row: 0, col: 3 },
  { char: "オ", romaji: "o", type: "katakana", group: "vowel", row: 0, col: 4 },
  // K-row
  { char: "カ", romaji: "ka", type: "katakana", group: "k", row: 1, col: 0 },
  { char: "キ", romaji: "ki", type: "katakana", group: "k", row: 1, col: 1 },
  { char: "ク", romaji: "ku", type: "katakana", group: "k", row: 1, col: 2 },
  { char: "ケ", romaji: "ke", type: "katakana", group: "k", row: 1, col: 3 },
  { char: "コ", romaji: "ko", type: "katakana", group: "k", row: 1, col: 4 },
  // S-row
  { char: "サ", romaji: "sa", type: "katakana", group: "s", row: 2, col: 0 },
  { char: "シ", romaji: "shi", type: "katakana", group: "s", row: 2, col: 1 },
  { char: "ス", romaji: "su", type: "katakana", group: "s", row: 2, col: 2 },
  { char: "セ", romaji: "se", type: "katakana", group: "s", row: 2, col: 3 },
  { char: "ソ", romaji: "so", type: "katakana", group: "s", row: 2, col: 4 },
  // T-row
  { char: "タ", romaji: "ta", type: "katakana", group: "t", row: 3, col: 0 },
  { char: "チ", romaji: "chi", type: "katakana", group: "t", row: 3, col: 1 },
  { char: "ツ", romaji: "tsu", type: "katakana", group: "t", row: 3, col: 2 },
  { char: "テ", romaji: "te", type: "katakana", group: "t", row: 3, col: 3 },
  { char: "ト", romaji: "to", type: "katakana", group: "t", row: 3, col: 4 },
  // N-row
  { char: "ナ", romaji: "na", type: "katakana", group: "n", row: 4, col: 0 },
  { char: "ニ", romaji: "ni", type: "katakana", group: "n", row: 4, col: 1 },
  { char: "ヌ", romaji: "nu", type: "katakana", group: "n", row: 4, col: 2 },
  { char: "ネ", romaji: "ne", type: "katakana", group: "n", row: 4, col: 3 },
  { char: "ノ", romaji: "no", type: "katakana", group: "n", row: 4, col: 4 },
  // H-row
  { char: "ハ", romaji: "ha", type: "katakana", group: "h", row: 5, col: 0 },
  { char: "ヒ", romaji: "hi", type: "katakana", group: "h", row: 5, col: 1 },
  { char: "フ", romaji: "fu", type: "katakana", group: "h", row: 5, col: 2 },
  { char: "ヘ", romaji: "he", type: "katakana", group: "h", row: 5, col: 3 },
  { char: "ホ", romaji: "ho", type: "katakana", group: "h", row: 5, col: 4 },
  // M-row
  { char: "マ", romaji: "ma", type: "katakana", group: "m", row: 6, col: 0 },
  { char: "ミ", romaji: "mi", type: "katakana", group: "m", row: 6, col: 1 },
  { char: "ム", romaji: "mu", type: "katakana", group: "m", row: 6, col: 2 },
  { char: "メ", romaji: "me", type: "katakana", group: "m", row: 6, col: 3 },
  { char: "モ", romaji: "mo", type: "katakana", group: "m", row: 6, col: 4 },
  // Y-row
  { char: "ヤ", romaji: "ya", type: "katakana", group: "y", row: 7, col: 0 },
  { char: "ユ", romaji: "yu", type: "katakana", group: "y", row: 7, col: 2 },
  { char: "ヨ", romaji: "yo", type: "katakana", group: "y", row: 7, col: 4 },
  // R-row
  { char: "ラ", romaji: "ra", type: "katakana", group: "r", row: 8, col: 0 },
  { char: "リ", romaji: "ri", type: "katakana", group: "r", row: 8, col: 1 },
  { char: "ル", romaji: "ru", type: "katakana", group: "r", row: 8, col: 2 },
  { char: "レ", romaji: "re", type: "katakana", group: "r", row: 8, col: 3 },
  { char: "ロ", romaji: "ro", type: "katakana", group: "r", row: 8, col: 4 },
  // W-row + N
  { char: "ワ", romaji: "wa", type: "katakana", group: "w", row: 9, col: 0 },
  { char: "ヲ", romaji: "wo", type: "katakana", group: "w", row: 9, col: 4 },
  { char: "ン", romaji: "n", type: "katakana", group: "special", row: 10, col: 0 },
];

export const KANA_GROUPS = [
  { id: "vowel", label: "Vowels", chars: "a i u e o" },
  { id: "k", label: "K-row", chars: "ka ki ku ke ko" },
  { id: "s", label: "S-row", chars: "sa shi su se so" },
  { id: "t", label: "T-row", chars: "ta chi tsu te to" },
  { id: "n", label: "N-row", chars: "na ni nu ne no" },
  { id: "h", label: "H-row", chars: "ha hi fu he ho" },
  { id: "m", label: "M-row", chars: "ma mi mu me mo" },
  { id: "y", label: "Y-row", chars: "ya yu yo" },
  { id: "r", label: "R-row", chars: "ra ri ru re ro" },
  { id: "w", label: "W-row", chars: "wa wo" },
  { id: "special", label: "Special", chars: "n" },
];

export const ALL_KANA = [...HIRAGANA, ...KATAKANA];
