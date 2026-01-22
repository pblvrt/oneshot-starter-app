import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <main className="flex max-w-4xl flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            TanStack Start + PocketBase Starter
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A modern starter template with authentication ready to go
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>TanStack Start</CardTitle>
              <CardDescription>
                Server rendering, streaming, and full-stack React
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built on TanStack Router with Vite and TypeScript
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PocketBase Auth</CardTitle>
              <CardDescription>
                Email, OAuth, and magic links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pre-configured authentication with session management
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui</CardTitle>
              <CardDescription>
                Beautiful, accessible components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Customizable components built with Radix and Tailwind
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
