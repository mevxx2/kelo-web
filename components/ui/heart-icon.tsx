import { cn } from "@/lib/utils";

/** Small filled heart, shared by the intro overlay and ambient particle fields. */
export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <path d="M12 21s-6.7-4.2-9.3-8.2C1 10 1.5 6.5 4.4 5A5 5 0 0 1 12 7a5 5 0 0 1 7.6-2 5.4 5.4 0 0 1 1.7 7.8C18.7 16.8 12 21 12 21Z" />
    </svg>
  );
}
