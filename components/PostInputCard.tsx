'use client';

import { MAX_POST_LENGTH } from '@/lib/analysisService';
import { EXAMPLE_POST } from '@/lib/mockExamples';

interface PostInputCardProps {
  post: string;
  onChange: (post: string) => void;
  onAnalyze: (post: string) => void;
  errorMessage: string | null;
  disabled?: boolean;
}

export default function PostInputCard({ post, onChange, onAnalyze, errorMessage, disabled }: PostInputCardProps) {
  const overLimit = post.length > MAX_POST_LENGTH;

  const handleExample = () => {
    onChange(EXAMPLE_POST);
  };

  const handleSubmit = () => {
    onAnalyze(post);
  };

  return (
    <div className="post-card">
      <div className="post-card-head">
        <span className="post-card-label">Paste a post</span>
        <span className="free-badge">FREE</span>
      </div>
      <textarea
        className={overLimit ? 'post-textarea is-over' : 'post-textarea'}
        placeholder="Paste a crypto post or conversation here…"
        value={post}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label="Crypto post or conversation"
        aria-describedby="post-char-count"
        rows={6}
      />
      <div className="post-card-meta">
        <span id="post-char-count" className={overLimit ? 'char-count is-over' : 'char-count'}>
          {post.length} / {MAX_POST_LENGTH}
        </span>
        <button type="button" className="post-example" onClick={handleExample} disabled={disabled}>
          Try an example
        </button>
      </div>

      {errorMessage ? (
        <p className="post-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        className="post-submit"
        onClick={handleSubmit}
        disabled={disabled}
      >
        Analyze with Mallow
      </button>
      <p className="post-helper">Mallow will identify the thesis, understand the context, and generate a response.</p>
    </div>
  );
}
