
# Project Overview

This is a Next.js starter template with:
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** for UI components (all components pre-installed)
- **Supabase** for authentication and database
- **OpenRouter** for AI/LLM integration
- **DevContainer** for CodeSandbox with local Supabase

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/chat/           # Streaming chat API endpoint
│   ├── auth/
│   │   └── callback/       # OAuth callback handler
│   └── page.tsx            # Home page
├── components/
│   └── ui/                 # shadcn/ui components (50+ components)
└── lib/
    ├── ai/                 # OpenRouter AI configuration
    │   ├── openrouter.ts   # Client and model definitions
    │   ├── chat.ts         # Chat helper functions
    │   └── index.ts        # Exports
    ├── supabase/           # Supabase configuration
    │   ├── client.ts       # Browser client
    │   ├── server.ts       # Server client
    │   ├── middleware.ts   # Session refresh middleware
    │   └── auth.ts         # Auth helper functions
    └── utils.ts            # Utility functions (cn)
```

## Getting Started

### Option 1: CodeSandbox / DevContainer (Recommended)

Open this project in CodeSandbox - it will automatically:
1. Start the devcontainer with Node.js 20
2. Spin up local Supabase (Postgres, Auth, REST API, Studio)
3. Install dependencies and start the dev server

**Local Supabase URLs:**
- App: `http://localhost:3000`
- Supabase API: `http://localhost:8000`
- Supabase Studio: `http://localhost:3002`
- Inbucket (email testing): `http://localhost:9000`

### Option 2: Manual Setup

1. Copy `.env.local.example` to `.env.local` and add your credentials
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

## DevContainer Services

The devcontainer includes a full Supabase stack:

| Service | Port | Description |
|---------|------|-------------|
| App | 3000 | Next.js dev server |
| Kong | 8000 | Supabase API gateway |
| Studio | 3002 | Supabase dashboard |
| Postgres | 5432 | Database |
| Auth | 9999 | GoTrue auth service |
| Inbucket | 9000 | Email testing UI |

**Default credentials (local only):**
```
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
Service Role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
DB Password: postgres
```

## OpenRouter AI Setup

1. Get an API key from https://openrouter.ai/keys
2. Add `OPENROUTER_API_KEY` to `.env.local`

### AI Functions Available

```typescript
import { chat, chatStream, generate, models } from "@/lib/ai";

// Simple generation
const response = await generate("Write a haiku about coding");

// Chat with messages
const response = await chat([
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: "Hello!" }
]);

// Streaming chat
const stream = await chatStream(messages);
for await (const chunk of stream) {
  console.log(chunk.choices[0]?.delta?.content);
}

// Use different models
const response = await chat(messages, { model: models.gpt4o });
```

### Available Models

- `models.claude4Opus` / `models.claude4Sonnet` / `models.claudeHaiku`
- `models.gpt4o` / `models.gpt4oMini` / `models.o1`
- `models.gemini2Flash` / `models.geminiPro`
- `models.llama33` / `models.deepseekChat` / `models.qwen25`

### Chat API Endpoint

POST to `/api/chat` with:
```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "model": "anthropic/claude-sonnet-4" // optional
}
```

## Supabase Setup (Production)

1. Create a project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Add them to `.env.local`

### Auth Functions Available

- `signInWithEmail(email, password)` - Email/password sign in
- `signUpWithEmail(email, password)` - Email/password sign up
- `signOut()` - Sign out current user
- `signInWithOAuth(provider)` - OAuth sign in (google, github, discord)
- `resetPassword(email)` - Send password reset email
- `updatePassword(password)` - Update user password

## shadcn/ui Components

All 50+ shadcn/ui components are pre-installed:

```
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb,
button, button-group, calendar, card, carousel, chart, checkbox, collapsible,
command, context-menu, dialog, drawer, dropdown-menu, empty, field, form,
hover-card, input, input-group, input-otp, item, kbd, label, menubar,
navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner,
spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip
```

## MCP Servers

This project includes MCP server configurations for:
- **Supabase MCP** - Database and auth operations
- **Context7** - Documentation lookup

Set `SUPABASE_ACCESS_TOKEN` in your environment to use the Supabase MCP.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
