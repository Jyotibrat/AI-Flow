import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Twitter, Send, User, MessageSquare, Coffee } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Get backend URL from environment variables (Vite uses import.meta.env)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const adminSocials = [
    {
      name: 'Buy Me a Coffee',
      icon: Coffee,
      url: 'https://coff.ee/bjyotibrat',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/bindupautra-jyotibrat',
      color: 'from-blue-600 to-blue-800'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/Jyotibrat',
      color: 'from-gray-600 to-gray-800'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://x.com/B_Jyotibrat',
      color: 'from-blue-400 to-blue-600'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or need support? We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-900 dark:text-white">
              <Mail className="w-8 h-8 mr-3 text-blue-500" />
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-100 dark:bg-green-600/20 border border-green-400 dark:border-green-600 rounded-lg text-green-700 dark:text-green-400"
                >
                  Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-100 dark:bg-red-600/20 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-400"
                >
                  Failed to send message. Please try again later.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Admin Info */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Admin Profile */}
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Meet the Admin</h2>
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src="/project_admin_pic.jpg"
                  alt="Project Admin"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Bindupautra Jyotibrat</h3>
                  <p className="text-purple-600 dark:text-purple-400">Project Admin & Lead Developer</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">AI Flow</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Passionate about AI and open-source development. Leading the AI Tools Hub project 
                to make powerful AI tools accessible to everyone. Always open to feedback and 
                collaboration opportunities.
              </p>
              
              <div className="flex space-x-4">
                {adminSocials.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">bjyotibrat@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">Response within 24 hours</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;