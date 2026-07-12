export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="state-panel" aria-live="polite">
      <span className="loader" />
      <p>{label}</p>
    </div>
  );
}
