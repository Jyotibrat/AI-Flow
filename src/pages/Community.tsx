import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, Users, MessageSquare, Star, GitFork } from 'lucide-react';

const Community: React.FC = () => {
  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://x.com/B_Jyotibrat',
      description: 'Follow us for updates, tips, and AI tool announcements',
      followers: '7',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/Jyotibrat/AI-Flow',
      description: 'Contribute to our open-source projects and report issues',
      followers: '27',
      color: 'from-gray-400 to-gray-600'
    }
  ];

  const communityStats = [
    { icon: Users, label: 'Community Members', value: '1' },
    { icon: MessageSquare, label: 'Monthly Discussions', value: '10' },
    { icon: Star, label: 'GitHub Stars', value: '7' },
    { icon: GitFork, label: 'Project Forks', value: '0' }
  ];

  const communityBenefits = [
    {
      title: 'Early Access',
      description: 'Get early access to new AI tools and features before they\'re released to the public'
    },
    {
      title: 'Expert Support',
      description: 'Connect with AI experts and experienced developers for guidance and support'
    },
    {
      title: 'Feature Requests',
      description: 'Suggest new features and improvements that could be added to our platform'
    },
    {
      title: 'Learning Resources',
      description: 'Access exclusive tutorials, guides, and best practices for using AI tools effectively'
    },
    {
      title: 'Networking',
      description: 'Connect with like-minded developers, researchers, and AI enthusiasts'
    },
    {
      title: 'Beta Testing',
      description: 'Participate in beta testing new tools and provide valuable feedback'
    }
  ];

  return (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8 }}
  className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900"
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
        Join Our Community
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Connect with developers, AI enthusiasts, and innovators from around the world
      </p>
    </motion.div>

    {/* Community Stats */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="mb-16"
    >
      <div className="grid md:grid-cols-4 gap-6">
        {communityStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Social Links */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Connect With Us</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
            className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${link.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <link.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{link.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{link.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Followers:</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{link.followers}</span>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>

    {/* Community Benefits */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Why Join Our Community?</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {communityBenefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors duration-300"
          >
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{benefit.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Call to Action */}
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="text-center"
    >
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm p-12 rounded-xl border border-blue-300 dark:border-blue-500/30">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Join?</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Become part of our growing community and help shape the future of AI tools
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://x.com/B_Jyotibrat"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-blue-600 rounded-full font-semibold text-white hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <Twitter className="w-5 h-5" />
            <span>Follow on Twitter</span>
          </a>
          <a
            href="https://github.com/Jyotibrat/AI-Flow"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gray-200 dark:bg-gray-700 rounded-full font-semibold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <Github className="w-5 h-5" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </motion.section>
  </div>
</motion.div>

  );
};

export default Community;