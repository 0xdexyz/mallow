const STEPS = ['Listen', 'Find the thesis', 'Understand', 'Respond'];

export default function WorkflowDiagram() {
  return (
    <ol className="workflow">
      {STEPS.map((step, index) => (
        <li key={step} className="workflow-step">
          <span className="workflow-pill">{step}</span>
          {index < STEPS.length - 1 ? (
            <span className="workflow-arrow" aria-hidden="true">
              ↓
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
