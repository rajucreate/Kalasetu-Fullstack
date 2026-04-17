export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="loading-state">
      <p>{message}</p>
    </div>
  );
}
