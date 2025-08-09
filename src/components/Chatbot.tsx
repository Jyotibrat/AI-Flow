import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

// Fetch Gemini API key from Vite environment variable
const GEMINI_API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY || "";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your AI assistant. How can I help you navigate the AI Tools Hub?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = { type: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: inputValue }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let botText = "Sorry, I couldn't process your request.";
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        botText = data.candidates[0].content.parts[0].text;
      } else if (data?.error?.message) {
        botText = `Gemini API Error: ${data.error.message}`;
      }
      setMessages((prev) => [...prev, { type: "bot", text: botText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error connecting to Gemini API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-20 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        <MessageCircle className="w-6 h-6 text-white" />
      )}
    </motion.button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-36 right-6 z-40 w-80 h-96 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 
            rounded-lg shadow-xl"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Assistant
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-300 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 
                    bg-gray-100 dark:bg-gray-700 
                    border border-gray-300 dark:border-gray-600 
                    rounded-lg 
                    text-gray-900 dark:text-white 
                    placeholder-gray-500 dark:placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-white"
                  disabled={loading}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);

};

export default Chatbot;
