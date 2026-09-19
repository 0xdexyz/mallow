export type Relevance = 'High' | 'Medium' | 'Low';

export interface AnalysisResult {
  id: string;
  post: string;
  thesis: string;
  context: string;
  response: string;
  relevance: Relevance;
  createdAt: string;
}

export type AnalysisErrorCode = 'EMPTY' | 'TOO_LONG' | 'GENERIC';

export class AnalysisRequestError extends Error {
  code: AnalysisErrorCode;

  constructor(code: AnalysisErrorCode, message: string) {
    super(message);
    this.name = 'AnalysisRequestError';
    this.code = code;
  }
}
