'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MallowCharacter from '@/components/MallowCharacter';
import HistoryCard from '@/components/HistoryCard';
import ResultView from '@/components/ResultView';
import { loadHistory, updateHistoryEntry } from '@/lib/history';
import type { AnalysisResult } from '@/lib/types';

export default function HistoryPage() {
  const [entries, setEntries] = useState<AnalysisResult[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const selected = entries?.find((entry) => entry.id === selectedId) ?? null;

  const handleUpdateResponse = (response: string) => {
    if (!selected) return;
    const next = updateHistoryEntry(selected.id, { response });
    setEntries(next);
  };

  if (entries === null) {
    return null;
  }

  if (selected) {
    return (
      <section className="page-section">
        <ResultView
          result={selected}
          mode="history"
          onBack={() => setSelectedId(null)}
          onUpdateResponse={handleUpdateResponse}
        />
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section className="page-section empty-state">
        <MallowCharacter className="empty-character" />
        <h1 className="empty-heading">Nothing here yet.</h1>
        <p className="empty-sub">Analyze your first conversation and Mallow will keep it here.</p>
        <Link href="/" className="btn-primary">
          Analyze a post
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section">
      <h1 className="page-heading">History</h1>
      <div className="history-grid">
        {entries.map((entry) => (
          <HistoryCard key={entry.id} entry={entry} onOpen={setSelectedId} />
        ))}
      </div>
    </section>
  );
}
