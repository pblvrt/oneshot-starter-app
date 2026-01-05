# Next.js + Supabase Starter Template

A modern Next.js application with Supabase authentication, database, and AI chat functionality. This template is designed to work seamlessly with GitHub Codespaces for instant development environments.

## 🚀 Quick Start with GitHub Codespaces

The easiest way to get started is using GitHub Codespaces:

1. Click the **"Use this template"** button on GitHub
2. Create your repository
3. Click **"Create codespace on main"**
4. Wait for the environment to set up (this may take 2-3 minutes)
5. The application will automatically open in your browser

### Available Services in Codespaces

| Service | Port | Description |
|---------|------|-------------|
| Next.js App | 3000 | Your application |
| Supabase API | 8000 | REST & Auth API |
| Supabase Studio | 3002 | Database admin UI |
| Email Inbox | 9000 | View sent emails (Inbucket) |

All ports are automatically forwarded - click the "Ports" tab in VS Code to access them.

## 🖥️ Local Development

If you prefer local development:

### Prerequisites
- [Bun](https://bun.sh) (recommended) or Node.js 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Setup
1. Clone this repository
2. Copy the environment file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Start the Supabase services:
   ```bash
   cd .devcontainer
   docker compose up -d
   ```
4. Install dependencies and start development:
   ```bash
   bun install
   bun dev
   ```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: [shadcn/ui](https://ui.shadcn.com/) with Tailwind CSS
- **AI**: OpenRouter integration for chat functionality
- **Package Manager**: npm (Codespaces) / [Bun](https://bun.sh/) (local)
- **TypeScript**: Full type safety throughout

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── login/             # Login/signup page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utility libraries
│       ├── ai/                # AI/OpenRouter integration
│       └── supabase/          # Supabase client & auth
├── .devcontainer/             # Codespaces configuration
│   ├── docker-compose.yml     # Supabase services
│   ├── devcontainer.json      # VS Code configuration
│   └── init.sql              # Database initialization
└── public/                    # Static assets
```

## 🔧 Environment Variables

The template includes sensible defaults for development. For production, update these in your Supabase dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

## 🎯 Features

- ✅ **Authentication**: Sign up/sign in with email & password
- ✅ **Database**: Pre-configured tables for users, credits, and subscriptions
- ✅ **AI Chat**: OpenRouter integration for conversational AI
- ✅ **Modern UI**: Clean, accessible interface with shadcn/ui
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Codespaces Ready**: One-click development environment

## 📚 Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
