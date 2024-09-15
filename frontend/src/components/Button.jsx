function Button({ children, className, padded, onClick }) {
  return (
    <button
      className={`flex h-full w-full select-none items-center justify-center overflow-hidden ${padded ? "px-4 py-1" : ""} text-white transition-all hover:ring hover:brightness-110 ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ButtonWrapper({ className, children }) {
  return <div className={className}>{children}</div>;
}

export default Button;

export { Button, ButtonWrapper };
