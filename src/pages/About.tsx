import React from "react";
import { motion } from "framer-motion";
import { Brain, Target, Users, Award } from "lucide-react";

const About: React.FC = () => {
  const tools = [
    "AI Prompt Enhancer",
    "Image Generator",
    "AI Summarizer",
    "SQL Query Explainer",
    "Regex Generator",
    "Code Explainer",
    "Language Translator",
    "Sentiment Analyzer",
  ];

  const values = [
    {
      icon: Brain,
      title: "Innovation",
      description:
        "We leverage cutting-edge AI technology to create tools that push the boundaries of what's possible.",
    },
    {
      icon: Target,
      title: "Precision",
      description:
        "Our tools are designed with accuracy and reliability in mind, ensuring consistent results every time.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description:
        "We believe powerful AI tools should be accessible to everyone, regardless of technical background.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our platform, from user experience to AI performance.",
    },
  ];

  return (
 <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8 }}
  className="min-h-screen px-6 py-12 bg-white dark:bg-gray-900 transition-colors duration-300"
>
  <div className="container mx-auto max-w-4xl">
    {/* Header */}
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        About AI Tools Hub
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
        Your gateway to the future of artificial intelligence
      </p>
    </motion.div>

    {/* Mission */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Our Mission
      </h2>
      <div className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700 transition-colors duration-300">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          At AI Tools Hub, we're dedicated to democratizing access to powerful artificial intelligence tools. Our mission is to empower individuals and businesses with cutting-edge AI capabilities that enhance productivity, creativity, and problem-solving.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          We believe that AI should be accessible, intuitive, and beneficial to everyone. That's why we've created a comprehensive suite of AI-powered tools that cater to various needs, from content creation to code analysis, all powered by Google's advanced Gemini 2.0 Flash API.
        </p>
      </div>
    </motion.section>

    {/* Available Tools */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Available AI Tools
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              <span className="text-gray-800 dark:text-gray-200">{tool}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Values */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Our Values
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
            className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-300 dark:border-gray-700 transition-colors duration-300"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <value.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              {value.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  </div>
</motion.div>

  );
};

export default About;
