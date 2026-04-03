export interface VocabWord {
  id: string;
  kanji: string;
  hiragana: string;
  english: string;
  partOfSpeech: string;
  level: "N5" | "N4";
  example: { ja: string; en: string };
  category: string;
}

export const VOCABULARY: VocabWord[] = [
  // Greetings
  { id: "v1", kanji: "こんにちは", hiragana: "こんにちは", english: "Hello / Good afternoon", partOfSpeech: "expression", level: "N5", example: { ja: "こんにちは、元気ですか？", en: "Hello, how are you?" }, category: "greetings" },
  { id: "v2", kanji: "おはよう", hiragana: "おはよう", english: "Good morning", partOfSpeech: "expression", level: "N5", example: { ja: "おはようございます。", en: "Good morning. (polite)" }, category: "greetings" },
  { id: "v3", kanji: "ありがとう", hiragana: "ありがとう", english: "Thank you", partOfSpeech: "expression", level: "N5", example: { ja: "ありがとうございます。", en: "Thank you very much." }, category: "greetings" },
  { id: "v4", kanji: "すみません", hiragana: "すみません", english: "Excuse me / Sorry", partOfSpeech: "expression", level: "N5", example: { ja: "すみません、駅はどこですか？", en: "Excuse me, where is the station?" }, category: "greetings" },
  { id: "v5", kanji: "さようなら", hiragana: "さようなら", english: "Goodbye", partOfSpeech: "expression", level: "N5", example: { ja: "さようなら、また明日。", en: "Goodbye, see you tomorrow." }, category: "greetings" },

  // Numbers
  { id: "v6",  kanji: "一", hiragana: "いち", english: "One", partOfSpeech: "number", level: "N5", example: { ja: "一つください。", en: "One please." }, category: "numbers" },
  { id: "v7",  kanji: "二", hiragana: "に", english: "Two", partOfSpeech: "number", level: "N5", example: { ja: "二人です。", en: "It's two people." }, category: "numbers" },
  { id: "v8",  kanji: "三", hiragana: "さん", english: "Three", partOfSpeech: "number", level: "N5", example: { ja: "三時に会いましょう。", en: "Let's meet at three o'clock." }, category: "numbers" },
  { id: "v8b", kanji: "四", hiragana: "し/よん", english: "Four", partOfSpeech: "number", level: "N5", example: { ja: "四人家族です。", en: "We are a family of four." }, category: "numbers" },
  { id: "v8c", kanji: "五", hiragana: "ご", english: "Five", partOfSpeech: "number", level: "N5", example: { ja: "五分待ってください。", en: "Please wait five minutes." }, category: "numbers" },
  { id: "v8d", kanji: "六", hiragana: "ろく", english: "Six", partOfSpeech: "number", level: "N5", example: { ja: "六時に起きます。", en: "I wake up at six o'clock." }, category: "numbers" },
  { id: "v8e", kanji: "七", hiragana: "しち/なな", english: "Seven", partOfSpeech: "number", level: "N5", example: { ja: "七日間旅行します。", en: "I travel for seven days." }, category: "numbers" },
  { id: "v8f", kanji: "八", hiragana: "はち", english: "Eight", partOfSpeech: "number", level: "N5", example: { ja: "八時に始まります。", en: "It starts at eight o'clock." }, category: "numbers" },
  { id: "v8g", kanji: "九", hiragana: "く/きゅう", english: "Nine", partOfSpeech: "number", level: "N5", example: { ja: "九月に日本へ行きます。", en: "I'm going to Japan in September." }, category: "numbers" },
  { id: "v8h", kanji: "十", hiragana: "じゅう", english: "Ten", partOfSpeech: "number", level: "N5", example: { ja: "十個買いました。", en: "I bought ten of them." }, category: "numbers" },
  { id: "v8i", kanji: "十一", hiragana: "じゅういち", english: "Eleven", partOfSpeech: "number", level: "N5", example: { ja: "十一時に寝ます。", en: "I go to sleep at eleven." }, category: "numbers" },
  { id: "v8j", kanji: "十二", hiragana: "じゅうに", english: "Twelve", partOfSpeech: "number", level: "N5", example: { ja: "十二月はクリスマスです。", en: "December is Christmas." }, category: "numbers" },
  { id: "v8k", kanji: "二十", hiragana: "にじゅう", english: "Twenty", partOfSpeech: "number", level: "N5", example: { ja: "二十歳になりました。", en: "I turned twenty years old." }, category: "numbers" },
  { id: "v8l", kanji: "三十", hiragana: "さんじゅう", english: "Thirty", partOfSpeech: "number", level: "N5", example: { ja: "三十分かかります。", en: "It takes thirty minutes." }, category: "numbers" },
  { id: "v8m", kanji: "五十", hiragana: "ごじゅう", english: "Fifty", partOfSpeech: "number", level: "N5", example: { ja: "五十円のお釣りです。", en: "Here is 50 yen change." }, category: "numbers" },
  { id: "v9",  kanji: "百", hiragana: "ひゃく", english: "Hundred", partOfSpeech: "number", level: "N5", example: { ja: "百円です。", en: "It's 100 yen." }, category: "numbers" },
  { id: "v9b", kanji: "二百", hiragana: "にひゃく", english: "Two hundred", partOfSpeech: "number", level: "N5", example: { ja: "二百円かかります。", en: "It costs 200 yen." }, category: "numbers" },
  { id: "v9c", kanji: "五百", hiragana: "ごひゃく", english: "Five hundred", partOfSpeech: "number", level: "N5", example: { ja: "五百円玉を持っています。", en: "I have a 500 yen coin." }, category: "numbers" },
  { id: "v10", kanji: "千", hiragana: "せん", english: "Thousand", partOfSpeech: "number", level: "N5", example: { ja: "千円札をください。", en: "Please give me a 1000 yen bill." }, category: "numbers" },
  { id: "v10b", kanji: "一万", hiragana: "いちまん", english: "Ten thousand", partOfSpeech: "number", level: "N5", example: { ja: "一万円札です。", en: "It's a 10,000 yen bill." }, category: "numbers" },
  { id: "v10c", kanji: "零", hiragana: "れい/ゼロ", english: "Zero", partOfSpeech: "number", level: "N5", example: { ja: "点数はゼロです。", en: "The score is zero." }, category: "numbers" },
  { id: "v10d", kanji: "何", hiragana: "なん/なに", english: "What / How many", partOfSpeech: "pronoun", level: "N5", example: { ja: "何人いますか？", en: "How many people are there?" }, category: "numbers" },

  // People
  { id: "v11", kanji: "人", hiragana: "ひと", english: "Person", partOfSpeech: "noun", level: "N5", example: { ja: "あの人は先生です。", en: "That person is a teacher." }, category: "people" },
  { id: "v12", kanji: "男", hiragana: "おとこ", english: "Man / Male", partOfSpeech: "noun", level: "N5", example: { ja: "男の子が走っている。", en: "The boy is running." }, category: "people" },
  { id: "v13", kanji: "女", hiragana: "おんな", english: "Woman / Female", partOfSpeech: "noun", level: "N5", example: { ja: "女の人が歌っている。", en: "The woman is singing." }, category: "people" },
  { id: "v14", kanji: "友達", hiragana: "ともだち", english: "Friend", partOfSpeech: "noun", level: "N5", example: { ja: "友達と映画を見ました。", en: "I watched a movie with a friend." }, category: "people" },
  { id: "v15", kanji: "先生", hiragana: "せんせい", english: "Teacher", partOfSpeech: "noun", level: "N5", example: { ja: "先生はとても優しいです。", en: "The teacher is very kind." }, category: "people" },
  { id: "v16", kanji: "学生", hiragana: "がくせい", english: "Student", partOfSpeech: "noun", level: "N5", example: { ja: "私は学生です。", en: "I am a student." }, category: "people" },

  // Time
  { id: "v17", kanji: "今日", hiragana: "きょう", english: "Today", partOfSpeech: "noun", level: "N5", example: { ja: "今日は暑いです。", en: "Today is hot." }, category: "time" },
  { id: "v18", kanji: "明日", hiragana: "あした", english: "Tomorrow", partOfSpeech: "noun", level: "N5", example: { ja: "明日学校に行きます。", en: "I will go to school tomorrow." }, category: "time" },
  { id: "v19", kanji: "昨日", hiragana: "きのう", english: "Yesterday", partOfSpeech: "noun", level: "N5", example: { ja: "昨日は雨でした。", en: "Yesterday was rainy." }, category: "time" },
  { id: "v20", kanji: "今", hiragana: "いま", english: "Now", partOfSpeech: "noun", level: "N5", example: { ja: "今、何時ですか？", en: "What time is it now?" }, category: "time" },

  // Verbs
  { id: "v21", kanji: "食べる", hiragana: "たべる", english: "To eat", partOfSpeech: "verb", level: "N5", example: { ja: "朝ご飯を食べます。", en: "I eat breakfast." }, category: "verbs" },
  { id: "v22", kanji: "飲む", hiragana: "のむ", english: "To drink", partOfSpeech: "verb", level: "N5", example: { ja: "水を飲みます。", en: "I drink water." }, category: "verbs" },
  { id: "v23", kanji: "行く", hiragana: "いく", english: "To go", partOfSpeech: "verb", level: "N5", example: { ja: "学校に行きます。", en: "I go to school." }, category: "verbs" },
  { id: "v24", kanji: "来る", hiragana: "くる", english: "To come", partOfSpeech: "verb", level: "N5", example: { ja: "友達が来ます。", en: "A friend is coming." }, category: "verbs" },
  { id: "v25", kanji: "見る", hiragana: "みる", english: "To see / watch", partOfSpeech: "verb", level: "N5", example: { ja: "テレビを見ます。", en: "I watch TV." }, category: "verbs" },
  { id: "v26", kanji: "聞く", hiragana: "きく", english: "To listen / ask", partOfSpeech: "verb", level: "N5", example: { ja: "音楽を聞きます。", en: "I listen to music." }, category: "verbs" },
  { id: "v27", kanji: "読む", hiragana: "よむ", english: "To read", partOfSpeech: "verb", level: "N5", example: { ja: "本を読みます。", en: "I read a book." }, category: "verbs" },
  { id: "v28", kanji: "書く", hiragana: "かく", english: "To write", partOfSpeech: "verb", level: "N5", example: { ja: "手紙を書きます。", en: "I write a letter." }, category: "verbs" },
  { id: "v29", kanji: "話す", hiragana: "はなす", english: "To speak / talk", partOfSpeech: "verb", level: "N5", example: { ja: "日本語を話します。", en: "I speak Japanese." }, category: "verbs" },
  { id: "v30", kanji: "買う", hiragana: "かう", english: "To buy", partOfSpeech: "verb", level: "N5", example: { ja: "本を買います。", en: "I buy a book." }, category: "verbs" },

  // Adjectives
  { id: "v31", kanji: "大きい", hiragana: "おおきい", english: "Big / Large", partOfSpeech: "i-adjective", level: "N5", example: { ja: "大きい犬がいます。", en: "There is a big dog." }, category: "adjectives" },
  { id: "v32", kanji: "小さい", hiragana: "ちいさい", english: "Small / Little", partOfSpeech: "i-adjective", level: "N5", example: { ja: "小さい猫が好きです。", en: "I like small cats." }, category: "adjectives" },
  { id: "v33", kanji: "新しい", hiragana: "あたらしい", english: "New", partOfSpeech: "i-adjective", level: "N5", example: { ja: "新しい車を買いました。", en: "I bought a new car." }, category: "adjectives" },
  { id: "v34", kanji: "古い", hiragana: "ふるい", english: "Old (things)", partOfSpeech: "i-adjective", level: "N5", example: { ja: "古い本を読みました。", en: "I read an old book." }, category: "adjectives" },
  { id: "v35", kanji: "良い", hiragana: "いい/よい", english: "Good", partOfSpeech: "i-adjective", level: "N5", example: { ja: "天気が良いです。", en: "The weather is good." }, category: "adjectives" },

  // Places
  { id: "v36", kanji: "学校", hiragana: "がっこう", english: "School", partOfSpeech: "noun", level: "N5", example: { ja: "学校は九時に始まります。", en: "School starts at 9 o'clock." }, category: "places" },
  { id: "v37", kanji: "家", hiragana: "いえ/うち", english: "House / Home", partOfSpeech: "noun", level: "N5", example: { ja: "家に帰ります。", en: "I go home." }, category: "places" },
  { id: "v38", kanji: "駅", hiragana: "えき", english: "Station", partOfSpeech: "noun", level: "N5", example: { ja: "駅まで歩きます。", en: "I walk to the station." }, category: "places" },
  { id: "v39", kanji: "病院", hiragana: "びょういん", english: "Hospital", partOfSpeech: "noun", level: "N5", example: { ja: "病院に行きました。", en: "I went to the hospital." }, category: "places" },
  { id: "v40", kanji: "店", hiragana: "みせ", english: "Store / Shop", partOfSpeech: "noun", level: "N5", example: { ja: "あの店は安いです。", en: "That shop is cheap." }, category: "places" },

  // Nature / Weather
  { id: "v41", kanji: "水", hiragana: "みず", english: "Water", partOfSpeech: "noun", level: "N5", example: { ja: "水をください。", en: "Water, please." }, category: "nature" },
  { id: "v42", kanji: "山", hiragana: "やま", english: "Mountain", partOfSpeech: "noun", level: "N5", example: { ja: "山に登りました。", en: "I climbed a mountain." }, category: "nature" },
  { id: "v43", kanji: "天気", hiragana: "てんき", english: "Weather", partOfSpeech: "noun", level: "N5", example: { ja: "今日の天気は晴れです。", en: "Today's weather is sunny." }, category: "nature" },
  { id: "v44", kanji: "雨", hiragana: "あめ", english: "Rain", partOfSpeech: "noun", level: "N5", example: { ja: "雨が降っています。", en: "It is raining." }, category: "nature" },
  { id: "v45", kanji: "花", hiragana: "はな", english: "Flower", partOfSpeech: "noun", level: "N5", example: { ja: "桜の花がきれいです。", en: "The cherry blossoms are beautiful." }, category: "nature" },

  // Food
  { id: "v46", kanji: "ご飯", hiragana: "ごはん", english: "Rice / Meal", partOfSpeech: "noun", level: "N5", example: { ja: "ご飯を食べましょう。", en: "Let's eat a meal." }, category: "food" },
  { id: "v47", kanji: "魚", hiragana: "さかな", english: "Fish", partOfSpeech: "noun", level: "N5", example: { ja: "魚が好きです。", en: "I like fish." }, category: "food" },
  { id: "v48", kanji: "肉", hiragana: "にく", english: "Meat", partOfSpeech: "noun", level: "N5", example: { ja: "肉を焼きます。", en: "I grill meat." }, category: "food" },
  { id: "v49", kanji: "茶", hiragana: "ちゃ/おちゃ", english: "Tea", partOfSpeech: "noun", level: "N5", example: { ja: "お茶を飲みませんか。", en: "Would you like some tea?" }, category: "food" },
  { id: "v50", kanji: "朝ご飯", hiragana: "あさごはん", english: "Breakfast", partOfSpeech: "noun", level: "N5", example: { ja: "朝ご飯にパンを食べます。", en: "I eat bread for breakfast." }, category: "food" },
];

export const VOCAB_CATEGORIES = [
  { id: "greetings", label: "Greetings", emoji: "👋", count: 5 },
  { id: "numbers", label: "Numbers", emoji: "🔢", count: 23 },
  { id: "people", label: "People", emoji: "👥", count: 6 },
  { id: "time", label: "Time", emoji: "⏰", count: 4 },
  { id: "verbs", label: "Verbs", emoji: "🏃", count: 10 },
  { id: "adjectives", label: "Adjectives", emoji: "✨", count: 5 },
  { id: "places", label: "Places", emoji: "🏠", count: 5 },
  { id: "nature", label: "Nature", emoji: "🌸", count: 5 },
  { id: "food", label: "Food", emoji: "🍙", count: 5 },
];
