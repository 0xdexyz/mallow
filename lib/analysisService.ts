import { AnalysisRequestError, type AnalysisResult } from './types';
import { MOCK_EXAMPLES } from './mockExamples';

const MAX_LENGTH = 600;

export const LOADING_STAGES = [
  'Mallow is listening…',
  'Reading the conversation…',
  'Finding the thesis…',
  'Understanding context…',
  'Writing a response…',
] as const;

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `mallow-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Cheap, synchronous checks that can be shown before any "analysis" begins. */
export function validatePostFormat(post: string): void {
  const trimmed = post.trim();
  if (!trimmed) {
    throw new AnalysisRequestError('EMPTY', 'Paste a post first.');
  }
  if (trimmed.length > MAX_LENGTH) {
    throw new AnalysisRequestError('TOO_LONG', 'Try keeping the conversation concise.');
  }
}

let exampleCursor = 0;

/**
 * Mock stand-in for the future analysis backend. Swap this function's body
 * for a real request (e.g. POST /api/analyze) — analyzePost's signature and
 * return shape stay the same, so the UI never needs to change.
 */
async function mockAnalyze(post: string): Promise<Pick<AnalysisResult, 'thesis' | 'context' | 'response' | 'relevance'>> {
  await delay(600);
  const example = MOCK_EXAMPLES[exampleCursor % MOCK_EXAMPLES.length];
  exampleCursor += 1;
  return {
    thesis: example.thesis,
    context: example.context,
    response: example.response,
    relevance: example.relevance,
  };
}

export async function analyzePost(post: string): Promise<AnalysisResult> {
  validatePostFormat(post);
  const trimmed = post.trim();
  if (trimmed.toLowerCase() === 'fail') {
    throw new AnalysisRequestError('GENERIC', "Mallow couldn't understand this conversation. Try another post.");
  }
  const analysis = await mockAnalyze(trimmed);

  return {
    id: createId(),
    post: trimmed,
    createdAt: new Date().toISOString(),
    ...analysis,
  };
}

export const MAX_POST_LENGTH = MAX_LENGTH;
