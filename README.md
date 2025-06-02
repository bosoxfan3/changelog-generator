# AI Changelog Generator

This is a two-part app that uses AI to generate user-facing changelogs from GitHub commit messages.

## Part 1: Developer Tool

Accessible at '/'

Input a public repo owner, public project name, and date range

Fetches commits from the GitHub API

Uses OpenAI to summarize relevant changes

Lets you edit the title/description before publishing

## Part 2: Public Changelog Page

Accessible at '/changelogs'/

Lists all saved changelogs

Each changelog is expandable, with clean formatting

Data persists using a lightweight SQLite DB via Prisma

## 🚀 Live Demo

[https://changelog-generator-pi.vercel.app/](https://changelog-generator-pi.vercel.app/)

## 🧠 Notes & Decisions

The assumption is that in production the generate page '/' wouldn't be publicly available but the changelogs page ('/changelogs') would be. Hence generate sends you to changelogs, but there is no link to go from changelogs back to generate (you could just hit the '/' url but that wouldn't be available without authentication in production).

This app currently assumes a single-repo use case and does not support managing changelogs across multiple repositories. In a real-world production setting, I would set up unique URLs or IDs per repo and persist changelogs separately for each. For the purposes of this project, I’ve prioritized the core UX and AI integration over multi-repo management.

It also assumes that the user will be fetching the commit history of a _public_ repo. Authorization could be added in the future but did not make sense for a MVP.

Minimal validation is in place (e.g., no future dates, all fields required), but more could easily be added.

I would 100% modularize this so that the pages/generate file did not hold so much JSX and so many functions. But again, it kept it cleaner for an MVP to just keep all the state and functionality in the top level.

I used AI tools to help set up the Prisma and SQLite database functionality, error logging, and some component styling (especially colors).

## 🔧 Built With

-   React
-   TypeScript
-   OpenAI API
-   GitHub API
-   Prisma
-   SQLite

## 📦 Getting Started

1. Clone the repo `git clone https://github.com/bosoxfan3/changelog-generator.git`
2. `cd changelog-generator`
3. Run `npm install`
4. You'll need valid credentials from [OpenAI](https://platform.openai.com/docs/overview). Once you have that, copy the included .env.example file and fill in your credentials:
   `cp .env.example .env`
5. Then open `.env` and update it with your own values:

```
REACT_APP_API_BASE_URL=http://localhost:8080
OPENAI_API_KEY=your_openai_key_here
DATABASE_URL=file:./dev.db
```

You'll need a valid `DATABASE_URL` to use the full functionality locally. You have two options:

-   **Use SQLite (easier for local testing)**: Use `file:./dev.db ` and follow the SQLite steps below referenced below as Option A:
-   **Use Postgre**: Point DATABASE_URL to a local or cloud Postgres instance (e.g. Railway, Supabase, Docker, etc.)

# Backend Setup

6. Set up the backend. `cd backend`
7. Run `npm install`

# Option A: Local DB with SQLite

8. Replace the Prisma schema by running `cp prisma/schema.local.prisma prisma/schema.prisma`. Ensure your root `.env` file contains `DATABASE_URL=file:./dev.db"
9. Run `npx prisma generate`
10. Run `npx prisma db push`

# Option B: Local DB with Postgres

8. Ensure your root `.env` has a valid Postgres URL like `DATABASE_URL=postgresql://user:password@localhost:5432/dbname`
9. Run `npx prisma migrate dev` OR
10. If you prefer skipping migrations: run `npx prisma db push`

# After completing one of the above:

11. Return to the root `cd ..`
12. Start both the front and back end `npm run dev`
    Alternatively, if you only want to run the frontend without the backend:
    `npm start`

# Dev Notes

-   Requires Node.js 18+
-   The app uses SQLite for local development, no external DB setup needed
-   Be sure to provide a valid OpenAI key to generate changelogs

## ✍️ Author

Built by [Daniel Acquesta](https://danielacquesta.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
