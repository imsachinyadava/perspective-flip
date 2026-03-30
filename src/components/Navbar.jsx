export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold text-base tracking-tight">
          Perspective <span className="text-violet-400">Flip</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-600 hover:text-zinc-300 text-xs transition-colors"
        <a>
          GitHub
        </a>
        <span className="text-xs bg-violet-900/40 text-violet-400 border border-violet-800 px-3 py-1 rounded-full">
          Beta
        </span>
      </div>
    </nav>
  );
}