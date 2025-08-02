<h1 align="center">
AI Flow
</h1>

<div align="center">
    <img src="../public/logo.ico" alt="Project Logo" width="200">
</div>
AI Flow is a modern web application offering a suite of powerful AI-powered tools to enhance productivity and creativity. Built with React, TypeScript, Tailwind CSS, and powered by Google's Gemini 2.0 Flash API, it provides tools for prompt engineering, summarization, code explanation, translation, sentiment analysis, and more.

## Features

- **7 AI Tools:** Prompt Enhancer, Summarizer, SQL Query Explainer, Regex Generator, Code Explainer, Language Translator, Sentiment Analyzer.
- **Secure & Private:** Data is processed securely and never stored.
- **Modern UI:** Responsive, animated interface using Tailwind CSS and Framer Motion.
- **Authentication:** Email/password and Google OAuth via Supabase.
- **Contact Form:** Backend (Express + Nodemailer) for user inquiries.
- **Blog & Community:** Integrated blog and community pages.
- **Open Source:** Contributions welcome!

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Vite
- **Backend:** Express, Nodemailer (for contact form)
- **Auth & DB:** Supabase
- **AI:** Gemini 2.0 Flash API
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

For the Frontend:

```sh
git clone https://github.com/Jyotibrat/AI-Flow.git
cd AI-Flow
npm install
```

For the Backend:

```sh
cd AI-Flow
cd server
npm install
```

If in the terminal it shows that there are some `vulnerabilities` then run this command:

```sh
npm audit fix
```

If the `vulnerabilities` still persists:

```sh
npm audit fix --force
```

If in the terminal it shows packages need funding then run this command:

```sh
npm fund
```

### Environment Variables


Create a `.env` file in the root and set:

```
VITE_APP_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_GA_MEASUREMENT_ID=your_ga_id
VITE_BLOGGER_API_KEY=your_blogger_api_key
VITE_BLOG_ID=your_blog_id
```

For the backend (`server/`), create a `.env` file:

```
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

```md
## 🛠️ Environment Variables Setup

If you find difficulty in setting up environment variables, follow these steps(You can follow the steps provided in .env.example to set them up):

1. Copy the `.env.example` files to `.env` files:

```bash
cp .env.example .env
cp server/.env.example server/.env


### Running Locally

#### Frontend

```sh
npm run dev
```

#### Backend

```sh
cd server
node index.js
```

## Contributing

See [**Contribution Guidelines**](https://ai-flow-gssoc.vercel.app/contribute) for guidelines. Fork the repo, create a feature branch, and submit a pull request!

## License

The project is under [**MIT LICENSE**](LICENSE)

## Links

- [**Live Demo**](https://ai-flow-gssoc.vercel.app)
- [**Blog**](https://ai-flow-gssoc.vercel.app/blog)
- [**Twitter**](https://x.com/B_Jyotibrat)
- [**LinkedIn**](https://www.linkedin.com/in/bindupautra-jyotibrat)
- [**Contact**](mailto:bjyotibrat@gmail.com)

---

*Empowering everyone with accessible AI tools.*