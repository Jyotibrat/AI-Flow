import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  FileText,
  Database,
  Search,
  Globe,
  BarChart,
  Zap,
  Image,
} from "lucide-react";

const Examples: React.FC = () => {
  const examples = [
    {
      icon: Zap,
      title: "AI Prompt Enhancer",
      input: "Write a story about a robot",
      output:
        "Craft a compelling 500-word science fiction narrative about a sentient robot that discovers emotions for the first time, exploring themes of consciousness, identity, and what it means to be truly alive in a dystopian future society.",
      description:
        "Transform basic prompts into detailed, effective instructions for better AI responses.",
    },
    {
      icon: Image,
      title: "Image Generator",
      input:
        "A fluffy astronaut cat in a glowing space suit floats inside a spaceship, gazing at a colorful nebula through a round window. Blue and purple ambient light fills the scene in a cinematic sci-fi concept art style",
      output: "/cat.png",
      description:
        "Turn basic image ideas into vivid, detailed prompts optimized for AI image generation.",
    },
    {
      icon: FileText,
      title: "AI Summarizer",
      input: "Long article about climate change impacts...",
      output:
        "Climate change significantly affects global weather patterns, leading to rising sea levels, extreme weather events, and biodiversity loss. Immediate action is required to mitigate these effects.",
      description:
        "Condense lengthy texts into concise, informative summaries.",
    },
    {
      icon: Database,
      title: "SQL Query Explainer",
      input:
        "SELECT u.name, COUNT(o.id) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id",
      output:
        "This query retrieves user names along with their order counts by joining the users and orders tables, grouping results by user ID to show how many orders each user has placed.",
      description:
        "Understand complex SQL queries with plain English explanations.",
    },
    {
      icon: Search,
      title: "Regex Generator",
      input: "Match email addresses",
      output: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      description:
        "Generate regular expressions from natural language descriptions.",
    },
    {
      icon: Code,
      title: "Code Explainer",
      input:
        "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
      output:
        "This is a recursive function that calculates the nth Fibonacci number. It returns n if n is 0 or 1, otherwise it recursively calls itself with n-1 and n-2 and adds the results.",
      description: "Get clear explanations of code functionality and logic.",
    },
    {
      icon: Globe,
      title: "Language Translator",
      input: "Hello, how are you today?",
      output: "Hola, ¿cómo estás hoy? (Spanish)",
      description: "Translate text between multiple languages accurately.",
    },
    {
      icon: BarChart,
      title: "Sentiment Analyzer",
      input:
        "I absolutely love this new product! It exceeded all my expectations.",
      output:
        'Sentiment: Positive (95% confidence)\nEmotion: Joy, Satisfaction\nKey indicators: "absolutely love", "exceeded expectations"',
      description:
        "Analyze text sentiment and emotional tone with detailed insights.",
    },
  ];

  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8 }}
  className="min-h-screen px-6 py-12 bg-white dark:bg-gray-900"
>
  <div className="container mx-auto max-w-6xl">
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        AI Tools Examples
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Discover how our AI tools can transform your workflow with these
        practical examples
      </p>
    </motion.div>

    <div className="grid gap-8">
      {examples.map((example, index) => (
        <motion.div
          key={index}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
          className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors duration-300"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <example.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {example.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{example.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-3 text-green-600 dark:text-green-400">
                Input
              </h4>
              <div className="bg-gray-200 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-300 font-mono text-sm">
                  {example.input}
                </p>
              </div>
            </div>
            {example.title === "Image Generator" ? (
              <div>
                <h4 className="text-lg font-medium mb-3 text-blue-600 dark:text-blue-400">
                  Output
                </h4>
                <div className="bg-gray-200 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                  <img
                    src={example.output}
                    alt="Generated image"
                    className="rounded-lg max-w-full mx-auto"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-medium mb-3 text-blue-600 dark:text-blue-400">
                  Output
                </h4>
                <div className="bg-gray-200 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                  <p className="text-gray-800 dark:text-gray-300 font-mono text-sm">
                    {example.output}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>

  );
};

export default Examples;
