🧾 AI Changelog Generator
This is a two-part app that uses AI to generate user-facing changelogs from GitHub commit messages.

🛠 Developer Tool
Input a repo owner, project name, and date range

Fetches commits from the GitHub API

Uses OpenAI to summarize relevant changes

Lets you edit the title/description before publishing

🌍 Public Changelog Page
Lists all saved changelogs

Each changelog is expandable, with clean formatting

Data persists using a lightweight SQLite DB via Prisma

🧠 Notes & Decisions
This app assumes a single-repo use case for simplicity. In a production setting, I’d use unique URLs or IDs per repo to support multi-repo changelog management.

I used my own CSS instead of Tailwind for faster iteration.

Minimal validation is in place (e.g., no future dates, all fields required), but more could easily be added.

🧪 Running the App

# Backend

cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend

cd frontend
npm install
npm start
