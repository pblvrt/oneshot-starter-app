# Next.js + PocketBase Starter Template

A modern Next.js application with PocketBase for authentication, database, and file storage. This template is designed to work seamlessly with GitHub Codespaces for instant development environments.

## 🚀 Quick Start with GitHub Codespaces

The easiest way to get started is using GitHub Codespaces:

1. Click the **"Use this template"** button on GitHub
2. Create your repository
3. Click **"Create codespace on main"**
4. Wait for the environment to set up (~30 seconds)
5. The application will automatically open in your browser

### Available Services in Codespaces

| Service | Port | Description |
|---------|------|-------------|
| Next.js App | 3000 | Your application |
| PocketBase | 8090 | Database, Auth & Admin UI |

Access the **PocketBase Admin UI** at port 8090 with path `/_/` to manage your database and users.

**Default Admin Credentials** (auto-created in Codespaces):
- Email: `admin@example.com`
- Password: `admin123456`

You can customize these by setting `PB_ADMIN_EMAIL` and `PB_ADMIN_PASSWORD` environment variables.

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
3. Start PocketBase:
   ```bash
   cd .devcontainer
   docker compose up -d
   ```
4. Install dependencies and start development:
   ```bash
   bun install
   bun dev
   ```
5. Open http://localhost:3000 in your browser
6. Access PocketBase Admin at http://localhost:8090/_/

### First-Time PocketBase Setup

The admin user is auto-created with these credentials:
- Email: `admin@example.com`  
- Password: `admin123456`

Access the admin UI at http://localhost:8090/_/

To customize the admin credentials, create a `.env` file:
```bash
PB_ADMIN_EMAIL=your@email.com
PB_ADMIN_PASSWORD=your_secure_password
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Backend**: [PocketBase](https://pocketbase.io/) (SQLite-based)
- **Authentication**: PocketBase Auth (email/password + OAuth)
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
│       └── pocketbase/        # PocketBase client & auth
├── .devcontainer/             # Codespaces configuration
│   ├── docker-compose.yml     # PocketBase service
│   ├── devcontainer.json      # VS Code configuration
│   └── setup.sh               # Environment setup
└── public/                    # Static assets
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PB_ADMIN_EMAIL` | PocketBase admin email | `admin@example.com` |
| `PB_ADMIN_PASSWORD` | PocketBase admin password | `admin123456` |
| `NEXT_PUBLIC_POCKETBASE_URL` | PocketBase API URL (browser) | Auto-configured |
| `POCKETBASE_URL` | PocketBase API URL (server) | `http://pocketbase:8090` |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI | Optional |

## 🎯 Features

- ✅ **Authentication**: Sign up/sign in with email & password
- ✅ **OAuth**: GitHub, Google, Discord (configure in PocketBase Admin)
- ✅ **Database**: SQLite with PocketBase collections
- ✅ **Admin UI**: Built-in at `/_/` for database management
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

## 🔐 Setting Up OAuth Providers

To enable OAuth login (GitHub, Google, Discord):

1. Open PocketBase Admin at `/_/`
2. Go to **Settings** → **Auth providers**
3. Enable your desired provider
4. Add your OAuth client ID and secret

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🚀 Deploy

### Vercel + PocketBase Cloud
1. Deploy Next.js to [Vercel](https://vercel.com)
2. Host PocketBase on [PocketHost](https://pockethost.io/) or your own server
3. Update `NEXT_PUBLIC_POCKETBASE_URL` in Vercel environment variables

### Self-Hosted
Both Next.js and PocketBase can be self-hosted on any VPS or container platform.
