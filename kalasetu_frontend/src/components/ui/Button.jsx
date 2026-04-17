export function Button({
  type = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <button type={type} className={`button ${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
