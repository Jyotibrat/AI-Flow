import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  FileText,
  Database,
  Code,
  Globe,
  BarChart,
} from "lucide-react";


// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabase';
// import { useAuth } from '../contexts/AuthContext';

// const AiToolsPage = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
//         if (session?.user) {
//           console.log('User logged in via Google:', session.user);
//           navigate('/dashboard');
//         } else {
//           console.log('No session found');
//           navigate('/');
//         }
//       } catch (error) {
//         console.error('Session check failed:', error);
//         setError('Authentication failed Please try again');
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkSession();
//   }, [navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center text-white">
//       {loading ? (
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : (
//         <div>Authenticating with Google...</div>
//       )}
//     </div>
//   );
// };


import FormattedOutput from "../components/FormattedOutput";

const AITools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const tools = [
    {
      id: "prompt-enhancer",
      title: "Prompt Enhancer",
      description: "Enhance your AI prompts for better results",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      systemPrompt: "You are a prompt enhancement specialist. Take the user's basic prompt and transform it into a detailed, effective prompt that will generate better AI responses. Make it clear, specific, and actionable."
    },
    {
      id: "text-summarizer",
      title: "Text Summarizer",
      description: "Summarize long texts into key points",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      systemPrompt: "You are a text summarization expert. Create a concise, well-structured summary of the provided text. Include the main points, key insights, and important details while maintaining clarity and readability."
    },
    {
      id: "code-explainer",
      title: "Code Explainer",
      description: "Explain code functionality and logic",
      icon: Code,
      color: "from-green-500 to-emerald-500",
      systemPrompt: "You are a code explanation specialist. Analyze the provided code and explain what it does, how it works, and any important concepts or patterns used. Make your explanation clear for developers of all levels."
    },
    {
      id: "data-analyzer",
      title: "Data Analyzer",
      description: "Analyze data patterns and insights",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      systemPrompt: "You are a data analysis expert. Examine the provided data and identify patterns, trends, insights, and potential issues. Provide actionable recommendations based on your analysis."
    },
    {
      id: "content-creator",
      title: "Content Creator",
      description: "Create engaging content for various platforms",
      icon: Globe,
      color: "from-red-500 to-pink-500",
      systemPrompt: "You are a content creation specialist. Create engaging, relevant content based on the user's requirements. Focus on audience engagement, clear messaging, and platform-appropriate formatting."
    },
    {
      id: "research-assistant",
      title: "Research Assistant",
      description: "Research topics and provide detailed insights",
      icon: BarChart,
      color: "from-indigo-500 to-purple-500",
      systemPrompt: "You are a research assistant. Provide comprehensive research on the given topic, including key facts, different perspectives, recent developments, and credible sources when possible."
    }
  ];

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const processWithAI = async (inputText: string, systemPrompt: string) => {
    if (!inputText.trim()) {
      setOutput("Please enter some text to process.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;
      
      if (!apiKey) {
        setOutput("Gemini API key not found. Please set VITE_APP_GEMINI_API_KEY in your environment variables.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt + "\n\n" + inputText }],
              },
            ],
          }),

  const GEMINI_API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY;
  const GEMINI_MODEL = import.meta.env.VITE_APP_GEMINI_MODEL || "gemini-2.0-flash";


  const processWithAI = async (
    inputText: string,
    systemPrompt: string,
    isImage: Boolean
  ) => {
    if (!GEMINI_API_KEY) {
      setOutput("API key not configured. Please contact the administrator.");
      setLoading(false);
      return;
    }
    console.log(isImage);


    setLoading(true);
    if (!isImage) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: systemPrompt + "\n" + inputText }],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        console.log(data); // For debugging

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          setOutput(data.candidates[0].content.parts[0].text);
        } else if (data?.error?.message) {
          setOutput(`Gemini API Error: ${data.error.message}`);
        } else {
          setOutput("No response from Gemini API.");

        }
      );

      const data = await response.json();
      
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setOutput(data.candidates[0].content.parts[0].text);
      } else if (data?.error?.message) {
        setOutput(`Gemini API Error: ${data.error.message}`);
      } else {
        setOutput("No response generated. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput("An error occurred while processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool.id);
    setInput("");
    setOutput("");
  };

  const selectedToolData = tools.find(tool => tool.id === selectedTool);

  return (
   <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8 }}
  className="min-h-screen px-6 py-12 bg-gradient-to-b from-gray-900 via-gray-950 to-black"
