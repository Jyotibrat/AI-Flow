// src/components/FormattedOutput.tsx
// This component renders AI-generated content with markdown formatting and interactive features

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Props interface for the FormattedOutput component
interface Props {
  content: string;        // The markdown content to be rendered
  onClear?: () => void;   // Optional callback to clear the content
}

/**
 * FormattedOutput Component
 * 
 * Renders AI-generated content with:
 * - Markdown formatting support
 * - Copy to clipboard functionality
 * - Clear content option
 * - Syntax highlighting for code blocks
 * - Responsive design with hover effects
 */
const FormattedOutput: React.FC<Props> = ({ content, onClear }) => {
  
  /**
   * Handles copying content to clipboard
   * Shows success/error toast notifications
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Output copied to clipboard");
  };

 return (
  // Main container with light/dark styles
  <div className="
    relative 
    bg-white dark:bg-gray-900/60 
    p-6 rounded-2xl 
    border border-gray-300 dark:border-gray-700 
    overflow-x-auto max-w-full
  ">
    {/* Action buttons */}
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-3 py-1 text-xs 
                   bg-gray-200 dark:bg-gray-700 
                   hover:bg-gray-300 dark:hover:bg-gray-600 
                   text-gray-800 dark:text-white rounded-md"
      >
        <Copy size={14} />
        Copy
      </button>

      {/* Clear button */}
      {onClear && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-1 text-xs 
                     bg-red-500 hover:bg-red-400 
                     text-white rounded-md"
        >
          <Trash2 size={14} />
          Clear
        </button>
      )}
    </div>

    {/* Markdown content */}
    <div className="prose dark:prose-invert max-w-none space-y-6 pt-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1
              className="text-3xl font-bold text-gray-900 dark:text-white 
                         mt-8 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-2xl font-semibold text-gray-900 dark:text-white 
                         mt-6 mb-3 border-b border-gray-300 dark:border-gray-700 pb-1"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-xl font-medium text-gray-900 dark:text-white mt-5 mb-2"
              {...props}
            />
          ),
          p: (props) => (
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-2" {...props} />
          ),
          ul: (props) => (
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-200" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-200" {...props} />
          ),
          li: ({ children, ...props }) => (
            <li className="ml-4 text-gray-700 dark:text-gray-200 leading-relaxed list-item space-y-1" {...props}>
              {children}
            </li>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className || !className.includes("language-");
            return isInline ? (
              <code
                className="bg-gray-100 dark:bg-gray-800 
                           text-green-700 dark:text-green-400 
                           px-1 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-gray-100 dark:bg-gray-800 
                              text-green-700 dark:text-green-300 
                              p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 
                         text-blue-700 dark:text-blue-200 
                         italic bg-blue-50 dark:bg-gray-800/50 
                         py-2 px-3 rounded"
              {...props}
            />
          ),
          strong: (props) => (
            <strong className="text-gray-900 dark:text-white font-semibold" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  </div>
);

};

export default FormattedOutput;
