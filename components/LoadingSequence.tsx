'use client';

import { useEffect, useState } from 'react';
import { LOADING_STAGES } from '@/lib/analysisService';

export default function LoadingSequence() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= LOADING_STAGES.length - 1) return;
    const timer = window.setTimeout(() => setStageIndex((index) => index + 1), 750);
    return () => window.clearTimeout(timer);
  }, [stageIndex]);

  return (
    <div className="loading-card" role="status" aria-live="polite">
      <p className="loading-stage" key={stageIndex}>
        {LOADING_STAGES[stageIndex]}
      </p>
      <div className="loading-dots" aria-hidden="true">
        {LOADING_STAGES.map((_, index) => (
          <span key={index} className={index <= stageIndex ? 'is-filled' : undefined} />
        ))}
      </div>
    </div>
  );
}
