import type { AnalysisResult } from './types';

export type MockExample = Omit<AnalysisResult, 'id' | 'createdAt'>;

export const MOCK_EXAMPLES: MockExample[] = [
  {
    post: 'Been watching this ecosystem lately. Interesting how quickly the conversation is picking up. Curious whether the attention actually turns into sustained activity.',
    thesis: 'Growing ecosystem attention',
    context:
      'The author is observing increased discussion around the ecosystem but remains uncertain whether the current attention will translate into lasting activity.',
    response:
      'The increase in attention is definitely worth watching. The interesting part will be whether that conversation continues translating into sustained ecosystem activity.',
    relevance: 'High',
  },
  {
    post: 'Noticed a few new teams shipping in this space over the last month. Feels early but the pace of building is picking up.',
    thesis: 'Early builder momentum',
    context:
      'The author has observed new teams beginning to ship products, suggesting early-stage development activity rather than confirmed traction.',
    response:
      "Early builder momentum is one of the more reliable signals to watch. Worth tracking whether that pace of shipping continues over the next few months.",
    relevance: 'Medium',
  },
  {
    post: 'Sentiment in the community channels feels different this week. More questions about the roadmap than usual, less hype.',
    thesis: 'Shift from hype to scrutiny',
    context:
      'The author senses a change in community tone, moving from speculative excitement toward more substantive questions about direction.',
    response:
      "That shift from hype to scrutiny is usually a healthy sign. It often means the audience is looking past price and asking what's actually being built.",
    relevance: 'Medium',
  },
  {
    post: "Volume has been climbing for a few days without much news. Wondering if that's organic interest or something else.",
    thesis: 'Unexplained volume increase',
    context:
      'The author notices rising activity without a clear catalyst, and is trying to determine whether it reflects genuine interest or short-term speculation.',
    response:
      'Volume moving ahead of news is worth watching closely. The next few days should clarify whether this is organic interest or a short-lived spike.',
    relevance: 'High',
  },
  {
    post: 'Starting to see this project mentioned outside its usual circles. Might just be noise, but the crossover is new.',
    thesis: 'Narrative spreading beyond core community',
    context:
      "The author is noting early signs of the conversation reaching audiences outside the project's typical community, a potential expansion signal.",
    response:
      "Narratives crossing into new communities are worth tracking. It's still early, but that kind of crossover often precedes broader attention.",
    relevance: 'Low',
  },
];

export const EXAMPLE_POST = MOCK_EXAMPLES[0].post;
