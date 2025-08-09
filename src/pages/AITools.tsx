import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  FileText,
  Database,
  Code,
  Globe,
  BarChart,
  Image,
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
  const [imageUrl, setImageUrl] = useState("");

  const tools = [
    {
      id: "prompt-enhancer",
      name: "AI Prompt Enhancer",
      icon: Zap,
      description: "Enhance your prompts for better AI responses",
      placeholder: "Enter your basic prompt...",
      systemPrompt:
        "You are an expert prompt engineer. Transform the user's basic prompt into a detailed, effective prompt that will generate better AI responses. Make it specific, clear, and actionable.",
    },
    {
      id: "image-generator",
      name: "Image Generator",
      icon: Image,
      description: "Turn your ideas into stunning visuals",
      placeholder:
        "Describe your image idea (e.g., 'a sunset over snowy mountains')",
      systemPrompt:
        "You are a professional AI image generator with deep knowledge of visual composition, art styles, and aesthetics. When the user enters a basic prompt, generate a rich, highly detailed, and vivid description optimized for AI image generation. Incorporate specific visual elements like scene, environment, subjects, actions, colors, lighting, mood, camera angle, and artistic style (e.g., digital painting, photorealism, cyberpunk, anime, 3D render). Avoid vague terms. Be imaginative, cinematic, and precise.",
    },
    {
      id: "summarizer",
      name: "AI Summarizer",
      icon: FileText,
      description: "Summarize long texts into concise summaries",
      placeholder: "Enter text to summarize...",
      systemPrompt:
        "You are an expert text summarizer. Provide a concise, accurate summary of the given text while preserving the key information and main points.",
    },
    {
      id: "sql-explainer",
      name: "SQL Query Explainer",
      icon: Database,
      description: "Explain SQL queries in plain English",
      placeholder: "Enter SQL query...",
      systemPrompt:
        "You are an expert SQL developer. Explain the given SQL query in simple, plain English. Break down what each part does and the overall purpose of the query.",
    },
    {
      id: "regex-generator",
      name: "Regex Generator",
      icon: Search,
      description: "Generate regular expressions from descriptions",
      placeholder: "Describe what you want to match...",
      systemPrompt:
        "You are an expert in regular expressions. Generate a regex pattern based on the user's description. Provide the regex pattern and explain what it does.",
    },
    {
      id: "code-explainer",
      name: "Code Explainer",
      icon: Code,
      description: "Explain code functionality and logic",
      placeholder: "Enter code to explain...",
      systemPrompt:
        "You are an expert software developer. Explain the given code in simple terms. Describe what it does, how it works, and any important concepts or patterns used.",
    },
    {
      id: "translator",
      name: "Language Translator",
      icon: Globe,
      description: "Translate text between languages",
      placeholder: "Enter text to translate (specify target language)...",
      systemPrompt:
        "You are an expert translator. Translate the given text to the specified target language. Provide accurate and natural translations while preserving the original meaning.",
    },
    {
      id: "sentiment-analyzer",
      name: "Sentiment Analyzer",
      icon: BarChart,
      description: "Analyze text sentiment and emotions",
      placeholder: "Enter text to analyze...",
      systemPrompt:
        "You are an expert sentiment analyst. Analyze the sentiment of the given text. Provide the sentiment (positive, negative, neutral), confidence level, and key emotional indicators.",
    },
  ];

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      } catch (error) {
        setOutput("Error processing your request. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: inputText, // Just the image description
                    },
                  ],
                },
              ],
              generationConfig: {
                responseModalities: ["TEXT", "IMAGE"],
              },
            }),
          }
        );

        const data = await response.json();
        console.log("Gemini API raw image response:", data);

        const imagePart = data?.candidates?.[0]?.content?.parts?.find(
          (part: any) => part.inlineData?.data
        );

        if (imagePart) {
          const base64Image = imagePart.inlineData.data;
          const mimeType = imagePart.inlineData.mimeType || "image/png";
          const imageUrl = `data:${mimeType};base64,${base64Image}`;
          setImageUrl(imageUrl); // You can use <img src={imageUrl} /> to display it
        } else if (data?.error?.message) {
          setOutput(`Gemini API Error: ${data.error.message}`);
        } else {
          setOutput("No image returned by Gemini API.");
        }
      } catch (error: any) {
        console.error("Error:", error);
        setOutput("Failed to generate image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedTool) {
      setOutput("Please select a tool.");
      return;
    }
    if (!input.trim()) {
      setOutput("Input cannot be empty.");
      return;
    }
    if (input.length > 10000) {
      setOutput("Input is too long. Maximum 10,000 characters.");
      return;
    }
    const tool = tools.find((t) => t.id === selectedTool);
    if (tool) {
      switch (tool.id) {
        case "image-generator":
          processWithAI(input, tool.systemPrompt, true);
          setOutput("");
          break;

        default:
          processWithAI(input, tool.systemPrompt, false);
          setImageUrl("");
          break;
      }
    }
  };

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








// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Search,
//   Zap,
//   FileText,
//   Database,
//   Code,
//   Globe,
//   BarChart,
// } from "lucide-react";
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabase';
// import { useAuth } from '../contexts/AuthContext';
// const AiToolsPage = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session?.user) {
//         console.log('User logged in via Google:', session.user);
//         navigate('/dashboard'); // redirect wherever appropriate
//       } else {
//         console.log('No session found');
//         navigate('/'); // fallback
//       }
//     });
//   }, []);

//   return (
//     <div className="text-center mt-20 text-white">
//       Authenticating with Google...
//     </div>
//   );
// };
// const AITools: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTool, setSelectedTool] = useState("");
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const tools = [
//     {
//       id: "prompt-enhancer",
//       name: "AI Prompt Enhancer",
//       icon: Zap,
//       description: "Enhance your prompts for better AI responses",
//       placeholder: "Enter your basic prompt...",
//       systemPrompt:
//         "You are an expert prompt engineer. Transform the user's basic prompt into a detailed, effective prompt that will generate better AI responses. Make it specific, clear, and actionable.",
//     },
//     {
//       id: "summarizer",
//       name: "AI Summarizer",
//       icon: FileText,
//       description: "Summarize long texts into concise summaries",
//       placeholder: "Enter text to summarize...",
//       systemPrompt:
//         "You are an expert text summarizer. Provide a concise, accurate summary of the given text while preserving the key information and main points.",
//     },
//     {
//       id: "sql-explainer",
//       name: "SQL Query Explainer",
//       icon: Database,
//       description: "Explain SQL queries in plain English",
//       placeholder: "Enter SQL query...",
//       systemPrompt:
//         "You are an expert SQL developer. Explain the given SQL query in simple, plain English. Break down what each part does and the overall purpose of the query.",
//     },
//     {
//       id: "regex-generator",
//       name: "Regex Generator",
//       icon: Search,
//       description: "Generate regular expressions from descriptions",
//       placeholder: "Describe what you want to match...",
//       systemPrompt:
//         "You are an expert in regular expressions. Generate a regex pattern based on the user's description. Provide the regex pattern and explain what it does.",
//     },
//     {
//       id: "code-explainer",
//       name: "Code Explainer",
//       icon: Code,
//       description: "Explain code functionality and logic",
//       placeholder: "Enter code to explain...",
//       systemPrompt:
//         "You are an expert software developer. Explain the given code in simple terms. Describe what it does, how it works, and any important concepts or patterns used.",
//     },
//     {
//       id: "translator",
//       name: "Language Translator",
//       icon: Globe,
//       description: "Translate text between languages",
//       placeholder: "Enter text to translate (specify target language)...",
//       systemPrompt:
//         "You are an expert translator. Translate the given text to the specified target language. Provide accurate and natural translations while preserving the original meaning.",
//     },
//     {
//       id: "sentiment-analyzer",
//       name: "Sentiment Analyzer",
//       icon: BarChart,
//       description: "Analyze text sentiment and emotions",
//       placeholder: "Enter text to analyze...",
//       systemPrompt:
//         "You are an expert sentiment analyst. Analyze the sentiment of the given text. Provide the sentiment (positive, negative, neutral), confidence level, and key emotional indicators.",
//     },
//   ];

//   const filteredTools = tools.filter(
//     (tool) =>
//       tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tool.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Fetch Gemini API key from environment variable (Vite style)
//   const GEMINI_API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY || ""; // Make sure .env has VITE_APP_GEMINI_API_KEY

//   const processWithAI = async (inputText: string, systemPrompt: string) => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-goog-api-key": GEMINI_API_KEY,
//           },
//           body: JSON.stringify({
//             contents: [
//               {
//                 parts: [{ text: systemPrompt + "\n" + inputText }],
//               },
//             ],
//           }),
//         }
//       );

//       const data = await response.json();
//       console.log(data); // For debugging

//       if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//         setOutput(data.candidates[0].content.parts[0].text);
//       } else if (data?.error?.message) {
//         setOutput(`Gemini API Error: ${data.error.message}`);
//       } else {
//         setOutput("No response from Gemini API.");
//       }
//     } catch (error) {
//       setOutput("Error processing your request. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = () => {
//     if (!input.trim() || !selectedTool) return;

//     const tool = tools.find((t) => t.id === selectedTool);
//     if (tool) {
//       processWithAI(input, tool.systemPrompt);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.8 }}
//       className="min-h-screen px-6 py-12"
//     >
//       <div className="container mx-auto max-w-7xl">
//         <motion.div
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.8 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//             AI Tools
//           </h1>
//           <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//             Harness the power of AI with our comprehensive suite of tools
//           </p>
//         </motion.div>

//         {/* Search Bar */}
//         <motion.div
//           initial={{ y: 30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.4, duration: 0.8 }}
//           className="relative mb-12"
//         >
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search AI tools..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </motion.div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Tools Grid */}
//           <div className="lg:col-span-1">
//             <div className="grid gap-4">
//               {filteredTools.map((tool, index) => (
//                 <motion.div
//                   key={tool.id}
//                   initial={{ x: -50, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
//                   onClick={() => setSelectedTool(tool.id)}
//                   className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
//                     selectedTool === tool.id
//                       ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                       : "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500"
//                   }`}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                         selectedTool === tool.id
//                           ? "bg-white/20"
//                           : "bg-gradient-to-r from-blue-600 to-purple-600"
//                       }`}
//                     >
//                       <tool.icon className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold">{tool.name}</h3>
//                       <p
//                         className={`text-sm ${
//                           selectedTool === tool.id
//                             ? "text-gray-200"
//                             : "text-gray-400"
//                         }`}
//                       >
//                         {tool.description}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* Tool Interface */}
//           <div className="lg:col-span-2">
//             <motion.div
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.8, duration: 0.8 }}
//               className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 h-full"
//             >
//               {selectedTool ? (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-6">
//                     {tools.find((t) => t.id === selectedTool)?.name}
//                   </h2>

//                   <div className="space-y-6">
//                     <div>
//                       <label className="block text-sm font-medium mb-3 text-gray-300">
//                         Input
//                       </label>
//                       <textarea
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder={
//                           tools.find((t) => t.id === selectedTool)?.placeholder
//                         }
//                         className="w-full h-32 p-4 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                       />
//                     </div>

//                     <button
//                       onClick={handleSubmit}
//                       disabled={loading || !input.trim()}
//                       className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Processing..." : "Generate Result"}
//                     </button>

//                     {output && (
//                       <div>
//                         <label className="block text-sm font-medium mb-3 text-gray-300">
//                           Output
//                         </label>
//                         <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
//                           <p className="text-gray-200 whitespace-pre-wrap">
//                             {output}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Zap className="w-8 h-8 text-white" />
//                     </div>
//                     <h3 className="text-xl font-semibold mb-2">
//                       Select an AI Tool
//                     </h3>
//                     <p className="text-gray-400">
//                       Choose a tool from the left to get started
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default AITools;