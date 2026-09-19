'use client';

import type { AnalysisResult } from '@/lib/types';

interface HistoryCardProps {
  entry: AnalysisResult;
  onOpen: (id: string) => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function HistoryCard({ entry, onOpen }: HistoryCardProps) {
  const preview = entry.post.length > 120 ? `${entry.post.slice(0, 120).trim()}…` : entry.post;

  return (
    <article className="history-card">
      <p className="history-preview">{preview}</p>
      <div className="history-meta">
        <span className="history-thesis">{entry.thesis}</span>
        <span className="history-date">{formatDate(entry.createdAt)}</span>
      </div>
      <button type="button" className="history-open" onClick={() => onOpen(entry.id)}>
        Open
      </button>
    </article>
  );
}
