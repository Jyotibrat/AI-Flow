# 🤝 Contributing to AI Flow

Thank you for showing interest in contributing to **AI Flow**! 🚀
We’re thrilled to welcome developers, designers, and AI enthusiasts to help improve our open-source project.

---

## 📜 Code of Conduct

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). We aim to maintain a respectful, inclusive, and collaborative environment. 💖

---

## 🌟 How You Can Contribute

### 🐣 For Beginners

* 📚 Improve documentation
* 🎨 Enhance UI/UX components
* 🐛 Report or fix bugs
* 🧪 Write unit/integration tests
* 🌍 Improve accessibility & localization

### 🛠 For Experienced Contributors

* 🚀 Build new AI tools/features
* ⚡ Optimize performance
* 🔒 Enhance security measures
* 🧠 Improve AI prompt engineering
* 📱 Enhance responsiveness and mobile UI

---

## 🏁 Getting Started

### 1. Fork & Clone the Repository

```bash
git clone https://github.com/<your-username>/AI-Flow.git
cd AI-Flow
```

### 2. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd server
npm install
```

### 4. Setup Environment Variables

Create `.env` files based on `.env.example` in the root and `server/` directories:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Add your credentials:

```env
VITE_APP_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_GA_MEASUREMENT_ID=your_ga_id
VITE_BLOGGER_API_KEY=your_blogger_api_key
VITE_BLOG_ID=your_blog_id
```

```env (server/.env)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

### 5. Run Locally

**Frontend:**

```bash
npm run dev
```

**Backend:**

```bash
cd server
node index.js
```

---

## 📋 Pull Request Guidelines

✅ **Do:**

1. Link your PR to an existing issue using `Fixes #issue_number`
2. Follow the existing code style
3. Test your changes before submitting
4. Write clear, descriptive commit messages
5. Keep PRs focused on one change at a time
6. Update documentation if needed

🚫 **Don't:**

* Submit PRs without linking to an issue
* Make unrelated changes in the same PR
* Submit duplicate or low-quality PRs

---

## 🐛 Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the **bug** label when creating an issue
3. Provide clear reproduction steps
4. Include screenshots or console errors if possible

---

## 💡 Suggesting Features

1. Search for existing feature requests
2. Use the **enhancement** label
3. Explain the feature’s purpose and benefits
4. Suggest possible implementation ideas

---

## 📂 Project Structure

```
AI-Flow/
├── public/               # Public assets
├── src/                  # Frontend source code (React + TypeScript)
├── server/               # Backend (Express + Nodemailer)
├── package.json          # Frontend dependencies
├── server/package.json   # Backend dependencies
├── .env.example          # Frontend environment example
├── server/.env.example   # Backend environment example
└── README.md             # Project documentation
```

---

## 🏆 Recognition

We value all contributors! Your name will appear in the **Contributors** section of our README. 🎉

[![Contributors](https://contrib.rocks/image?repo=Jyotibrat/AI-Flow)](https://github.com/Jyotibrat/AI-Flow/graphs/contributors)

---

## 🌟 Support the Project

If you find AI Flow useful, please ⭐ the repository and share it with others.

**Happy Coding! 💻✨**

*Made with ❤️ for the open-source community*
