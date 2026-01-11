// ToolsPage.jsx
import ToolCard from "../tools/ToolCard";
import JSONFormatter from "../tools/JSONFormatter";
import Base64Encoder from "../tools/Base64Encoder";
// import other tools as you implement them

const toolsList = [
  { 
    id: "json", 
    title: "JSON Formatter", 
    description: "Format and validate JSON", 
    component: <JSONFormatter /> 
  },
  { 
    id: "base64", 
    title: "Base64 Encoder", 
    description: "Encode/decode Base64", 
    status: "Coming Soon",
    component: <Base64Encoder /> // uncomment when ready
  },
  { 
    id: "regex", 
    title: "Regex Tester", 
    description: "Test regular expressions", 
    status: "Coming Soon" 
  },
  { 
    id: "hash", 
    title: "Hash Generator", 
    description: "Generate MD5, SHA hashes", 
    status: "Coming Soon" 
  },
  { 
    id: "uuid", 
    title: "UUID Generator", 
    description: "Generate UUIDs", 
    status: "Coming Soon" 
  },
  { 
    id: "wordcount", 
    title: "Word Counter", 
    description: "Count words and characters", 
    status: "Coming Soon" 
  },
  { 
    id: "timezone", 
    title: "Timezone Converter", 
    description: "Convert between timezones", 
    status: "Coming Soon" 
  },
];

const ToolsPage = () => {
  return (
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Dev Tools</h1>
        <p className="text-zinc-400 mb-8">Tools I actively use</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map(tool => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              status={tool.status || "Coming Soon"}
            >
              {tool.component}
            </ToolCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
