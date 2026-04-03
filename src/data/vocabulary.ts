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

  // ── N4 Verbs ──
  { id: "n4v1",  kanji: "覚える",   hiragana: "おぼえる",   english: "To memorize",            partOfSpeech: "verb",        level: "N4", example: { ja: "単語を覚えます。", en: "I memorize vocabulary." }, category: "n4-verbs" },
  { id: "n4v2",  kanji: "忘れる",   hiragana: "わすれる",   english: "To forget",              partOfSpeech: "verb",        level: "N4", example: { ja: "名前を忘れました。", en: "I forgot the name." }, category: "n4-verbs" },
  { id: "n4v3",  kanji: "教える",   hiragana: "おしえる",   english: "To teach",               partOfSpeech: "verb",        level: "N4", example: { ja: "日本語を教えます。", en: "I teach Japanese." }, category: "n4-verbs" },
  { id: "n4v4",  kanji: "習う",     hiragana: "ならう",     english: "To learn / take lessons", partOfSpeech: "verb",       level: "N4", example: { ja: "ピアノを習っています。", en: "I am taking piano lessons." }, category: "n4-verbs" },
  { id: "n4v5",  kanji: "調べる",   hiragana: "しらべる",   english: "To look up / investigate",partOfSpeech: "verb",       level: "N4", example: { ja: "意味を調べます。", en: "I'll look up the meaning." }, category: "n4-verbs" },
  { id: "n4v6",  kanji: "決める",   hiragana: "きめる",     english: "To decide",              partOfSpeech: "verb",        level: "N4", example: { ja: "場所を決めましょう。", en: "Let's decide the place." }, category: "n4-verbs" },
  { id: "n4v7",  kanji: "始まる",   hiragana: "はじまる",   english: "To begin",               partOfSpeech: "verb",        level: "N4", example: { ja: "授業が始まります。", en: "Class begins." }, category: "n4-verbs" },
  { id: "n4v8",  kanji: "終わる",   hiragana: "おわる",     english: "To end / finish",        partOfSpeech: "verb",        level: "N4", example: { ja: "仕事が終わりました。", en: "Work has finished." }, category: "n4-verbs" },
  { id: "n4v9",  kanji: "変える",   hiragana: "かえる",     english: "To change (something)",  partOfSpeech: "verb",        level: "N4", example: { ja: "計画を変えます。", en: "I'll change the plan." }, category: "n4-verbs" },
  { id: "n4v10", kanji: "集める",   hiragana: "あつめる",   english: "To collect",             partOfSpeech: "verb",        level: "N4", example: { ja: "情報を集めます。", en: "I collect information." }, category: "n4-verbs" },
  { id: "n4v11", kanji: "送る",     hiragana: "おくる",     english: "To send",                partOfSpeech: "verb",        level: "N4", example: { ja: "メールを送ります。", en: "I'll send an email." }, category: "n4-verbs" },
  { id: "n4v12", kanji: "受ける",   hiragana: "うける",     english: "To receive / take exam", partOfSpeech: "verb",        level: "N4", example: { ja: "試験を受けます。", en: "I'll take the exam." }, category: "n4-verbs" },
  { id: "n4v13", kanji: "続ける",   hiragana: "つづける",   english: "To continue",            partOfSpeech: "verb",        level: "N4", example: { ja: "練習を続けます。", en: "I'll continue practicing." }, category: "n4-verbs" },
  { id: "n4v14", kanji: "止まる",   hiragana: "とまる",     english: "To stop",                partOfSpeech: "verb",        level: "N4", example: { ja: "電車が止まりました。", en: "The train stopped." }, category: "n4-verbs" },
  { id: "n4v15", kanji: "落ちる",   hiragana: "おちる",     english: "To fall",                partOfSpeech: "verb",        level: "N4", example: { ja: "りんごが落ちました。", en: "The apple fell." }, category: "n4-verbs" },
  { id: "n4v16", kanji: "渡る",     hiragana: "わたる",     english: "To cross",               partOfSpeech: "verb",        level: "N4", example: { ja: "橋を渡ります。", en: "I cross the bridge." }, category: "n4-verbs" },
  { id: "n4v17", kanji: "運ぶ",     hiragana: "はこぶ",     english: "To carry",               partOfSpeech: "verb",        level: "N4", example: { ja: "荷物を運びます。", en: "I carry the luggage." }, category: "n4-verbs" },
  { id: "n4v18", kanji: "引く",     hiragana: "ひく",       english: "To pull",                partOfSpeech: "verb",        level: "N4", example: { ja: "ドアを引いてください。", en: "Please pull the door." }, category: "n4-verbs" },
  { id: "n4v19", kanji: "押す",     hiragana: "おす",       english: "To push",                partOfSpeech: "verb",        level: "N4", example: { ja: "ボタンを押します。", en: "I press the button." }, category: "n4-verbs" },
  { id: "n4v20", kanji: "急ぐ",     hiragana: "いそぐ",     english: "To hurry",               partOfSpeech: "verb",        level: "N4", example: { ja: "急いでください。", en: "Please hurry." }, category: "n4-verbs" },

  // ── N4 Adjectives ──
  { id: "n4a1",  kanji: "嬉しい",   hiragana: "うれしい",   english: "Happy / glad",           partOfSpeech: "i-adjective", level: "N4", example: { ja: "嬉しいです。", en: "I'm happy." }, category: "n4-adjectives" },
  { id: "n4a2",  kanji: "悲しい",   hiragana: "かなしい",   english: "Sad",                    partOfSpeech: "i-adjective", level: "N4", example: { ja: "悲しい映画です。", en: "It's a sad movie." }, category: "n4-adjectives" },
  { id: "n4a3",  kanji: "怖い",     hiragana: "こわい",     english: "Scary",                  partOfSpeech: "i-adjective", level: "N4", example: { ja: "怖い夢を見ました。", en: "I had a scary dream." }, category: "n4-adjectives" },
  { id: "n4a4",  kanji: "痛い",     hiragana: "いたい",     english: "Painful / it hurts",     partOfSpeech: "i-adjective", level: "N4", example: { ja: "頭が痛いです。", en: "My head hurts." }, category: "n4-adjectives" },
  { id: "n4a5",  kanji: "眠い",     hiragana: "ねむい",     english: "Sleepy",                 partOfSpeech: "i-adjective", level: "N4", example: { ja: "眠いです。", en: "I'm sleepy." }, category: "n4-adjectives" },
  { id: "n4a6",  kanji: "難しい",   hiragana: "むずかしい", english: "Difficult",              partOfSpeech: "i-adjective", level: "N4", example: { ja: "この問題は難しい。", en: "This problem is difficult." }, category: "n4-adjectives" },
  { id: "n4a7",  kanji: "易しい",   hiragana: "やさしい",   english: "Easy",                   partOfSpeech: "i-adjective", level: "N4", example: { ja: "易しいテストでした。", en: "It was an easy test." }, category: "n4-adjectives" },
  { id: "n4a8",  kanji: "柔らかい", hiragana: "やわらかい", english: "Soft",                   partOfSpeech: "i-adjective", level: "N4", example: { ja: "このパンは柔らかい。", en: "This bread is soft." }, category: "n4-adjectives" },
  { id: "n4a9",  kanji: "硬い",     hiragana: "かたい",     english: "Hard / stiff",           partOfSpeech: "i-adjective", level: "N4", example: { ja: "床が硬い。", en: "The floor is hard." }, category: "n4-adjectives" },
  { id: "n4a10", kanji: "重い",     hiragana: "おもい",     english: "Heavy",                  partOfSpeech: "i-adjective", level: "N4", example: { ja: "この荷物は重い。", en: "This luggage is heavy." }, category: "n4-adjectives" },
  { id: "n4a11", kanji: "軽い",     hiragana: "かるい",     english: "Light (not heavy)",      partOfSpeech: "i-adjective", level: "N4", example: { ja: "このかばんは軽い。", en: "This bag is light." }, category: "n4-adjectives" },
  { id: "n4a12", kanji: "暖かい",   hiragana: "あたたかい", english: "Warm",                   partOfSpeech: "i-adjective", level: "N4", example: { ja: "今日は暖かいです。", en: "It's warm today." }, category: "n4-adjectives" },
  { id: "n4a13", kanji: "涼しい",   hiragana: "すずしい",   english: "Cool / refreshing",      partOfSpeech: "i-adjective", level: "N4", example: { ja: "秋は涼しいです。", en: "Autumn is cool." }, category: "n4-adjectives" },
  { id: "n4a14", kanji: "珍しい",   hiragana: "めずらしい", english: "Rare / unusual",         partOfSpeech: "i-adjective", level: "N4", example: { ja: "珍しい花ですね。", en: "That's a rare flower." }, category: "n4-adjectives" },
  { id: "n4a15", kanji: "正しい",   hiragana: "ただしい",   english: "Correct / right",        partOfSpeech: "i-adjective", level: "N4", example: { ja: "その答えは正しいです。", en: "That answer is correct." }, category: "n4-adjectives" },
];

export const VOCAB_CATEGORIES = [
  { id: "greetings", label: "Greetings", emoji: "👋", count: 5 },
  { id: "numbers", label: "Numbers", emoji: "🔢", count: 23 },
  { id: "n4-verbs", label: "N4 Verbs", emoji: "⚡", count: 20 },
  { id: "n4-adjectives", label: "N4 Adjectives", emoji: "🌟", count: 15 },
  { id: "people", label: "People", emoji: "👥", count: 6 },
  { id: "time", label: "Time", emoji: "⏰", count: 4 },
  { id: "verbs", label: "Verbs", emoji: "🏃", count: 10 },
  { id: "adjectives", label: "Adjectives", emoji: "✨", count: 5 },
  { id: "places", label: "Places", emoji: "🏠", count: 5 },
  { id: "nature", label: "Nature", emoji: "🌸", count: 5 },
  { id: "food", label: "Food", emoji: "🍙", count: 5 },
];