>
  <div className="container mx-auto max-w-7xl">
    <motion.div

      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text">
            AI Tools Hub
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-300">
            Powerful AI-driven tools to enhance your productivity and creativity
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative max-w-md mx-auto mb-8"
        >
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search AI tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-10 pr-4 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {!selectedTool ? (
          /* Tools Grid */
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                onClick={() => handleToolSelect(tool)}
                className="p-6 transition-all duration-300 bg-gray-800 border border-gray-700 cursor-pointer rounded-xl hover:border-gray-600 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{tool.title}</h3>
                <p className="text-gray-400">{tool.description}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Selected Tool Interface */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-6">
              <button
                onClick={() => setSelectedTool("")}
                className="px-4 py-2 mr-4 transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                ← Back
              </button>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selectedToolData?.color} flex items-center justify-center mr-3`}>
                {selectedToolData?.icon && <selectedToolData.icon className="w-5 h-5 text-white" />}
              </div>
              <h2 className="text-2xl font-bold">{selectedToolData?.title}</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Input Section */}
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold">Input</h3>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Enter text for ${selectedToolData?.title}...`}
                  className="w-full h-64 p-3 text-white bg-gray-700 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => processWithAI(input, selectedToolData?.systemPrompt || "")}
                  disabled={loading || !input.trim()}
                  className="w-full py-3 mt-4 font-semibold transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Process with AI"}
                </button>
              </div>

              {/* Output Section */}
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold">Output</h3>
                <div className="h-64 p-3 overflow-y-auto bg-gray-700 border border-gray-600 rounded-lg">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : output ? (
                    <FormattedOutput content={output} />
                  ) : (
                    <p className="mt-8 text-center text-gray-400">
                      Output will appear here after processing
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        AI Tools
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
        Harness the power of AI with our comprehensive suite of tools
      </p>
    </motion.div>

    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="relative mb-12"
    >
      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search AI tools..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-14 pr-4 py-4 bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
      />
    </motion.div>

    <div className="grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-1">
        <div className="grid gap-4">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-6 rounded-2xl cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105 ${
                selectedTool === tool.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/50"
                  : "bg-gray-800/70 backdrop-blur-md border border-gray-700 hover:border-blue-500"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedTool === tool.id
                      ? "bg-white/20"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }`}
                >
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{tool.name}</h3>
                  <p
                    className={`text-sm ${
                      selectedTool === tool.id
                        ? "text-gray-200"
                        : "text-gray-400"
                    }`}
                  >
                    {tool.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-gray-800/70 backdrop-blur-lg p-10 rounded-2xl border border-gray-700 h-full shadow-lg"
        >
          {selectedTool ? (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gradient">
                {tools.find((t) => t.id === selectedTool)?.name}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Input
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      tools.find((t) => t.id === selectedTool)?.placeholder
                    }
                    className="w-full h-32 p-4 bg-gray-900/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Generate Result"}
                </button>

                {output && (
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">
                      Output
                    </label>
                    <FormattedOutput content={output} onClear={() => setOutput("")} />
                  </div>
                )}
                {imageUrl && (
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">
                      Output
                    </label>
                    <div className="p-4 bg-gray-900/60 border border-gray-600 rounded-xl">
                      <img
                        src={imageUrl}
                        alt="Generated Image"
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Select an AI Tool</h3>
                <p className="text-gray-400">
                  Choose a tool from the left to get started
                </p>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  </div>
</motion.div>

  );
};

export default AITools;
