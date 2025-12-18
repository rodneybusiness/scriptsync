# Security Rules

## API Keys

- Never commit API keys to version control
- Use `.env.local` for local development (gitignored)
- Copy from `.env.local.example` template
- Required: `ANTHROPIC_API_KEY` for AI features

## User Input

- Sanitize all user input before rendering
- Use React's built-in XSS protection (JSX escaping)
- Validate file uploads (PDF parsing accepts user files)

## PDF Parsing

`pdfParser.ts` processes user-uploaded PDFs:
- Validate file type before processing
- Handle malformed PDFs gracefully
- Don't execute any embedded scripts

## Local Storage

`storageService.ts` stores project data in localStorage:
- Don't store sensitive credentials
- Handle storage quota exceeded errors
- Validate data integrity on load

## AI Service Calls

- Rate limit AI requests to prevent abuse
- Don't expose API keys in client-side code
- Validate AI responses before using

## Dependencies

- Keep dependencies updated (`npm audit`)
- Review new dependencies before adding
- Prefer well-maintained packages with active security updates

## Content Security

For deployment (Vercel/Netlify):
- CSP headers configured in `vercel.json` / `netlify.toml`
- HTTPS enforced
- Secure cookie settings if session management added
