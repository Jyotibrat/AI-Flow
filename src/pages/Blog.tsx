import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, User, ExternalLink, Search, Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: string;
  author: string;
  url: string;
  excerpt: string;
}

const Blog: React.FC = () => {
  const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY; // Replace with your actual API key
  const BLOG_ID = import.meta.env.VITE_BLOG_ID; // Replace with your actual Blog ID

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&fetchBodies=true`
        );
        const fetchedPosts: BlogPost[] = response.data.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          published: item.published,
          author: item.author.displayName,
          url: item.url,
          excerpt: item.content.substring(0, 200) + '...' // Simple excerpt creation
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8 }}
  className="min-h-screen px-6 py-12 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300"
>
  <div className="container mx-auto max-w-6xl">
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        AI Tools Hub Blog
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Insights, tutorials, and updates from the world of AI-powered development
      </p>
    </motion.div>

    {/* Search Bar */}
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="relative mb-12"
    >
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search blog posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </motion.div>

    {loading ? (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <span className="ml-4 text-xl text-gray-600 dark:text-gray-400">Loading posts...</span>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
            className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white line-clamp-2">
              {post.title}
            </h2>
            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            </div>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-300"
            >
              <span>Read More</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.article>
        ))}
      </div>
    )}

    {!loading && filteredPosts.length === 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center py-20"
      >
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No posts found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
      </motion.div>
    )}

    {/* Blog Info */}
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="mt-16 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-300 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About Our Blog</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Our blog features the latest insights, tutorials, and updates about AI-powered development tools. 
        From beginner guides to advanced techniques, we cover everything you need to know about leveraging 
        AI in your development workflow.
      </p>
      <div className="flex flex-wrap gap-4">
        <span className="px-3 py-1 bg-blue-600/20 text-blue-500 dark:text-blue-400 rounded-full text-sm">AI Development</span>
        <span className="px-3 py-1 bg-purple-600/20 text-purple-500 dark:text-purple-400 rounded-full text-sm">Machine Learning</span>
        <span className="px-3 py-1 bg-green-600/20 text-green-500 dark:text-green-400 rounded-full text-sm">Productivity</span>
        <span className="px-3 py-1 bg-orange-600/20 text-orange-500 dark:text-orange-400 rounded-full text-sm">Tutorials</span>
      </div>
    </motion.div>
  </div>
</motion.div>

  );
};

export default Blog;