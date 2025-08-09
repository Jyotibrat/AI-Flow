import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Apply theme to the whole app
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <Navbar />
      <main className="flex-1 ml-0 lg:ml-20 pt-16 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};


export default Layout;