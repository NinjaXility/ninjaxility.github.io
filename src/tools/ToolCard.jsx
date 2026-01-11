const ToolCard = ({ title, description, status, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-zinc-400 text-sm mb-4">{description}</p>
    {children || (
      <span className="text-xs text-zinc-600 bg-zinc-800 px-3 py-1 rounded-full">
        {status}
      </span>
    )}
  </div>
);

export default ToolCard;
