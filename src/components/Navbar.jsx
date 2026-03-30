import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-zinc-900 px-4 py-3 flex items-center justify-between"
    >
      <span className="text-white font-semibold text-base tracking-tight">
        Perspective <span className="text-violet-400">Flip</span>
      </span>
      <div className="flex items-center gap-3">
        
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-600 hover:text-zinc-300 text-xs transition-colors"
        <a>
          GitHub
        </a>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs bg-violet-900/40 text-violet-400 border border-violet-800 px-3 py-1 rounded-full"
        >
          Beta
        </motion.span>
      </div>
    </motion.nav>
  );
}