'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/lib/types';

interface ResultViewProps {
  result: AnalysisResult;
  mode: 'live' | 'history';
  onTryAnother?: () => void;
  onBack?: () => void;
  onUpdateResponse?: (response: string) => void;
}

export default function ResultView({ result, mode, onTryAnother, onBack, onUpdateResponse }: ResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(result.response);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.response);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // button simply stays in its default state.
    }
  };

  const handleEditStart = () => {
    setDraft(result.response);
    setEditing(true);
  };

  const handleSave = () => {
    onUpdateResponse?.(draft.trim() || result.response);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(result.response);
    setEditing(false);
  };

  return (
    <div className="result">
      <section className="result-card result-card--in" style={{ animationDelay: '0ms' }}>
        <h2 className="result-heading">Conversation</h2>
        <div className="result-post">
          <span className="result-eyebrow">Original post</span>
          <p>{result.post}</p>
        </div>
      </section>

      <section className="result-card result-card--in" style={{ animationDelay: '120ms' }}>
        <h2 className="result-heading">Thesis detected</h2>
        <p className="result-thesis">{result.thesis}</p>
        <span className={`relevance-pill relevance-${result.relevance.toLowerCase()}`}>{result.relevance} relevance</span>
      </section>

      <section className="result-card result-card--in" style={{ animationDelay: '260ms' }}>
        <h2 className="result-heading">Mallow understands</h2>
        <p className="result-body">{result.context}</p>
      </section>

      <section className="result-card result-card--response result-card--in" style={{ animationDelay: '420ms' }}>
        <div className="result-response-head">
          <h2 className="result-heading">Mallow&rsquo;s response</h2>
          {!editing ? (
            <button type="button" className="result-edit" onClick={handleEditStart}>
              Edit
            </button>
          ) : null}
        </div>

        {editing ? (
          <>
            <textarea
              className="response-edit-area"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={4}
              aria-label="Edit Mallow's response"
            />
            <div className="result-actions">
              <button type="button" className="btn-primary" onClick={handleSave}>
                Save
              </button>
              <button type="button" className="btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="result-response-text">{result.response}</p>
            <div className="result-actions">
              <button type="button" className="btn-primary" onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy response'}
              </button>
              {mode === 'live' ? (
                <button type="button" className="btn-ghost" onClick={onTryAnother}>
                  Try another
                </button>
              ) : (
                <button type="button" className="btn-ghost" onClick={onBack}>
                  Back to history
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
