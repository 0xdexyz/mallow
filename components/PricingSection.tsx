'use client';

import { useState } from 'react';
import ExclusiveModal from './ExclusiveModal';

const FREE_FEATURES = [
  'Paste a crypto post',
  'Analyze with Mallow',
  'Thesis detection',
  'Context understanding',
  'Contextual response generation',
  'Copy & edit responses',
  'History',
];

const EXCLUSIVE_FEATURES = [
  'Deeper thesis analysis',
  'Multi-post context',
  'Related conversation discovery',
  'Narrative tracking',
  'Multiple response variations',
  'Extended context memory',
  'Advanced agent controls',
  'Priority analysis',
];

const COMPARISON_ROWS: [string, boolean, boolean][] = [
  ['Paste & analyze crypto posts', true, true],
  ['Thesis detection', true, true],
  ['Context understanding', true, true],
  ['Response generation', true, true],
  ['History', true, true],
  ['Multi-post context', false, true],
  ['Related conversation discovery', false, true],
  ['Narrative tracking', false, true],
  ['Multiple response variations', false, true],
  ['Extended context memory', false, true],
  ['Advanced agent controls', false, true],
  ['Priority analysis', false, true],
];

export default function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="pricing" aria-labelledby="pricing-heading">
      <div className="pricing-intro">
        <span className="hero-eyebrow">Plans</span>
        <h2 id="pricing-heading" className="page-heading pricing-heading">Free vs Exclusive</h2>
        <p className="pricing-sub">Start free. Unlock more with Mallow Exclusive.</p>
      </div>

      <div className="pricing-cards">
        <div className="plan-card plan-card--free">
          <span className="plan-badge plan-badge--free">FREE</span>
          <h3 className="plan-name">Mallow Free</h3>
          <p className="plan-price">$0</p>
          <p className="plan-tagline">The core Mallow experience</p>
          <ul className="plan-features">
            {FREE_FEATURES.map((feature) => (
              <li key={feature}>
                <span className="plan-check" aria-hidden="true">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <a href="#paste-a-post" className="btn-ghost plan-cta">
            Start analyzing
          </a>
        </div>

        <div className="plan-card plan-card--exclusive">
          <span className="plan-badge plan-badge--exclusive">Coming soon</span>
          <h3 className="plan-name">Mallow Exclusive</h3>
          <p className="plan-price">1.8 SOL</p>
          <p className="plan-tagline">Premium social intelligence</p>
          <ul className="plan-features">
            {EXCLUSIVE_FEATURES.map((feature) => (
              <li key={feature}>
                <span className="plan-check plan-check--exclusive" aria-hidden="true">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button type="button" className="btn-primary plan-cta" onClick={() => setModalOpen(true)}>
            Unlock Exclusive
          </button>
          <span className="plan-preview-note">Preview only — not yet available</span>
        </div>
      </div>

      <div className="comparison">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Free</th>
              <th scope="col">Exclusive</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map(([feature, free, exclusive]) => (
              <tr key={feature}>
                <th scope="row">{feature}</th>
                <td>{free ? <span className="comparison-yes">✓</span> : <span className="comparison-no">—</span>}</td>
                <td>{exclusive ? <span className="comparison-yes comparison-yes--exclusive">✓</span> : <span className="comparison-no">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExclusiveModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
