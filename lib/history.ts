import type { AnalysisResult } from './types';

const STORAGE_KEY = 'mallow.history.v1';
const MAX_ENTRIES = 30;

export function loadHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(entries: AnalysisResult[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // Storage may be unavailable (private browsing, quota). Fail silently —
    // history is a convenience, not a requirement for the flow to work.
  }
}

export function saveHistoryEntry(entry: AnalysisResult): AnalysisResult[] {
  const existing = loadHistory();
  const next = [entry, ...existing.filter((item) => item.id !== entry.id)];
  persist(next);
  return next;
}

export function updateHistoryEntry(id: string, patch: Partial<AnalysisResult>): AnalysisResult[] {
  const existing = loadHistory();
  const next = existing.map((item) => (item.id === id ? { ...item, ...patch } : item));
  persist(next);
  return next;
}
