# Security Policy

## Reporting Security Vulnerabilities

We take the security of AI-Flow seriously. If you discover a security vulnerability, please report it to us privately.

## Recent Security Update - August 9, 2025

### Resolved Issue ✅
**Git commit `1292859` contained exposed API credentials that have been completely revoked.**

### Exposed Credentials (NOW INVALID):
- Google OAuth Client Secret: `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` ❌ **REVOKED**
- Supabase JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ❌ **REVOKED**

### Remediation Actions:
1. ✅ All exposed API keys have been revoked at their respective service providers
2. ✅ New credentials generated and secured in environment variables
3. ✅ Enhanced `.gitignore` patterns to prevent future exposure
4. ✅ Security documentation added to repository
5. ✅ Environment variable externalization completed

### Impact Assessment:
- **No data breach occurred** - credentials were detected before malicious use
- **No user data compromised** - authentication systems remain secure
- **Service continuity maintained** - new credentials deployed seamlessly

### For Users:
No action required from end users. The application continues to function normally with secure, updated credentials.

### For Contributors:
- Generate new API credentials from service providers
- Use `.env.local` for local development (never commit this file)
- Follow the updated security guidelines in the project documentation

## Security Best Practices

- Never commit API keys, tokens, or passwords to git
- Use environment variables for sensitive configuration
- Regularly rotate API credentials
- Enable GitHub security scanning and alerts

## Contact

For security concerns, please open an issue in this repository or contact the maintainers directly.

---
*This security policy serves as transparent documentation of our commitment to maintaining a secure codebase.*
