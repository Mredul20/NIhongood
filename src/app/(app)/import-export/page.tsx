'use client';

import { useState } from 'react';
import { importCards, downloadExport, exportToCSV, exportToJSON } from '@/lib/importExport';
import { useSRSStore } from '@/store/srsStore';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/database';

export default function ImportExportPage() {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importProgress, setImportProgress] = useState<{ imported: number; total: number } | null>(null);

  const { user } = useAuthStore();
  const { cards } = useSRSStore();
  const addCard = useSRSStore((s) => s.addCard);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    setMessage(null);
    setImportProgress(null);

    try {
      const content = await file.text();
      const result = await importCards(file.name, content);

      if (result.errors.length > 0 && result.cardsImported === 0) {
        setMessage({
          type: 'error',
          text: `Import failed: ${result.errors[0].message}`,
        });
        setIsLoading(false);
        return;
      }

      // Import cards to database and store
      setImportProgress({ imported: 0, total: result.importedCards.length });

      for (let i = 0; i < result.importedCards.length; i++) {
        const card = result.importedCards[i];
        const id = `imported-${Date.now()}-${i}`;

        // Add to local store
        addCard({
          id,
          front: card.front,
          back: card.back,
          reading: card.reading,
          type: card.type,
        });

        // Sync to database
        await db.upsertSRSCard(user.id, {
          id,
          front: card.front,
          back: card.back,
          reading: card.reading,
          type: card.type,
        });

        setImportProgress({ imported: i + 1, total: result.importedCards.length });
      }

      setMessage({
        type: 'success',
        text: `Successfully imported ${result.cardsImported} cards${result.errors.length > 0 ? ` (${result.errors.length} errors skipped)` : ''}`,
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

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300'
                : 'bg-red-900/30 border-red-500/50 text-red-300'
            }`}
          >
            {message.text}
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

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Upload Cards</h2>
              <p className="text-slate-400 mb-4 text-sm">
                Supported formats: CSV, JSON. Anki (APKG) coming soon.
              </p>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="block p-8 text-center border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-sakura-500/50 hover:bg-slate-800/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                  <p className="text-xs text-slate-500 mt-2">CSV or JSON format</p>
                </label>
              </div>

              {importProgress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Importing cards...</span>
                    <span>
                      {importProgress.imported} / {importProgress.total}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sakura-400 to-sakura-600 transition-all"
                      style={{
                        width: `${(importProgress.imported / importProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-slate-100 mb-4">CSV Format Example</h3>
              <pre className="bg-slate-900 p-4 rounded text-xs text-slate-400 overflow-x-auto">
{`Front,Back,Reading,Type,Tags
漢字,Kanji,かんじ,vocab,common;n5
あ,Japanese hiragana character,あ,kana,hiragana
です,To be (copula),です,grammar,present;formal`}
              </pre>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-slate-100 mb-4">JSON Format Example</h3>
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
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Export Your Cards</h2>
              <p className="text-slate-400 mb-6 text-sm">
                You have {cards.length} cards ready to export.
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
