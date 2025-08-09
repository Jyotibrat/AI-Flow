import React from 'react';
import { motion } from 'framer-motion';
import { Code, GitBranch, Star, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

const Contribute: React.FC = () => {
  const techStack = [
    { name: 'React', description: 'Frontend framework' },
    { name: 'TypeScript', description: 'Type-safe JavaScript' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Framer Motion', description: 'Animation library' },
    { name: 'Vite', description: 'Build tool' },
    { name: 'Gemini API', description: 'AI processing' }
  ];

  const featuredContributor = {
    name: 'Bindupautra Jyotibrat',
    subheading: 'Project Creator',
    profileImage: '/project_admin_pic.jpg', // Replace with actual image URL
    linkedin: 'https://www.linkedin.com/in/bindupautra-jyotibrat',
    github: 'https://github.com/Jyotibrat',
    twitter: 'https://x.com/B_Jyotibrat'
  };

  const guidelines = [
    {
      title: 'Code Standards',
      items: [
        'Follow TypeScript best practices',
        'Use meaningful variable and function names',
        'Write comprehensive tests',
        'Follow the existing code style'
      ]
    },
    {
      title: 'Pull Request Process',
      items: [
        'Fork the repository',
        'Create a feature branch',
        'Make your changes',
        'Submit a pull request with clear description'
      ]
    },
    {
      title: 'Documentation',
      items: [
        'Update README if needed',
        'Add inline comments for complex logic',
        'Update API documentation',
        'Include examples for new features'
      ]
    }
  ];

  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8 }}
  className="min-h-screen px-6 py-12 bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
>
  <div className="container mx-auto max-w-6xl">
    {/* Header */}
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Contribute to AI Tools Hub
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Join our community of developers and help build the future of AI tools
      </p>
    </motion.div>

    {/* Getting Started */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="mb-16"
    >
      <div className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <GitBranch className="w-8 h-8 mr-3 text-blue-500" />
          Getting Started
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            We welcome contributions from developers of all skill levels. Whether you're fixing bugs, 
            adding new features, or improving documentation, every contribution helps make AI Tools Hub better.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="https://github.com/Jyotibrat/AI-Flow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-900 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <Code className="w-5 h-5 mr-2" />
              View Repository
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <a
              href="https://github.com/Jyotibrat/AI-Flow/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-white"
            >
              <Star className="w-5 h-5 mr-2" />
              View Issues
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </motion.section>

    {/* Technology Stack */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techStack.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">{tech.name}</h3>
            <p className="text-gray-700 dark:text-gray-400">{tech.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Contribution Guidelines */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8">Contribution Guidelines</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {guidelines.map((guideline, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
            className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-300 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">{guideline.title}</h3>
            <ul className="space-y-2">
              {guideline.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Featured Contributor */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">
        Featured Contributor
      </h2>
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-purple-500 transition-colors duration-300 text-center max-w-sm"
        >
          <div className="mb-6">
            <img
              src={featuredContributor.profileImage}
              alt={featuredContributor.name}
              className="w-24 h-24 rounded-full mx-auto border-4 border-purple-500/50 hover:border-purple-500 transition-colors duration-300"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">{featuredContributor.name}</h3>
          <p className="text-purple-600 dark:text-purple-400 mb-6">{featuredContributor.subheading}</p>
          <div className="flex justify-center space-x-6">
            <a 
              href={featuredContributor.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-300"
              title="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href={featuredContributor.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
              title="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href={featuredContributor.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition-colors duration-300"
              title="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  </div>
</motion.div>

  );
};

export default Contribute;