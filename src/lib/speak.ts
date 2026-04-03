/**
 * speak() — uses the Web Speech API (SpeechSynthesis) to speak Japanese text.
 * Falls back silently if not supported.
 */
export function speak(text: string, lang: "ja-JP" | "en-US" = "ja-JP", rate = 0.85) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find a Japanese voice
  if (lang === "ja-JP") {
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(
      (v) => v.lang === "ja-JP" || v.lang === "ja" || v.name.includes("Japanese")
    );
    if (jaVoice) utterance.voice = jaVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/** Load voices asynchronously (Chrome needs this) */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve([]); return; }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
}
