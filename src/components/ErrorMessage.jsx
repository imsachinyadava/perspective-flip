export default function ErrorMessage({ type, message, onRetry }) {
  if (!message) return null;

  // Warning style
  if (type === "warn" || type === "empty") {
    return (
      <div className="flex items-center gap-3 bg-amber-950 border border-amber-900 rounded-2xl px-4 py-3">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <p className="text-amber-700 text-sm">{message}</p>
      </div>
    );
  }

  // Error style
  return (
    <div className="flex gap-3 bg-red-950 border border-red-900 rounded-2xl px-4 py-4">
      <div className="w-5 h-5 rounded-full bg-red-900 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-red-400 text-xs font-bold">!</span>
      </div>
      <div>
        <p className="text-red-400 text-sm font-medium mb-1">
          {type === "rate" && "Too many requests"}
          {type === "auth" && "Invalid API key"}
          {type === "network" && "Connection error"}
          {type === "generic" && "Something went wrong"}
        </p>
        <p className="text-red-900 text-xs leading-relaxed">{message}</p>
        {type === "rate" && onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-red-500 hover:text-red-300 underline mt-2 transition-colors"
          >
            Retry automatically
          </button>
        )}
      </div>
    </div>
  );
}