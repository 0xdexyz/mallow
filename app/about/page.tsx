import WorkflowDiagram from '@/components/WorkflowDiagram';

export const metadata = {
  title: 'About — Mallow',
};

export default function AboutPage() {
  return (
    <section className="page-section about">
      <h1 className="page-heading">Mallow is an AI social agent for crypto.</h1>
      <p className="about-sub">
        Mallow is designed to listen to crypto conversations, identify the ideas behind them, understand context,
        and help turn those signals into meaningful interactions.
      </p>
      <WorkflowDiagram />
    </section>
  );
}
