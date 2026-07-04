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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactForm({ name, email, subject, message }) {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedSubject = subject?.trim();
  const trimmedMessage = message?.trim();

  if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
    return {
      valid: false,
      message: "All fields are required (name, email, subject, message)",
    };
  }

  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return {
      valid: false,
      message: "Name must be between 2 and 50 characters.",
    };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return {
      valid: false,
      message: "Please provide a valid email address.",
    };
  }

  if (trimmedSubject.length < 5 || trimmedSubject.length > 100) {
    return {
      valid: false,
      message: "Subject must be between 5 and 100 characters.",
    };
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
    return {
      valid: false,
      message: "Message must be between 10 and 1000 characters.",
    };
  }

  return {
    valid: true,
    data: {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    },
  };
}

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
      const validation = validateContactForm(req.body);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
          method: "POST",
        });
      }

      const { name, email, subject, message } = validation.data;

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