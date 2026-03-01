# SOLE Ledger Console (Asset Ledger + AI Doc Studio)

Lord kAIxu, this must be deployed via Git or it will not be useful to you.

Why: the OpenAI integration is a Netlify Function (/api/ai). Netlify Drop does not run Functions.

## Deploy (Netlify, via Git)
1) Create a Git repo and add these files
2) Netlify → New site from Git
3) Set Environment Variables (Site settings → Environment variables):
   - OPENAI_API_KEY = your OpenAI API key
   - (optional) OPENAI_MODEL = gpt-4.1-mini

## Use
1) Ledger → paste your big ledger CSV → Import/Merge
2) Proof Pack → paste your canon context/proof pack → Save
3) Doc Studio → select an asset → Generate → Print/Save PDF

## Notes
- The app is local-first and stores ledger + prefs in LocalStorage.
- Exports: CSV/JSON.
- Print-to-PDF: uses browser print.
