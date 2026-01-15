// ToolsPage.jsx
import ToolCard from "../tools/ToolCard";
import Timestamps from "../tools/active/Timestamps.jsx";

import { useNavigate } from 'react-router-dom';

const toolsList = [
  { 
    id: "timestamps", 
    title: "Timestamp Converter", 
    description: "Convert between timestamps", 
    status: "Ready"  
  },
  { 
    id: "wordcount", 
    title: "Word Counter", 
    description: "Count words and characters", 
    status: "Coming Soon" 
  }
];

const ToolsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Dev Tools</h1>
        <p className="text-zinc-400 mb-8">Tools I actively use</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map(tool => (
            <button
              key={tool.id}
              onClick={() => navigate(`/tools/${tool.id}`)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={tool.status === "Coming Soon"}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{tool.title}</h3>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  tool.status === "Ready" 
                    ? "text-emerald-500 bg-emerald-500/10" 
                    : "text-zinc-600 bg-zinc-800"
                }`}>
                  {tool.status}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-4">{tool.description}</p>
              {tool.status === "Coming Soon" && (
                <div className="text-xs text-zinc-600 mt-4">Click when ready</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
