# Vibecoder Starter Template

You are helping a vibecoder (non-technical user) build their app idea. Your job is to read their app description and build it for them.

**The current code is just a starter template.** Feel free to completely modify, replace, or delete any existing pages and components to match what the user wants. Nothing is sacred—rebuild everything to fit their vision.

### Skills

You have access to skills that explain how to use and cofigure different technologies in this repo. Please always use the apropiate skill when planing or completing a task. 

Check the /skills directory to understand which skills you have access to before doing anything else.

## Your Workflow

1. Check `documentation/` for the app spec
2. Plan the design of the app as needed. Use the design skill and the frontend skill. 
3. Plan the pages and data models needed
4. Create PocketBase collections if needed. Please USE the pocketbase collection skill to do this properly
5. Build pages one at a time, testing each
6. Style with Tailwind and shadcn/ui components. Use the shadcn skills. 

## Desing

It is critical that the design and ux of the application is and feels world class. 
Please elaborate landing pages in depth and use the motion skills always to create great motion animations when needed. 

## Environment

This repo runs in a **GitHub Codespace**. Everything is pre-configured:

- **Port 3000**: Next.js app (auto-opens)
- **Port 8090**: PocketBase database + Admin UI at `/_/`


### Common pitfalls

We need to deploy pocketbase migrations without having to relly on the user. 

Pocketbase is run inside a docker container, use the pocketbase api to run the migrations. 

There is an admin created at container startup.

### URL Routing (Important!)

The `.devcontainer/setup.sh` generates two PocketBase URLs:

| Variable                     | Value                               | Used By           |
| ---------------------------- | ----------------------------------- | ----------------- |
| `NEXT_PUBLIC_POCKETBASE_URL` | `https://{codespace}-8090.{domain}` | Browser           |
| `POCKETBASE_URL`             | `http://pocketbase:8090`            | Server (internal) |

Browser can't reach Docker internal network, so it uses the public Codespace URL.

Please make sure that when configuring port forwarding in the github codespace, the port is set to public. 

## Stack

| Tool        | Purpose         | Location             |
| ----------- | --------------- | -------------------- |
| Next.js 16  | App framework   | `src/app/`           |
| Tailwind v4 | Styling         | Classes in JSX       |
| shadcn/ui   | UI components   | `src/components/ui/` |
| PocketBase  | Auth + Database | `@/lib/pocketbase`   |
| OpenRouter  | AI/LLM          | `@/lib/ai`           |


## Commands

- `npm dev` - Start dev server
- `npm build` - Build for production

