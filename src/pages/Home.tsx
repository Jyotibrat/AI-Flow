import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, Cpu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "../components/AuthModal";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: Zap,
      title: "8 AI Tools",
      description: "Powerful AI-driven utilities for various tasks",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is processed securely and never stored",
    },
    {
      icon: Cpu,
      title: "Advanced AI",
      description: "Powered by Google's Gemini 2.0 Flash API",
    },
  ];

  const handleExploreTools = () => {
    if (user) {
      navigate("/ai-tools");
    } else {
      setShowAuthModal(true);
    }
  };

   return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      >
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 dark:from-blue-900/20 to-purple-900/10 dark:to-purple-900/20">
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-br from-blue-600/5 dark:from-blue-600/10 via-purple-600/5 dark:via-purple-600/10 to-pink-600/5 dark:to-pink-600/10 animate-pulse">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
              </div>
            </div>
          </div>

          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center justify-center relative z-10">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-4">
                AI Flow
              </h1>
              <p className="text-sm md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Unleash the power of artificial intelligence with our
                comprehensive suite of AI-powered tools designed to enhance your
                productivity and creativity.
              </p>
              <motion.button
                onClick={handleExploreTools}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg flex items-center space-x-2 mx-auto lg:mx-0 text-white"
              >
                <span>Explore AI Tools</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              {!user && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 lg:ml-6 ml-1">
                  Sign up to access all AI tools
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center items-center relative z-10"
            >
              <div className="w-96 h-96 bg-gradient-to-br from-blue-600/5 dark:from-blue-600/10 to-purple-600/5 dark:to-purple-600/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/10 dark:border-blue-500/20">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500/20 dark:from-blue-500/30 to-purple-600/20 dark:to-purple-600/30 rounded-full flex items-center justify-center animate-pulse backdrop-blur-sm">
                  <Cpu className="w-32 h-32 text-gray-700 dark:text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Why Choose AI Tools Hub?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience the future of productivity with our cutting-edge
                AI-powered tools
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                  className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Home;