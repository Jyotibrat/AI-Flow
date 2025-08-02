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
    // Main container with dark theme styling and border
    <div className="relative bg-gray-900/60 p-6 rounded-2xl border border-gray-700 overflow-x-auto max-w-full">
      
      {/* Action buttons - positioned absolutely in top-right corner */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        
        {/* Copy button - copies entire content to clipboard */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          <Copy size={14} />
          Copy
        </button>
        
        {/* Clear button - only shows if onClear prop is provided */}
        {onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded-md"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Markdown content container with proper spacing */}
      <div className="prose prose-invert max-w-none space-y-6 pt-8">
        
        {/* ReactMarkdown component with custom styling for each element */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} // Enables GitHub Flavored Markdown
          components={{
            // Custom heading styles with borders and spacing
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl font-bold text-white mt-8 mb-4 border-b border-gray-600 pb-2"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl font-semibold text-white mt-6 mb-3 border-b border-gray-700 pb-1"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-xl font-medium text-white mt-5 mb-2"
                {...props}
              />
            ),
            
            // Paragraph styling with proper line height
            p: ({ node, ...props }) => (
              <p className="text-gray-200 leading-relaxed mb-2" {...props} />
            ),
            
            // List styling with proper indentation
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc pl-6 space-y-2 text-gray-200"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal pl-6 space-y-2 text-gray-200"
                {...props}
              />
            ),
            
            // List item styling with proper spacing
            li: ({ node, children, ...props }) => (
              <li
                className="ml-4 text-gray-200 leading-relaxed list-item space-y-1"
                {...props}
              >
                {children}
              </li>
            ),
            
            // Code block styling - handles both inline and block code
            code: ({ node, className, children, ...props }: any) => {
              // Determine if code is inline or block based on className
              const isInline = !className || !className.includes("language-");
              
              return isInline ? (
                // Inline code styling - green text on dark background
                <code
                  className="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                // Block code styling - larger container with scroll
                <pre className="bg-gray-800 text-green-300 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                  <code {...props}>{children}</code>
                </pre>
              );
            },
            
            // Blockquote styling with left border and background
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 text-blue-200 italic bg-gray-800/50 py-2 px-3 rounded"
                {...props}
              />
            ),
            
            // Bold text styling
            strong: ({ node, ...props }) => (
              <strong className="text-white font-semibold" {...props} />
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
