# TanStack Start + PocketBase Starter Template

A modern TanStack Start application with PocketBase for authentication, database, and file storage.

## 🖥️ Local Development

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

### Available Services

| Service | Port | Description |
|---------|------|-------------|
| TanStack Start App | 3000 | Your application |
| PocketBase | 8090 | Database, Auth & Admin UI |

### Default Admin Credentials

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

- **Framework**: [TanStack Start](https://tanstack.com/start) with TanStack Router
- **Backend**: [PocketBase](https://pocketbase.io/) (SQLite-based)
- **Authentication**: PocketBase Auth (email/password + OAuth)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) with Tailwind CSS
- **AI**: OpenRouter integration for chat functionality
- **Package Manager**: [Bun](https://bun.sh/)
- **TypeScript**: Full type safety throughout

## 📁 Project Structure

```
├── src/
│   ├── routes/                # TanStack Router file-based routes
│   │   ├── __root.tsx        # Root layout
│   │   ├── index.tsx         # Home page (/)
│   │   └── login.tsx         # Login page (/login)
│   ├── components/           # React components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utility libraries
│   │   ├── ai/               # AI/OpenRouter integration
│   │   └── pocketbase/       # PocketBase client & auth
│   ├── styles/
│   │   └── app.css           # Global styles (Tailwind)
│   ├── router.tsx            # Router configuration
│   └── routeTree.gen.ts      # Auto-generated route tree
├── .devcontainer/            # Docker configuration
│   ├── docker-compose.yml    # PocketBase service
│   └── setup.sh              # Environment setup
└── public/                   # Static assets
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PB_ADMIN_EMAIL` | PocketBase admin email | `admin@example.com` |
| `PB_ADMIN_PASSWORD` | PocketBase admin password | `admin123456` |
| `VITE_PUBLIC_POCKETBASE_URL` | PocketBase API URL (browser) | `http://localhost:8090` |
| `VITE_POCKETBASE_URL` | PocketBase API URL (server) | `http://pocketbase:8090` |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI | Optional |

## 🎯 Features

- **Authentication**: Sign up/sign in with email & password
- **OAuth**: GitHub, Google, Discord (configure in PocketBase Admin)
- **Database**: SQLite with PocketBase collections
- **Admin UI**: Built-in at `/_/` for database management
- **AI Chat**: OpenRouter integration for conversational AI
- **Modern UI**: Clean, accessible interface with shadcn/ui
- **Type Safety**: Full TypeScript support

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

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🚀 Deploy

### Vercel + PocketBase Cloud
1. Deploy TanStack Start to [Vercel](https://vercel.com)
2. Host PocketBase on [PocketHost](https://pockethost.io/) or your own server
3. Update `VITE_PUBLIC_POCKETBASE_URL` in Vercel environment variables

### Self-Hosted
Both TanStack Start and PocketBase can be self-hosted on any VPS or container platform.
