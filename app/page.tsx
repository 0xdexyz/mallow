'use client';

import { useState } from 'react';
import MallowCharacter from '@/components/MallowCharacter';
import PostInputCard from '@/components/PostInputCard';
import LoadingSequence from '@/components/LoadingSequence';
import ResultView from '@/components/ResultView';
import PricingSection from '@/components/PricingSection';
import { analyzePost, delay, validatePostFormat } from '@/lib/analysisService';
import { saveHistoryEntry, updateHistoryEntry } from '@/lib/history';
import { AnalysisRequestError, type AnalysisResult } from '@/lib/types';

type Phase = 'idle' | 'loading' | 'result';

const MIN_LOADING_MS = 3600;

export default function Home() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [post, setPost] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (submittedPost: string) => {
    setErrorMessage(null);
    try {
      validatePostFormat(submittedPost);
    } catch (error) {
      if (error instanceof AnalysisRequestError) setErrorMessage(error.message);
      return;
    }
    setPhase('loading');
    try {
      const [analysis] = await Promise.all([analyzePost(submittedPost), delay(MIN_LOADING_MS)]);
      saveHistoryEntry(analysis);
      setResult(analysis);
      setPost('');
      setPhase('result');
    } catch (error) {
      setPhase('idle');
      if (error instanceof AnalysisRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Mallow couldn't understand this conversation. Try another post.");
      }
    }
  };

  const handleTryAnother = () => {
    setResult(null);
    setErrorMessage(null);
    setPost('');
    setPhase('idle');
  };

  const handleUpdateResponse = (response: string) => {
    if (!result) return;
    const updated = { ...result, response };
    setResult(updated);
    updateHistoryEntry(result.id, { response });
  };

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">AI social agent for crypto</span>
          <h1 className="hero-heading">understand the conversation.</h1>
          <p className="hero-sub">Mallow finds the thesis, understands the context, and helps you respond.</p>
        </div>
        <MallowCharacter thinking={phase === 'loading'} className="hero-character" />
      </section>

      <section className="workspace" id="paste-a-post">
        {phase === 'idle' ? (
          <PostInputCard post={post} onChange={setPost} onAnalyze={handleAnalyze} errorMessage={errorMessage} />
        ) : null}
        {phase === 'loading' ? <LoadingSequence /> : null}
        {phase === 'result' && result ? (
          <ResultView
            result={result}
            mode="live"
            onTryAnother={handleTryAnother}
            onUpdateResponse={handleUpdateResponse}
          />
        ) : null}
      </section>

      <PricingSection />
    </>
  );
}
