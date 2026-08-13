type ClassValue = string | number | null | undefined | false;

/**
 * Minimal class joiner. Deliberately not clsx + tailwind-merge — this project
 * has no conflicting-class problem to solve, and keeping the dependency list to
 * four packages keeps installs fast.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
