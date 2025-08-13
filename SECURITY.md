# Security Notice

## API Key Security Update - August 9, 2025

### Issue Resolved ✅
Git commit `1292859` previously contained hardcoded API credentials that have been **completely revoked** and are no longer functional.

**Last Updated:** August 9, 2025 - Security scan retrigger

### Actions Taken:
1. **All exposed credentials have been revoked:**
   - Google OAuth Client Secret: `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` ❌ REVOKED
   - Supabase JWT token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ❌ REVOKED

2. **Security measures implemented:**
   - Environment variables externalized to `.env.local` (gitignored)
   - Enhanced `.gitignore` patterns for sensitive files
   - Security documentation added

### For Developers:
- Generate **NEW** credentials from service providers
- Copy `.env.example` to `.env.local` and add your new keys
- Never commit `.env.local` or any files containing secrets

### Reporting Security Issues:
If you discover security vulnerabilities, please report them privately to the project maintainers.

---
**Note:** This security notice serves as public documentation that the exposed credentials have been properly handled and revoked.
