export interface KanjiChar {
  id: string;
  kanji: string;
  meaning: string[];
  onyomi: string[];   // Chinese reading (katakana)
  kunyomi: string[];  // Japanese reading (hiragana)
  strokes: number;
  level: "N5" | "N4";
  examples: { word: string; reading: string; meaning: string }[];
  mnemonic: string;
  category: string;
}

export const KANJI_N5: KanjiChar[] = [
  // Numbers
  { id: "k1",  kanji: "一", meaning: ["one"],              onyomi: ["イチ","イツ"], kunyomi: ["ひと-"],   strokes: 1, level: "N5", category: "numbers",  mnemonic: "One single horizontal stroke = one", examples: [{ word: "一人", reading: "ひとり", meaning: "one person" }, { word: "一月", reading: "いちがつ", meaning: "January" }] },
  { id: "k2",  kanji: "二", meaning: ["two"],              onyomi: ["ニ"],          kunyomi: ["ふた-"],   strokes: 2, level: "N5", category: "numbers",  mnemonic: "Two horizontal strokes = two",       examples: [{ word: "二人", reading: "ふたり", meaning: "two people" }, { word: "二月", reading: "にがつ", meaning: "February" }] },
  { id: "k3",  kanji: "三", meaning: ["three"],            onyomi: ["サン"],        kunyomi: ["み-"],     strokes: 3, level: "N5", category: "numbers",  mnemonic: "Three horizontal strokes = three",  examples: [{ word: "三月", reading: "さんがつ", meaning: "March" }, { word: "三人", reading: "さんにん", meaning: "three people" }] },
  { id: "k4",  kanji: "四", meaning: ["four"],             onyomi: ["シ"],          kunyomi: ["よ-","よん"], strokes: 5, level: "N5", category: "numbers", mnemonic: "Four corners in the box",           examples: [{ word: "四月", reading: "しがつ", meaning: "April" }, { word: "四時", reading: "よじ", meaning: "4 o'clock" }] },
  { id: "k5",  kanji: "五", meaning: ["five"],             onyomi: ["ゴ"],          kunyomi: ["いつ-"],   strokes: 4, level: "N5", category: "numbers",  mnemonic: "Five lines cross in the middle",    examples: [{ word: "五月", reading: "ごがつ", meaning: "May" }, { word: "五時", reading: "ごじ", meaning: "5 o'clock" }] },
  { id: "k6",  kanji: "六", meaning: ["six"],              onyomi: ["ロク"],        kunyomi: ["む-"],     strokes: 4, level: "N5", category: "numbers",  mnemonic: "Six legs on a bug",                 examples: [{ word: "六月", reading: "ろくがつ", meaning: "June" }, { word: "六時", reading: "ろくじ", meaning: "6 o'clock" }] },
  { id: "k7",  kanji: "七", meaning: ["seven"],            onyomi: ["シチ"],        kunyomi: ["なな-"],   strokes: 2, level: "N5", category: "numbers",  mnemonic: "Seven looks like a 7",              examples: [{ word: "七月", reading: "しちがつ", meaning: "July" }, { word: "七時", reading: "しちじ", meaning: "7 o'clock" }] },
  { id: "k8",  kanji: "八", meaning: ["eight"],            onyomi: ["ハチ"],        kunyomi: ["や-"],     strokes: 2, level: "N5", category: "numbers",  mnemonic: "Two legs spreading = eight",        examples: [{ word: "八月", reading: "はちがつ", meaning: "August" }, { word: "八時", reading: "はちじ", meaning: "8 o'clock" }] },
  { id: "k9",  kanji: "九", meaning: ["nine"],             onyomi: ["キュウ","ク"], kunyomi: ["ここの-"], strokes: 2, level: "N5", category: "numbers",  mnemonic: "Hook at the bottom = nine",         examples: [{ word: "九月", reading: "くがつ", meaning: "September" }, { word: "九時", reading: "くじ", meaning: "9 o'clock" }] },
  { id: "k10", kanji: "十", meaning: ["ten"],              onyomi: ["ジュウ","ジッ"],kunyomi: ["とお-"],  strokes: 2, level: "N5", category: "numbers",  mnemonic: "Cross = plus = ten",                examples: [{ word: "十月", reading: "じゅうがつ", meaning: "October" }, { word: "十分", reading: "じゅっぷん", meaning: "10 minutes" }] },
  { id: "k11", kanji: "百", meaning: ["hundred"],          onyomi: ["ヒャク"],      kunyomi: [],          strokes: 6, level: "N5", category: "numbers",  mnemonic: "Hundred grains of rice on a stalk", examples: [{ word: "百円", reading: "ひゃくえん", meaning: "100 yen" }, { word: "三百", reading: "さんびゃく", meaning: "300" }] },
  { id: "k12", kanji: "千", meaning: ["thousand"],         onyomi: ["セン"],        kunyomi: ["ち"],      strokes: 3, level: "N5", category: "numbers",  mnemonic: "A person on a thousand lines",      examples: [{ word: "千円", reading: "せんえん", meaning: "1000 yen" }, { word: "二千", reading: "にせん", meaning: "2000" }] },
  // People & Body
  { id: "k13", kanji: "人", meaning: ["person","people"],  onyomi: ["ジン","ニン"], kunyomi: ["ひと"],    strokes: 2, level: "N5", category: "people",   mnemonic: "Two legs of a person walking",      examples: [{ word: "日本人", reading: "にほんじん", meaning: "Japanese person" }, { word: "一人", reading: "ひとり", meaning: "one person" }] },
  { id: "k14", kanji: "男", meaning: ["man","male"],       onyomi: ["ダン","ナン"], kunyomi: ["おとこ"],  strokes: 7, level: "N5", category: "people",   mnemonic: "Field (田) + strength (力) = man",  examples: [{ word: "男の人", reading: "おとこのひと", meaning: "man" }, { word: "男子", reading: "だんし", meaning: "boy" }] },
  { id: "k15", kanji: "女", meaning: ["woman","female"],   onyomi: ["ジョ","ニョ"], kunyomi: ["おんな"],  strokes: 3, level: "N5", category: "people",   mnemonic: "Woman gracefully crossing her arms",examples: [{ word: "女の人", reading: "おんなのひと", meaning: "woman" }, { word: "女子", reading: "じょし", meaning: "girl" }] },
  { id: "k16", kanji: "子", meaning: ["child"],            onyomi: ["シ","ス"],     kunyomi: ["こ"],      strokes: 3, level: "N5", category: "people",   mnemonic: "A child with arms outstretched",    examples: [{ word: "子供", reading: "こども", meaning: "child" }, { word: "女の子", reading: "おんなのこ", meaning: "girl" }] },
  { id: "k17", kanji: "口", meaning: ["mouth","opening"],  onyomi: ["コウ","ク"],   kunyomi: ["くち"],    strokes: 3, level: "N5", category: "body",     mnemonic: "A square box = open mouth",         examples: [{ word: "人口", reading: "じんこう", meaning: "population" }, { word: "入口", reading: "いりぐち", meaning: "entrance" }] },
  { id: "k18", kanji: "目", meaning: ["eye"],              onyomi: ["モク","ボク"],  kunyomi: ["め"],      strokes: 5, level: "N5", category: "body",     mnemonic: "An eye rotated sideways",           examples: [{ word: "目玉", reading: "めだま", meaning: "eyeball" }, { word: "一目", reading: "ひとめ", meaning: "one glance" }] },
  { id: "k19", kanji: "耳", meaning: ["ear"],              onyomi: ["ジ"],          kunyomi: ["みみ"],    strokes: 6, level: "N5", category: "body",     mnemonic: "The shape of an outer ear",         examples: [{ word: "耳鼻科", reading: "じびか", meaning: "ENT clinic" }, { word: "耳元", reading: "みみもと", meaning: "near one's ear" }] },
  { id: "k20", kanji: "手", meaning: ["hand"],             onyomi: ["シュ"],        kunyomi: ["て"],      strokes: 4, level: "N5", category: "body",     mnemonic: "Five fingers on a hand",            examples: [{ word: "手紙", reading: "てがみ", meaning: "letter" }, { word: "上手", reading: "じょうず", meaning: "skillful" }] },
  { id: "k21", kanji: "足", meaning: ["foot","leg","enough"],onyomi:["ソク"],       kunyomi: ["あし"],    strokes: 7, level: "N5", category: "body",     mnemonic: "Leg shape walking forward",         examples: [{ word: "足音", reading: "あしおと", meaning: "footstep" }, { word: "不足", reading: "ふそく", meaning: "shortage" }] },
  // Nature
  { id: "k22", kanji: "日", meaning: ["sun","day"],        onyomi: ["ニチ","ジツ"], kunyomi: ["ひ","か"], strokes: 4, level: "N5", category: "nature",   mnemonic: "The sun with a line through it",    examples: [{ word: "日本", reading: "にほん", meaning: "Japan" }, { word: "今日", reading: "きょう", meaning: "today" }] },
  { id: "k23", kanji: "月", meaning: ["moon","month"],     onyomi: ["ゲツ","ガツ"], kunyomi: ["つき"],    strokes: 4, level: "N5", category: "nature",   mnemonic: "A crescent moon shape",             examples: [{ word: "月曜日", reading: "げつようび", meaning: "Monday" }, { word: "三月", reading: "さんがつ", meaning: "March" }] },
  { id: "k24", kanji: "火", meaning: ["fire"],             onyomi: ["カ"],          kunyomi: ["ひ"],      strokes: 4, level: "N5", category: "nature",   mnemonic: "Flames rising from a fire",         examples: [{ word: "火曜日", reading: "かようび", meaning: "Tuesday" }, { word: "花火", reading: "はなび", meaning: "fireworks" }] },
  { id: "k25", kanji: "水", meaning: ["water"],            onyomi: ["スイ"],        kunyomi: ["みず"],    strokes: 4, level: "N5", category: "nature",   mnemonic: "Flowing water with ripples",        examples: [{ word: "水曜日", reading: "すいようび", meaning: "Wednesday" }, { word: "水道", reading: "すいどう", meaning: "waterworks" }] },
  { id: "k26", kanji: "木", meaning: ["tree","wood"],      onyomi: ["モク","ボク"],  kunyomi: ["き","こ"], strokes: 4, level: "N5", category: "nature",   mnemonic: "A tree with roots and branches",    examples: [{ word: "木曜日", reading: "もくようび", meaning: "Thursday" }, { word: "木村", reading: "きむら", meaning: "Kimura (surname)" }] },
  { id: "k27", kanji: "山", meaning: ["mountain"],         onyomi: ["サン"],        kunyomi: ["やま"],    strokes: 3, level: "N5", category: "nature",   mnemonic: "Three mountain peaks",              examples: [{ word: "富士山", reading: "ふじさん", meaning: "Mt. Fuji" }, { word: "山田", reading: "やまだ", meaning: "Yamada (surname)" }] },
  { id: "k28", kanji: "川", meaning: ["river"],            onyomi: ["セン"],        kunyomi: ["かわ"],    strokes: 3, level: "N5", category: "nature",   mnemonic: "Three streams flowing together",    examples: [{ word: "川口", reading: "かわぐち", meaning: "river mouth" }, { word: "小川", reading: "おがわ", meaning: "stream" }] },
  { id: "k29", kanji: "空", meaning: ["sky","empty"],      onyomi: ["クウ"],        kunyomi: ["そら","あ-"],strokes: 8,level: "N5", category: "nature",  mnemonic: "Sky above a cave",                  examples: [{ word: "青空", reading: "あおぞら", meaning: "blue sky" }, { word: "空港", reading: "くうこう", meaning: "airport" }] },
  { id: "k30", kanji: "花", meaning: ["flower"],           onyomi: ["カ"],          kunyomi: ["はな"],    strokes: 7, level: "N5", category: "nature",   mnemonic: "A blooming flower with petals",     examples: [{ word: "花火", reading: "はなび", meaning: "fireworks" }, { word: "花見", reading: "はなみ", meaning: "cherry blossom viewing" }] },
  // Direction & Position
  { id: "k31", kanji: "上", meaning: ["up","above","on"],  onyomi: ["ジョウ","ショウ"],kunyomi:["うえ","あ-"],strokes:3, level:"N5", category:"direction", mnemonic:"Arrow pointing up",                examples: [{ word: "上手", reading: "じょうず", meaning: "skillful" }, { word: "上野", reading: "うえの", meaning: "Ueno" }] },
  { id: "k32", kanji: "下", meaning: ["down","below","under"],onyomi:["カ","ゲ"],   kunyomi: ["した","さ-"],strokes:3, level:"N5", category:"direction", mnemonic:"Arrow pointing down",               examples: [{ word: "地下", reading: "ちか", meaning: "underground" }, { word: "下手", reading: "へた", meaning: "unskillful" }] },
  { id: "k33", kanji: "中", meaning: ["middle","inside"],  onyomi: ["チュウ"],      kunyomi: ["なか"],    strokes: 4, level: "N5", category: "direction", mnemonic: "Arrow through the middle",          examples: [{ word: "中国", reading: "ちゅうごく", meaning: "China" }, { word: "中学校", reading: "ちゅうがっこう", meaning: "middle school" }] },
  { id: "k34", kanji: "大", meaning: ["big","large"],      onyomi: ["ダイ","タイ"],  kunyomi: ["おお-"],   strokes: 3, level: "N5", category: "direction", mnemonic: "Big person spreading arms wide",     examples: [{ word: "大学", reading: "だいがく", meaning: "university" }, { word: "大切", reading: "たいせつ", meaning: "important" }] },
  { id: "k35", kanji: "小", meaning: ["small","little"],   onyomi: ["ショウ"],      kunyomi: ["ちい-","こ-","お-"],strokes:3,level:"N5",category:"direction",mnemonic:"Small dot with two wings",         examples: [{ word: "小学校", reading: "しょうがっこう", meaning: "elementary school" }, { word: "小さい", reading: "ちいさい", meaning: "small" }] },
  // Time
  { id: "k36", kanji: "年", meaning: ["year"],             onyomi: ["ネン"],        kunyomi: ["とし"],    strokes: 6, level: "N5", category: "time",     mnemonic: "Harvest cycle marks a year",        examples: [{ word: "今年", reading: "ことし", meaning: "this year" }, { word: "来年", reading: "らいねん", meaning: "next year" }] },
  { id: "k37", kanji: "時", meaning: ["time","hour"],      onyomi: ["ジ"],          kunyomi: ["とき"],    strokes: 10, level: "N5", category: "time",    mnemonic: "Sun + temple = time measured by sun",examples: [{ word: "時間", reading: "じかん", meaning: "time" }, { word: "何時", reading: "なんじ", meaning: "what time" }] },
  { id: "k38", kanji: "間", meaning: ["interval","between"],onyomi:["カン","ケン"],  kunyomi: ["あいだ","ま"],strokes:12,level:"N5",category:"time",     mnemonic: "Moon shining through a gate",        examples: [{ word: "時間", reading: "じかん", meaning: "time" }, { word: "人間", reading: "にんげん", meaning: "human" }] },
  // Places
  { id: "k39", kanji: "国", meaning: ["country","nation"], onyomi: ["コク"],        kunyomi: ["くに"],    strokes: 8, level: "N5", category: "places",   mnemonic: "A jewel enclosed in a border",      examples: [{ word: "日本国", reading: "にほんこく", meaning: "Japan (formal)" }, { word: "外国", reading: "がいこく", meaning: "foreign country" }] },
  { id: "k40", kanji: "学", meaning: ["study","learning"], onyomi: ["ガク"],        kunyomi: ["まな-"],   strokes: 8, level: "N5", category: "places",   mnemonic: "Children under a roof learning",    examples: [{ word: "学校", reading: "がっこう", meaning: "school" }, { word: "大学", reading: "だいがく", meaning: "university" }] },
  { id: "k41", kanji: "校", meaning: ["school"],           onyomi: ["コウ"],        kunyomi: [],          strokes: 10, level: "N5", category: "places",  mnemonic: "Tree + intersection = school",      examples: [{ word: "学校", reading: "がっこう", meaning: "school" }, { word: "高校", reading: "こうこう", meaning: "high school" }] },
  { id: "k42", kanji: "本", meaning: ["book","origin","real"],onyomi:["ホン"],      kunyomi: ["もと"],    strokes: 5, level: "N5", category: "objects",  mnemonic: "A tree with its root marked",       examples: [{ word: "日本", reading: "にほん", meaning: "Japan" }, { word: "本屋", reading: "ほんや", meaning: "bookstore" }] },
  // Verbs & Actions
  { id: "k43", kanji: "見", meaning: ["see","look","show"],onyomi: ["ケン"],        kunyomi: ["み-"],     strokes: 7, level: "N5", category: "verbs",    mnemonic: "Eye on a pair of legs = look",      examples: [{ word: "見る", reading: "みる", meaning: "to see" }, { word: "意見", reading: "いけん", meaning: "opinion" }] },
  { id: "k44", kanji: "聞", meaning: ["hear","listen","ask"],onyomi:["ブン","モン"],kunyomi: ["き-"],     strokes: 14, level: "N5", category: "verbs",   mnemonic: "Ear at the gate = listen",          examples: [{ word: "聞く", reading: "きく", meaning: "to listen" }, { word: "新聞", reading: "しんぶん", meaning: "newspaper" }] },
  { id: "k45", kanji: "言", meaning: ["say","word","speech"],onyomi:["ゲン","ゴン"],kunyomi: ["い-","こと"],strokes:7,level:"N5",category:"verbs",     mnemonic: "Mouth + vibrations = saying words",  examples: [{ word: "言う", reading: "いう", meaning: "to say" }, { word: "言語", reading: "げんご", meaning: "language" }] },
  { id: "k46", kanji: "食", meaning: ["eat","food"],        onyomi: ["ショク"],      kunyomi: ["た-","く-"],strokes:9, level:"N5", category:"verbs",     mnemonic: "A covered vessel of food",          examples: [{ word: "食べる", reading: "たべる", meaning: "to eat" }, { word: "食事", reading: "しょくじ", meaning: "meal" }] },
  { id: "k47", kanji: "飲", meaning: ["drink"],             onyomi: ["イン"],        kunyomi: ["の-"],     strokes: 12, level: "N5", category: "verbs",   mnemonic: "Food + opening mouth = drink",      examples: [{ word: "飲む", reading: "のむ", meaning: "to drink" }, { word: "飲み物", reading: "のみもの", meaning: "beverage" }] },
  { id: "k48", kanji: "行", meaning: ["go","conduct"],      onyomi: ["コウ","ギョウ"],kunyomi: ["い-","おこな-"],strokes:6,level:"N5",category:"verbs",  mnemonic: "Crossroads = going in directions",  examples: [{ word: "行く", reading: "いく", meaning: "to go" }, { word: "旅行", reading: "りょこう", meaning: "travel" }] },
  { id: "k49", kanji: "来", meaning: ["come","next"],       onyomi: ["ライ"],        kunyomi: ["く-","き-"],strokes:7, level:"N5", category:"verbs",     mnemonic: "Person approaching = coming",       examples: [{ word: "来る", reading: "くる", meaning: "to come" }, { word: "来週", reading: "らいしゅう", meaning: "next week" }] },
  { id: "k50", kanji: "買", meaning: ["buy"],               onyomi: ["バイ"],        kunyomi: ["か-"],     strokes: 12, level: "N5", category: "verbs",   mnemonic: "Net over shellfish = buy/sell",     examples: [{ word: "買う", reading: "かう", meaning: "to buy" }, { word: "売買", reading: "ばいばい", meaning: "buying and selling" }] },
];

export const KANJI_CATEGORIES = [
  { id: "numbers",   label: "Numbers",    emoji: "🔢", count: 12 },
  { id: "people",    label: "People",     emoji: "👥", count: 4 },
  { id: "body",      label: "Body",       emoji: "💪", count: 5 },
  { id: "nature",    label: "Nature",     emoji: "🌸", count: 9 },
  { id: "direction", label: "Direction",  emoji: "🧭", count: 5 },
  { id: "time",      label: "Time",       emoji: "⏰", count: 3 },
  { id: "places",    label: "Places",     emoji: "🏠", count: 3 },
  { id: "objects",   label: "Objects",    emoji: "📦", count: 1 },
  { id: "verbs",     label: "Verbs",      emoji: "🏃", count: 8 },
];

export const ALL_KANJI = KANJI_N5;
