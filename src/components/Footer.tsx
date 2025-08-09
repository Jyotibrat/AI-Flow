import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Coffee } from "lucide-react";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: "Buy me a coffee",
            href: "https://coff.ee/bjyotibrat",
            icon: Coffee,
            color: "hover:text-yellow-500",
        },
        {
            name: "GitHub",
            href: "https://github.com/Jyotibrat",
            icon: Github,
            color: "hover:text-white",
        },
        {
            name: "Twitter",
            href: "https://x.com/B_Jyotibrat",
            icon: Twitter,
            color: "hover:text-white",
        },
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/bindupautra-jyotibrat",
            icon: Linkedin,
            color: "hover:text-white",
        },
    ];

return (
  <motion.footer
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.8 }}
    className="
      bg-gray-100 dark:bg-gray-900/95 
      backdrop-blur-md 
      border-t border-gray-300 dark:border-gray-800 
      text-gray-600 dark:text-gray-400 
      px-6 py-8
    "
  >
    <div className="mx-auto lg:ml-20 2xl:mx-auto max-w-6xl">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
        {/* Brand Info */}
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            AI Flow
          </h2>
          <p className="text-sm">
            AI Flow helps you work smarter with tools for summarization,
            translation, code explanation, and more — all powered by AI.
          </p>
          <div className="flex space-x-4 mt-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-600 dark:text-gray-400 transition-colors duration-300 ${link.color}`}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 dark:border-gray-800 pt-6 text-sm text-center">
        <p>© {currentYear} AI Tools Hub. All rights reserved.</p>
      </div>
    </div>
  </motion.footer>
);

};

export default Footer;
