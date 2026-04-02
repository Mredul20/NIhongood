export interface GrammarPoint {
  id: string;
  title: string;
  titleJa: string;
  level: "N5" | "N4";
  structure: string;
  explanation: string;
  examples: { ja: string; en: string; breakdown?: string }[];
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
      { ja: "私は学生です。", en: "I am a student.", breakdown: "私(I) は(topic) 学生(student) です(am)" },
      { ja: "これはペンです。", en: "This is a pen.", breakdown: "これ(this) は(topic) ペン(pen) です(is)" },
      { ja: "東京はきれいです。", en: "Tokyo is beautiful.", breakdown: "東京(Tokyo) は(topic) きれい(beautiful) です(is)" },
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
      { ja: "私はマリアです。", en: "I am Maria.", breakdown: "私(I) は(as for) マリア(Maria) です(am)" },
      { ja: "日本語は楽しいです。", en: "Japanese is fun.", breakdown: "日本語(Japanese) は(as for) 楽しい(fun) です(is)" },
      { ja: "天気は良いです。", en: "The weather is good.", breakdown: "天気(weather) は(as for) 良い(good) です(is)" },
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
      { ja: "水を飲みます。", en: "I drink water.", breakdown: "水(water) を(object) 飲みます(drink)" },
      { ja: "本を読みます。", en: "I read a book.", breakdown: "本(book) を(object) 読みます(read)" },
      { ja: "日本語を勉強します。", en: "I study Japanese.", breakdown: "日本語(Japanese) を(object) 勉強します(study)" },
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
      { ja: "学校に行きます。", en: "I go to school.", breakdown: "学校(school) に(to) 行きます(go)" },
      { ja: "七時に起きます。", en: "I wake up at 7 o'clock.", breakdown: "七時(7 o'clock) に(at) 起きます(wake up)" },
      { ja: "日本に住んでいます。", en: "I live in Japan.", breakdown: "日本(Japan) に(in) 住んでいます(living)" },
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
      { ja: "食べます。", en: "I eat. (polite present)", breakdown: "食べ(eat-stem) ます(polite)" },
      { ja: "食べません。", en: "I don't eat. (polite negative)", breakdown: "食べ(eat-stem) ません(polite negative)" },
      { ja: "食べました。", en: "I ate. (polite past)", breakdown: "食べ(eat-stem) ました(polite past)" },
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
      { ja: "猫がいます。", en: "There is a cat.", breakdown: "猫(cat) が(subject) います(exists-animate)" },
      { ja: "誰が来ましたか？", en: "Who came?", breakdown: "誰(who) が(subject) 来ました(came) か(question)" },
      { ja: "水が欲しいです。", en: "I want water.", breakdown: "水(water) が(subject) 欲しい(want) です(is)" },
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
      { ja: "私も学生です。", en: "I am also a student.", breakdown: "私(I) も(also) 学生(student) です(am)" },
      { ja: "猫も好きです。", en: "I like cats too.", breakdown: "猫(cats) も(also) 好き(like) です(is)" },
      { ja: "これもおいしいです。", en: "This is also delicious.", breakdown: "これ(this) も(also) おいしい(delicious) です(is)" },
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
      { ja: "私の本です。", en: "It's my book.", breakdown: "私(I) の(possessive) 本(book) です(is)" },
      { ja: "日本の食べ物", en: "Japanese food", breakdown: "日本(Japan) の(of) 食べ物(food)" },
      { ja: "先生の名前は田中です。", en: "The teacher's name is Tanaka.", breakdown: "先生(teacher) の(possessive) 名前(name) は(topic) 田中(Tanaka) です(is)" },
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
      { ja: "学生ですか。", en: "Are you a student?", breakdown: "学生(student) です(are) か(question)" },
      { ja: "何を食べますか。", en: "What will you eat?", breakdown: "何(what) を(object) 食べます(eat) か(question)" },
      { ja: "これはいくらですか。", en: "How much is this?", breakdown: "これ(this) は(topic) いくら(how much) です(is) か(question)" },
    ],
    quiz: [
      { question: "How do you make a polite question in Japanese?", options: ["Add ね", "Add よ", "Add か", "Add の"], correct: 2 },
      { question: "Translate: 日本人ですか。", options: ["I am Japanese.", "Are you Japanese?", "Japanese person.", "This is Japan."], correct: 1 },
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
      { ja: "学校で勉強します。", en: "I study at school.", breakdown: "学校(school) で(at) 勉強します(study)" },
      { ja: "バスで行きます。", en: "I go by bus.", breakdown: "バス(bus) で(by) 行きます(go)" },
      { ja: "日本語で話してください。", en: "Please speak in Japanese.", breakdown: "日本語(Japanese) で(in/by) 話して(speak) ください(please)" },
    ],
    quiz: [
      { question: "Choose the correct particle: 図書館___勉強します。", options: ["に", "を", "で", "は"], correct: 2 },
      { question: "で can indicate:", options: ["Location of action and means/method", "Only direction", "Only possession", "Only topic"], correct: 0 },
    ],
  },
];
