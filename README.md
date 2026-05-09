# Kill the Dashboard

> Ask a question. Get a dashboard. No pre-built pages.

An AI agent that generates custom analytics dashboards from natural language. Instead of fixed charts, the agent queries your e-commerce data, picks the right visualizations, and builds the dashboard on the fly — every time.

---

## Prerequisites — install these first

Before you can run the app, you need two things:

### 1. Node.js (version 18 or higher)
Node.js is the engine that runs the app.

- Download from: **[nodejs.org](https://nodejs.org)** — click the "LTS" version
- After installing, open a terminal and check: `node --version` (should show v18 or higher)

### 2. An AI API key
You need **one** of:

| Provider | Where to get it | Cost |
|----------|----------------|------|
| OpenAI (GPT-4o) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Pay-per-use (~$0.01–0.05 per question) |
| Anthropic (Claude) | [console.anthropic.com](https://console.anthropic.com) | Pay-per-use (~$0.01–0.05 per question) |

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/kill-the-dashboard.git
cd kill-the-dashboard
```

### 2. Install dependencies
```bash
npm install
```
This downloads all the libraries the app needs (~30 seconds).

### 3. Set up your API key
Create a file called `.env.local` in the project root folder. Copy and paste one of these:

**If using OpenAI:**
```
OPENAI_API_KEY=sk-your-key-here
AI_PROVIDER=openai
```

**If using Anthropic:**
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
AI_PROVIDER=anthropic
```

> ⚠️ Never share this file or send it to anyone — it contains your private API key.

### 4. Generate the database
This creates ~10,000 fake e-commerce orders to explore:
```bash
npm run seed
```
You should see output ending with `Seed complete!`

### 5. Start the app
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Using the app

1. **Click a suggested question** in the left panel, or type your own
2. **Wait ~10–20 seconds** — the agent queries the database and generates your dashboard
3. **Click "Drill deeper" buttons** to generate a follow-up dashboard
4. **Toggle "Start Feed"** at the bottom of the sidebar to simulate live incoming orders

### Good questions to start with
- `Why did revenue drop last week?` ← best demo, shows a dramatic revenue collapse
- `Show me my top 5 customers by spend`
- `How are sales trending by category this quarter?`
- `Which region is growing the fastest?`
- `What's the cancellation rate trend?`

---

## Troubleshooting

**"Error: no such table: orders"**
You haven't seeded the database yet. Run `npm run seed` first.

**Dashboard loads but shows "An error occurred"**
Your API key is wrong or missing. Check your `.env.local` file — no spaces around the `=` sign, no quotes around the key value.

**App is slow to respond (10–20 seconds)**
This is normal — the agent makes 3–5 database queries before generating the dashboard.

**Port 3000 already in use**
Run `npm run dev -- -p 3001` to use a different port, then open [http://localhost:3001](http://localhost:3001).

---

## Project structure

```
kill-the-dashboard/
├── app/
│   ├── page.tsx               ← Main page (chat + dashboard layout)
│   └── api/
│       ├── chat/route.ts      ← AI agent: receives questions, runs tools, streams response
│       └── live-feed/route.ts ← Live data feed: inserts new fake orders every tick
├── components/
│   ├── chat/                  ← Chat panel, suggested questions, live feed indicator
│   └── dashboard/             ← KPI cards, charts, dashboard canvas
├── lib/
│   ├── schema.ts              ← What a dashboard can look like (widget types and fields)
│   ├── tools.ts               ← Agent tools: executeSql + renderDashboard
│   └── db.ts                  ← SQLite database connection
├── scripts/
│   └── seed.mjs               ← Generates the 10,000 fake orders (run once)
└── data/
    └── store.db               ← The database (created by npm run seed, not in git)
```

---

## Tech stack

| What | Tool |
|------|------|
| Web framework | Next.js 14 |
| AI integration | Vercel AI SDK |
| Database | SQLite (via better-sqlite3) |
| Charts | Recharts |
| Styling | Tailwind CSS |
