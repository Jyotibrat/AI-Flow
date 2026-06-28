const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const helmet = require("helmet");

dotenv.config()

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle all HTTP methods for /api/contact
app.all('/api/contact', async (req, res) => {
  const method = req.method;
  
  try {
    if (method === 'GET') {
      // Handle GET requests - return endpoint info
      res.status(200).json({
        success: true,
        message: 'Contact endpoint is working',
        method: 'GET',
        info: 'Use POST method with name, email, subject, and message to send contact form'
      });
    }
    
    else if (method === 'POST') {
      // Handle POST requests - send email
      const { name, email, subject, message } = req.body;

      // Validate input
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'All fields are required (name, email, subject, message)',
          method: 'POST'
        });
      }

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully!',
        method: 'POST'
      });
    }
    
    else if (method === 'PUT') {
      // Handle PUT requests
      res.status(200).json({
        success: true,
        message: 'PUT request received',
        method: 'PUT',
        info: 'PUT method is supported but no specific functionality implemented'
      });
    }
    
    else if (method === 'DELETE') {
      // Handle DELETE requests
      res.status(200).json({
        success: true,
        message: 'DELETE request received',
        method: 'DELETE',
        info: 'DELETE method is supported but no specific functionality implemented'
      });
    }
    
    else if (method === 'PATCH') {
      // Handle PATCH requests
      res.status(200).json({
        success: true,
        message: 'PATCH request received',
        method: 'PATCH',
        info: 'PATCH method is supported but no specific functionality implemented'
      });
    }
    
    else {
      // Handle any other HTTP methods
      res.status(200).json({
        success: true,
        message: `${method} request received`,
        method: method,
        info: `${method} method is supported but no specific functionality implemented`
      });
    }
    
  } catch (error) {
    console.error(`Error handling ${method} request:`, error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to process ${method} request. Please try again later.`,
      method: method
    });
  }
});

// Root endpoint to test server
app.all('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!',
    method: req.method,
    endpoints: {
      '/': 'Server status (supports all methods)',
      '/api/contact': 'Contact form endpoint (supports all methods)'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("server is running")