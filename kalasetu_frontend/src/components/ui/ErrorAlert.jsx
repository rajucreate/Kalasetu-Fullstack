export function ErrorAlert({ message }) {
  if (!message) return null;
  return <div className="error-banner">{message}</div>;
}
