'use client';

import { useState } from 'react';
import { importCardsFromFile, downloadExport, exportToCSV, exportToJSON } from '@/lib/importExport';
import { useSRSStore } from '@/store/srsStore';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/database';

export default function ImportExportPage() {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [importProgress, setImportProgress] = useState<{ imported: number; total: number } | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const { user } = useAuthStore();
  const { cards } = useSRSStore();
  const addCard = useSRSStore((s) => s.addCard);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    setMessage(null);
    setWarnings([]);
    setImportProgress(null);

    try {
      // Use the unified importCardsFromFile which handles CSV, JSON, and APKG
      const result = await importCardsFromFile(file);

      if (result.errors.length > 0 && result.cardsImported === 0) {
        setMessage({
          type: 'error',
          text: `Import failed: ${result.errors[0].message}`,
        });
        setIsLoading(false);
        return;
      }

      if (result.warnings.length > 0) {
        setWarnings(result.warnings);
      }

      // Import cards to database and local store
      setImportProgress({ imported: 0, total: result.importedCards.length });

      for (let i = 0; i < result.importedCards.length; i++) {
        const card = result.importedCards[i];
        const id = card.id ?? `imported-${Date.now()}-${i}`;

        addCard({
          id,
          front: card.front,
          back: card.back,
          reading: card.reading,
          type: card.type,
        });

        await db.upsertSRSCard(user.id, {
          id,
          front: card.front,
          back: card.back,
          reading: card.reading,
          type: card.type,
        });

        setImportProgress({ imported: i + 1, total: result.importedCards.length });
      }

      const skippedNote = result.cardsSkipped > 0 ? ` (${result.cardsSkipped} skipped due to errors)` : '';
      setMessage({
        type: 'success',
        text: `Successfully imported ${result.cardsImported} cards${skippedNote}`,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsLoading(false);
      setImportProgress(null);
      event.target.value = '';
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (cards.length === 0) {
      setMessage({ type: 'error', text: 'No cards to export' });
      return;
    }

    try {
      const exportCards = cards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        reading: card.reading,
        type: card.type,
        importedAt: card.createdAt || new Date().toISOString(),
      }));

      const content = format === 'csv' ? exportToCSV(exportCards) : exportToJSON(exportCards);
      const filename = `nihongood-cards-${new Date().toISOString().split('T')[0]}.${format}`;

      downloadExport(filename, content);
      setMessage({ type: 'success', text: `Exported ${cards.length} cards as ${format.toUpperCase()}` });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Export error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 to-navy-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sakura-300 mb-2">Import & Export</h1>
          <p className="text-slate-400">Manage your study cards with CSV, JSON, and Anki formats</p>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300'
                : message.type === 'warning'
                ? 'bg-amber-900/30 border-amber-500/50 text-amber-300'
                : 'bg-red-900/30 border-red-500/50 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Warnings list */}
        {warnings.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border bg-amber-900/20 border-amber-500/40 text-amber-300">
            <p className="font-semibold mb-2">Warnings ({warnings.length}):</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-sakura-400 border-b-2 border-sakura-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Import Cards
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-sakura-400 border-b-2 border-sakura-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Export Cards
          </button>
        </div>

        {/* ── Import Tab ── */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Upload Cards</h2>
              <p className="text-slate-400 mb-4 text-sm">
                Supported formats: <span className="text-sakura-400 font-medium">CSV</span>,{' '}
                <span className="text-sakura-400 font-medium">JSON</span>, and{' '}
                <span className="text-sakura-400 font-medium">Anki (.apkg)</span>.
              </p>

              {/* Anki badge */}
              <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-indigo-900/30 border border-indigo-500/40 rounded-lg text-indigo-300 text-sm">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong>Anki import:</strong> APKG files are parsed entirely in your browser — your deck
                  is never uploaded to a server.
                </span>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.json,.apkg,.colpkg"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className={`block p-8 text-center border-2 border-dashed rounded-lg transition-colors ${
                    isLoading
                      ? 'border-slate-600 opacity-50 cursor-not-allowed'
                      : 'border-slate-600 cursor-pointer hover:border-sakura-500/50 hover:bg-slate-800/30'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="mx-auto h-8 w-8 text-sakura-400 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-slate-300">Processing file…</p>
                    </>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-8 w-8 text-slate-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-slate-300">Drag files here or click to browse</p>
                      <p className="text-xs text-slate-500 mt-2">CSV · JSON · Anki APKG</p>
                    </>
                  )}
                </label>
              </div>

              {/* Progress bar */}
              {importProgress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Saving cards to your account…</span>
                    <span>
                      {importProgress.imported} / {importProgress.total}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sakura-400 to-sakura-600 transition-all duration-200"
                      style={{
                        width: `${(importProgress.imported / importProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Format reference cards */}
            <div className="grid gap-4 md:grid-cols-1">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">CSV</span>
                  CSV Format
                </h3>
                <pre className="bg-slate-900 p-4 rounded text-xs text-slate-400 overflow-x-auto">
{`Front,Back,Reading,Type,Tags
漢字,Kanji,かんじ,vocab,common;n5
あ,Hiragana "a",,kana,hiragana
です,To be (copula),,grammar,n5`}
                </pre>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">JSON</span>
                  JSON Format
                </h3>
                <pre className="bg-slate-900 p-4 rounded text-xs text-slate-400 overflow-x-auto">
{`{
  "cards": [
    {
      "front": "漢字",
      "back": "Kanji",
      "reading": "かんじ",
      "type": "vocab",
      "tags": ["common", "n5"]
    }
  ]
}`}
                </pre>
              </div>

              <div className="bg-slate-800/50 border border-indigo-700/50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                  <span className="text-xs font-mono bg-indigo-900/60 px-2 py-0.5 rounded text-indigo-300">APKG</span>
                  Anki Deck (.apkg)
                </h3>
                <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                  <li>Export from Anki: <em>File → Export → Anki Deck Package (.apkg)</em></li>
                  <li>Card type is auto-detected from content (kana / vocab / grammar)</li>
                  <li>Tags are imported from Anki tag fields</li>
                  <li>HTML formatting and LaTeX are stripped automatically</li>
                  <li>Up to 500 cards per import (split large decks)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Export Tab ── */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Export Your Cards</h2>
              <p className="text-slate-400 mb-6 text-sm">
                You have <span className="text-sakura-300 font-semibold">{cards.length}</span> cards ready to export.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={cards.length === 0}
                  className="flex-1 bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  disabled={cards.length === 0}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
