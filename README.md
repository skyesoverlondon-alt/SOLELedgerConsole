# SOLE Ledger Console (Asset Ledger + AI Doc Studio)

Lord kAIxu, this must be deployed via Git or it will not be useful to you.

Why: the OpenAI integration is a Netlify Function (/api/ai). Netlify Drop does not run Functions.

## Deploy (Netlify, via Git)
1) Create a Git repo and add these files
2) Netlify → New site from Git
3) Set Environment Variables (Site settings → Environment variables):
   - OPENAI_API_KEY = your OpenAI API key
   - (optional) OPENAI_MODEL = gpt-4.1-mini

### Local dev
- Install deps: `npm install`
- Start Netlify dev (proxies functions): `npx netlify dev`
- The static site lives in `public/`; the function is in `netlify/functions/ai.js` and is reachable at `/api/ai`.

### Test the function
- With curl:
   ```bash
   curl -X POST http://localhost:8888/api/ai \
      -H "Content-Type: application/json" \
      -d '{"prompt": "Give me a one-line status."}'
   ```
- Or open `http://localhost:8888` and use the form in the page.

## Use
1) Ledger → paste your big ledger CSV → Import/Merge
2) Proof Pack → paste your canon context/proof pack → Save
3) Doc Studio → select an asset → Generate → Print/Save PDF

## Notes
- The app is local-first and stores ledger + prefs in LocalStorage.
- Exports: CSV/JSON.
- Print-to-PDF: uses browser print.
