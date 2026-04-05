export interface GrammarPoint {
  id: string;
  title: string;
  titleJa: string;
  level: "N5" | "N4";
  structure: string;
  explanation: string;
  examples: { ja: string; en: string; reading?: string; breakdown?: string }[];
  quiz: { question: string; options: string[]; correct: number }[];
}

export const GRAMMAR_POINTS: GrammarPoint[] = [
  {
    id: "g1",
    title: "です (desu) — Polite Copula",
    titleJa: "です",
    level: "N5",
    structure: "[Noun/Adjective] + です",
    explanation: "「です」is the polite form of the copula (is/am/are). It's added to the end of sentences to make them polite. It connects a subject with a noun or na-adjective.",
    examples: [
      { ja: "私は学生です。", en: "I am a student.", reading: "わたしはがくせいです。", breakdown: "私(I) は(topic) 学生(student) です(am)" },
      { ja: "これはペンです。", en: "This is a pen.", reading: "これはペンです。", breakdown: "これ(this) は(topic) ペン(pen) です(is)" },
      { ja: "東京はきれいです。", en: "Tokyo is beautiful.", reading: "とうきょうはきれいです。", breakdown: "東京(Tokyo) は(topic) きれい(beautiful) です(is)" },
    ],
    quiz: [
      { question: "How do you say 'I am a teacher' politely?", options: ["私は先生だ。", "私は先生です。", "私は先生ます。", "私は先生でした。"], correct: 1 },
      { question: "What does です add to a sentence?", options: ["Past tense", "Negative meaning", "Politeness", "Question"], correct: 2 },
    ],
  },
  {
    id: "g2",
    title: "は (wa) — Topic Marker",
    titleJa: "は",
    level: "N5",
    structure: "[Topic] + は + [Comment]",
    explanation: "The particle 「は」(pronounced 'wa') marks the topic of the sentence. It tells the listener what you are talking about. Think of it as 'As for [topic]...'",
    examples: [
      { ja: "私はマリアです。", en: "I am Maria.", reading: "わたしはマリアです。", breakdown: "私(I) は(as for) マリア(Maria) です(am)" },
      { ja: "日本語は楽しいです。", en: "Japanese is fun.", reading: "にほんごはたのしいです。", breakdown: "日本語(Japanese) は(as for) 楽しい(fun) です(is)" },
      { ja: "天気は良いです。", en: "The weather is good.", reading: "てんきはいいです。", breakdown: "天気(weather) は(as for) 良い(good) です(is)" },
    ],
    quiz: [
      { question: "Which particle marks the topic of a sentence?", options: ["が", "を", "は", "に"], correct: 2 },
      { question: "How is は pronounced when used as a particle?", options: ["ha", "wa", "ba", "pa"], correct: 1 },
    ],
  },
  {
    id: "g3",
    title: "を (wo) — Object Marker",
    titleJa: "を",
    level: "N5",
    structure: "[Object] + を + [Verb]",
    explanation: "The particle 「を」(pronounced 'o') marks the direct object of a verb — the thing being acted upon.",
    examples: [
      { ja: "水を飲みます。", en: "I drink water.", reading: "みずをのみます。", breakdown: "水(water) を(object) 飲みます(drink)" },
      { ja: "本を読みます。", en: "I read a book.", reading: "ほんをよみます。", breakdown: "本(book) を(object) 読みます(read)" },
      { ja: "日本語を勉強します。", en: "I study Japanese.", reading: "にほんごをべんきょうします。", breakdown: "日本語(Japanese) を(object) 勉強します(study)" },
    ],
    quiz: [
      { question: "Choose the correct particle: 本___読みます。", options: ["は", "を", "に", "で"], correct: 1 },
      { question: "What does を mark in a sentence?", options: ["The topic", "The location", "The direct object", "The subject"], correct: 2 },
    ],
  },
  {
    id: "g4",
    title: "に (ni) — Direction / Time",
    titleJa: "に",
    level: "N5",
    structure: "[Place/Time] + に + [Verb]",
    explanation: "The particle 「に」indicates a specific direction, destination, point in time, or purpose. It answers 'where to?' or 'when?'",
    examples: [
      { ja: "学校に行きます。", en: "I go to school.", reading: "がっこうにいきます。", breakdown: "学校(school) に(to) 行きます(go)" },
      { ja: "七時に起きます。", en: "I wake up at 7 o'clock.", reading: "しちじにおきます。", breakdown: "七時(7 o'clock) に(at) 起きます(wake up)" },
      { ja: "日本に住んでいます。", en: "I live in Japan.", reading: "にほんにすんでいます。", breakdown: "日本(Japan) に(in) 住んでいます(living)" },
    ],
    quiz: [
      { question: "Choose the correct particle: 学校___行きます。", options: ["を", "は", "に", "で"], correct: 2 },
      { question: "に can indicate which of the following?", options: ["Topic only", "Object only", "Direction and time", "Possession only"], correct: 2 },
    ],
  },
  {
    id: "g5",
    title: "ます (masu) — Polite Verb Form",
    titleJa: "ます",
    level: "N5",
    structure: "[Verb stem] + ます / ません / ました / ませんでした",
    explanation: "「ます」is added to the verb stem for polite present/future. 「ません」for polite negative. 「ました」for polite past. 「ませんでした」for polite negative past.",
    examples: [
      { ja: "食べます。", en: "I eat. (polite present)", reading: "たべます。", breakdown: "食べ(eat-stem) ます(polite)" },
      { ja: "食べません。", en: "I don't eat. (polite negative)", reading: "たべません。", breakdown: "食べ(eat-stem) ません(polite negative)" },
      { ja: "食べました。", en: "I ate. (polite past)", reading: "たべました。", breakdown: "食べ(eat-stem) ました(polite past)" },
    ],
    quiz: [
      { question: "What is the polite past form of 食べます?", options: ["食べません", "食べました", "食べる", "食べませんでした"], correct: 1 },
      { question: "How do you say 'I don't drink' politely?", options: ["飲みます", "飲みません", "飲まない", "飲みました"], correct: 1 },
    ],
  },
  {
    id: "g6",
    title: "が (ga) — Subject Marker",
    titleJa: "が",
    level: "N5",
    structure: "[Subject] + が + [Predicate]",
    explanation: "The particle 「が」marks the subject, often introducing new information or emphasizing who/what does the action. It differs from は in that は marks known/topical info while が marks new/contrasting info.",
    examples: [
      { ja: "猫がいます。", en: "There is a cat.", reading: "ねこがいます。", breakdown: "猫(cat) が(subject) います(exists-animate)" },
      { ja: "誰が来ましたか？", en: "Who came?", reading: "だれがきましたか？", breakdown: "誰(who) が(subject) 来ました(came) か(question)" },
      { ja: "水が欲しいです。", en: "I want water.", reading: "みずがほしいです。", breakdown: "水(water) が(subject) 欲しい(want) です(is)" },
    ],
    quiz: [
      { question: "Which particle introduces new information as the subject?", options: ["は", "が", "を", "も"], correct: 1 },
      { question: "Choose the correct: ___が好きです。(I like sushi)", options: ["すしは", "すしが", "すしを", "すしに"], correct: 1 },
    ],
  },
  {
    id: "g7",
    title: "も (mo) — Also / Too",
    titleJa: "も",
    level: "N5",
    structure: "[Noun] + も",
    explanation: "The particle 「も」replaces は, が, or を to mean 'also' or 'too'. It shows that something applies to an additional item.",
    examples: [
      { ja: "私も学生です。", en: "I am also a student.", reading: "わたしもがくせいです。", breakdown: "私(I) も(also) 学生(student) です(am)" },
      { ja: "猫も好きです。", en: "I like cats too.", reading: "ねこもすきです。", breakdown: "猫(cats) も(also) 好き(like) です(is)" },
      { ja: "これもおいしいです。", en: "This is also delicious.", reading: "これもおいしいです。", breakdown: "これ(this) も(also) おいしい(delicious) です(is)" },
    ],
    quiz: [
      { question: "How do you say 'I am also Japanese'?", options: ["私は日本人です。", "私も日本人です。", "私が日本人です。", "私の日本人です。"], correct: 1 },
      { question: "What particle does も replace?", options: ["に and で only", "は, が, or を", "から and まで", "と and や"], correct: 1 },
    ],
  },
  {
    id: "g8",
    title: "の (no) — Possession",
    titleJa: "の",
    level: "N5",
    structure: "[Owner] + の + [Thing owned]",
    explanation: "The particle 「の」connects two nouns to show possession (like 's or 'of' in English). The owner comes first.",
    examples: [
      { ja: "私の本です。", en: "It's my book.", reading: "わたしのほんです。", breakdown: "私(I) の(possessive) 本(book) です(is)" },
      { ja: "日本の食べ物", en: "Japanese food", reading: "にほんのたべもの", breakdown: "日本(Japan) の(of) 食べ物(food)" },
      { ja: "先生の名前は田中です。", en: "The teacher's name is Tanaka.", reading: "せんせいのなまえはたなかです。", breakdown: "先生(teacher) の(possessive) 名前(name) は(topic) 田中(Tanaka) です(is)" },
    ],
    quiz: [
      { question: "How do you say 'my friend'?", options: ["私を友達", "私の友達", "私は友達", "私に友達"], correct: 1 },
      { question: "What does の indicate?", options: ["Direction", "Object", "Possession", "Question"], correct: 2 },
    ],
  },
  {
    id: "g9",
    title: "か (ka) — Question Marker",
    titleJa: "か",
    level: "N5",
    structure: "[Statement] + か",
    explanation: "Adding 「か」to the end of a sentence turns it into a question. In polite speech, no question mark is needed (but it's often included in casual writing).",
    examples: [
      { ja: "学生ですか。", en: "Are you a student?", reading: "がくせいですか。", breakdown: "学生(student) です(are) か(question)" },
      { ja: "何を食べますか。", en: "What will you eat?", reading: "なにをたべますか。", breakdown: "何(what) を(object) 食べます(eat) か(question)" },
      { ja: "これはいくらですか。", en: "How much is this?", reading: "これはいくらですか。", breakdown: "これ(this) は(topic) いくら(how much) です(is) か(question)" },
    ],
    quiz: [
      { question: "How do you make a polite question in Japanese?", options: ["Add ね", "Add よ", "Add か", "Add の"], correct: 2 },
      { question: "Translate: 日本人ですか。", options: ["I am Japanese.", "Are you Japanese?", "Japanese person.", "This is Japan."], correct: 1 },
    ],
  },
  // ── N4 Grammar ──────────────────────────────────────────────────────────────
  {
    id: "g11",
    title: "〜ている (te iru) — Ongoing Action / State",
    titleJa: "〜ている",
    level: "N4",
    structure: "[Verb te-form] + いる",
    explanation: "「〜ている」expresses an action in progress (like English '-ing') or a resultant state. Casual speech shortens it to 「〜てる」.",
    examples: [
      { ja: "本を読んでいます。", en: "I am reading a book.", reading: "ほんをよんでいます。", breakdown: "本(book) を(obj) 読んで(read-te) います(is)" },
      { ja: "雨が降っています。", en: "It is raining.", reading: "あめがふっています。", breakdown: "雨(rain) が(subj) 降って(fall-te) います(is)" },
      { ja: "結婚しています。", en: "I am married. (state)", reading: "けっこんしています。", breakdown: "結婚して(married-te) います(am)" },
    ],
    quiz: [
      { question: "How do you say 'I am eating'?", options: ["食べます", "食べた", "食べています", "食べない"], correct: 2 },
      { question: "〜ている can express:", options: ["Only past actions", "Ongoing actions and resultant states", "Future plans only", "Negative requests"], correct: 1 },
    ],
  },
  {
    id: "g12",
    title: "〜たことがある — Have Ever Done",
    titleJa: "〜たことがある",
    level: "N4",
    structure: "[Verb ta-form] + ことがある",
    explanation: "Used to express that you have had the experience of doing something at least once. It describes past experiences.",
    examples: [
      { ja: "日本に行ったことがあります。", en: "I have been to Japan.", reading: "にほんにいったことがあります。", breakdown: "行った(went) こと(experience) が あります(have)" },
      { ja: "寿司を食べたことがありますか。", en: "Have you ever eaten sushi?", reading: "すしをたべたことがありますか。", breakdown: "食べた(ate) こと が あります(have) か(question)" },
      { ja: "富士山に登ったことがない。", en: "I have never climbed Mt. Fuji.", reading: "ふじさんにのぼったことがない。", breakdown: "登った(climbed) こと が ない(don't have)" },
    ],
    quiz: [
      { question: "How do you say 'I have eaten ramen'?", options: ["ラーメンを食べます", "ラーメンを食べたことがあります", "ラーメンを食べている", "ラーメンを食べたい"], correct: 1 },
      { question: "What form precedes ことがある?", options: ["て-form", "ます-form", "た-form", "ない-form"], correct: 2 },
    ],
  },
  {
    id: "g13",
    title: "〜なければならない — Must / Have To",
    titleJa: "〜なければならない",
    level: "N4",
    structure: "[Verb nai-form stem] + なければならない",
    explanation: "Expresses obligation or necessity — 'must do' or 'have to do'. The casual form is 「〜なきゃ」. Negative: 「〜なくてもいい」(don't have to).",
    examples: [
      { ja: "宿題をしなければなりません。", en: "I must do my homework.", reading: "しゅくだいをしなければなりません。", breakdown: "宿題(homework) を し(do) なければなりません(must)" },
      { ja: "毎日薬を飲まなければならない。", en: "I have to take medicine every day.", reading: "まいにちくすりをのまなければならない。", breakdown: "薬(medicine) を 飲ま(drink-nai-stem) なければならない(must)" },
      { ja: "早く帰らなきゃ。", en: "I have to go home soon. (casual)", reading: "はやくかえらなきゃ。", breakdown: "帰ら(return-nai-stem) なきゃ(must-casual)" },
    ],
    quiz: [
      { question: "Which means 'must study'?", options: ["勉強してもいい", "勉強しなければならない", "勉強したい", "勉強しないでください"], correct: 1 },
      { question: "Casual form of なければならない is:", options: ["なりません", "なくてもいい", "なきゃ", "ながら"], correct: 2 },
    ],
  },
  {
    id: "g14",
    title: "〜てもいい — May / It's OK To",
    titleJa: "〜てもいい",
    level: "N4",
    structure: "[Verb te-form] + もいい",
    explanation: "Used to give or ask for permission. 「〜てもいいですか」means 'May I...?' and 「〜てもいいです」means 'You may...' or 'It's OK to...'.",
    examples: [
      { ja: "写真を撮ってもいいですか。", en: "May I take a photo?", reading: "しゃしんをとってもいいですか。", breakdown: "写真(photo) を 撮って(take-te) も いい(ok) ですか(question)" },
      { ja: "ここに座ってもいいです。", en: "You may sit here.", reading: "ここにすわってもいいです。", breakdown: "ここ(here) に 座って(sit-te) も いい(ok) です" },
      { ja: "帰ってもいいよ。", en: "It's OK to go home. (casual)", reading: "かえってもいいよ。", breakdown: "帰って(go home-te) も いいよ(ok-casual)" },
    ],
    quiz: [
      { question: "How do you ask 'May I come in?'", options: ["入ってはいけません", "入ってもいいですか", "入らなければなりません", "入っている"], correct: 1 },
      { question: "〜てもいい expresses:", options: ["Prohibition", "Permission", "Obligation", "Past experience"], correct: 1 },
    ],
  },
  {
    id: "g15",
    title: "〜てはいけない — Must Not / Prohibited",
    titleJa: "〜てはいけない",
    level: "N4",
    structure: "[Verb te-form] + はいけない",
    explanation: "Expresses prohibition — 'must not' or 'you cannot'. It is the opposite of 〜てもいい. Polite: 「〜てはいけません」.",
    examples: [
      { ja: "ここで写真を撮ってはいけません。", en: "You must not take photos here.", reading: "ここでしゃしんをとってはいけません。", breakdown: "撮って(take-te) は いけません(must not)" },
      { ja: "授業中に寝てはいけない。", en: "You must not sleep during class.", reading: "じゅぎょうちゅうにねてはいけない。", breakdown: "寝て(sleep-te) は いけない(must not)" },
      { ja: "嘘をついてはいけないよ。", en: "You must not lie.", reading: "うそをついてはいけないよ。", breakdown: "ついて(lie-te) は いけないよ(must not-casual)" },
    ],
    quiz: [
      { question: "Which means 'You must not run here'?", options: ["ここで走ってもいいです", "ここで走ってはいけません", "ここで走りたいです", "ここで走っています"], correct: 1 },
      { question: "〜てはいけない is the opposite of:", options: ["〜なければならない", "〜たことがある", "〜てもいい", "〜ている"], correct: 2 },
    ],
  },
  {
    id: "g10",
    title: "で (de) — Location of Action / Means",
    titleJa: "で",
    level: "N5",
    structure: "[Place] + で + [Action] or [Means] + で + [Action]",
    explanation: "The particle 「で」marks where an action takes place (not just existing), or the means/method by which something is done (by bus, in Japanese, with chopsticks, etc.).",
    examples: [
      { ja: "学校で勉強します。", en: "I study at school.", reading: "がっこうでべんきょうします。", breakdown: "学校(school) で(at) 勉強します(study)" },
      { ja: "バスで行きます。", en: "I go by bus.", reading: "バスでいきます。", breakdown: "バス(bus) で(by) 行きます(go)" },
      { ja: "日本語で話してください。", en: "Please speak in Japanese.", reading: "にほんごではなしてください。", breakdown: "日本語(Japanese) で(in/by) 話して(speak) ください(please)" },
    ],
    quiz: [
      { question: "Choose the correct particle: 図書館___勉強します。", options: ["に", "を", "で", "は"], correct: 2 },
      { question: "で can indicate:", options: ["Location of action and means/method", "Only direction", "Only possession", "Only topic"], correct: 0 },
    ],
  },
];
