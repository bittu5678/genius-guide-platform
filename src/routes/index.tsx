import { createFileRoute } from "@tanstack/react-router";
import CoachingApp from "@/components/CoachingApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoachingApp — Coaching Management & Online Tests" },
      { name: "description", content: "Manage students, online tests, results, and learning performance with CoachingApp." },
      { property: "og:title", content: "CoachingApp — Coaching Management & Online Tests" },
      { property: "og:description", content: "A modern workspace for coaching institutes and their students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoachingApp,
});
