# Contributing to AI Flow

Thank you for your interest in contributing to **AI Flow**.

Contributions are not limited to code. Improving documentation, reporting issues, suggesting features, and helping other contributors are all valuable ways to participate.

---

## Table of Contents

- [Getting Started]()
- [Development Workflow]()
- [Coding Guidelines]()
- [Testing]()
- [Issues and Discussions]()
- [Pull Requests]()
- [Additional Notes]()
- [Commit Message Convention]()

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- `node.js` (latest LTS recommended)
- `npm` or `yarn`
- `git`

### Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/Jyotibrat/AI-Flow.git
cd AI-Flow
npm install
````

Run the development server:

```bash
npm run dev
```

---

## Development Workflow

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Test your changes locally
5. Submit a pull request

Branch naming convention:

* `feature/<name>` for new features
* `fix/<name>` for bug fixes
* `docs/<name>` for documentation changes

---

## Coding Guidelines

* Write *clear*, *maintainable*, and *modular* code
* Follow *existing project structure* and *patterns*
* Use *meaningful variable* and *function names*
* Avoid *unnecessary dependencies*
* Keep changes *focused* and *minimal*

---

## Testing

* Ensure the application runs without errors
* Verify that new features do not break existing functionality
* Test UI changes across different screen sizes where applicable

---

## Issues and Discussions

Before creating a new issue:

* Check if a similar issue already exists
* Provide a clear and descriptive title
* Include steps to reproduce (for bugs)
* Add relevant screenshots or logs if necessary

For larger changes or new features, open an issue first to discuss the approach.

---

## Pull Requests

When submitting a pull request:

* Provide a clear description of the changes
* Reference related issues if applicable
* Keep pull requests small and focused
* Ensure your branch is up to date with `main`

Review process:

* Maintainers will review your changes
* Feedback may be provided for improvements
* Changes may be requested before merging

---

## Additional Notes

* Keep all discussions public within issues or pull requests so others can benefit
* Avoid direct private communication regarding project changes unless necessary
* Respect all contributors and maintain a collaborative environment

---

## Commit Message Convention

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via a `commit-msg` hook. Every commit must match the format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration |
| `chore` | Maintenance tasks |
| `revert` | Revert a previous commit |

### Good commits

```bash
# Simple feature
feat: add dark mode toggle

# Feature with scope
feat(auth): add Google OAuth login

# Bug fix referencing issue
fix(api): handle timeout errors gracefully

Fixes #42

# Breaking change
feat(api)!: change response format to JSON:API

BREAKING CHANGE: All responses now use camelCase keys.

# Documentation
docs: add setup instructions to README

# Dependency update
build: upgrade vite to v6
```

### Bad commits

```bash
# No type prefix
added login page

# Wrong tense (use imperative mood)
fix: fixed the broken button
feat: added new feature

# Too vague
fix: bug fix
update: updates
chore: misc

# Too long (keep under 72 chars)
feat: add a new feature that allows users to export their data in multiple formats including CSV, JSON, and XML

# Uppercase first letter of description
fix: Fixed the login redirect

# Period at end of description
feat: add dark mode toggle.
```

### Setup

Husky is configured automatically on `npm install` via the `prepare` script. The `commit-msg` hook runs [commitlint](https://commitlint.js.org/) on every commit and rejects messages that do not follow the convention.

---

## Summary

**Contributing is about improving the project as a whole. Whether through code, ideas, or support, every contribution is valuable.**