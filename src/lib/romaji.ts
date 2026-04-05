/**
 * Converts a hiragana string to romaji.
 * Handles standard hiragana, digraphs (きゃ etc.), long vowels (っ), and ん.
 */

const DIGRAPHS: Record<string, string> = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  じゃ: "ja",  じゅ: "ju",  じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
};

const SINGLE: Record<string, string> = {
  あ: "a",  い: "i",  う: "u",  え: "e",  お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi",す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi",つ: "tsu",て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", を: "wo", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  // small vowels (standalone)
  ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o",
};

export function hiraganaToRomaji(hiragana: string): string {
  // Handle slash-separated readings like "し/よん" → convert each part
  if (hiragana.includes("/")) {
    return hiragana
      .split("/")
      .map((part) => hiraganaToRomaji(part.trim()))
      .join(" / ");
  }

  let result = "";
  let i = 0;
  const chars = [...hiragana]; // handle multi-byte correctly

  while (i < chars.length) {
    // っ — double the next consonant
    if (chars[i] === "っ") {
      // peek at digraph or single next char
      const digraph = chars[i + 1] + chars[i + 2];
      const next = DIGRAPHS[digraph] ?? SINGLE[chars[i + 1]] ?? "";
      result += next ? next[0] : ""; // double first consonant
      i++;
      continue;
    }

    // Try digraph (2 chars)
    const digraph = chars[i] + chars[i + 1];
    if (DIGRAPHS[digraph]) {
      result += DIGRAPHS[digraph];
      i += 2;
      continue;
    }

    // Single char
    const single = SINGLE[chars[i]];
    if (single) {
      result += single;
      i++;
      continue;
    }

    // Pass through non-hiragana characters (numbers, punctuation, katakana loan words, etc.)
    result += chars[i];
    i++;
  }

  return result;
}
