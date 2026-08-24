import { cn } from "@/lib/utils";

/* Add the live listing URLs here when the App Store and Google Play pages are
   approved. Keeping the unavailable buttons disabled prevents a visitor from
   being sent to an invented or misleading destination in the meantime. */
const STORE_URLS = {
  appStore: "",
  googlePlay: "",
};

type StoreButtonsProps = { className?: string };

export function StoreButtons({ className }: StoreButtonsProps) {
  return <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}><StoreButton store="appStore" eyebrow="Download on the" label="App Store" mark="●" /><StoreButton store="googlePlay" eyebrow="Get it on" label="Google Play" mark="▶" /></div>;
}

function StoreButton({ store, eyebrow, label, mark }: { store: keyof typeof STORE_URLS; eyebrow: string; label: string; mark: string }) {
  const href = STORE_URLS[store];
  const className = "store-button inline-flex min-w-[168px] items-center gap-3 rounded-2xl border border-white/18 bg-white/[0.09] px-4 py-3 text-left text-white shadow-[0_12px_34px_-20px_rgba(4,7,28,.85)] backdrop-blur-md transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-kelo-300/60 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kelo-300 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0";
  const content = <><span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/12 text-base">{mark}</span><span><span className="block text-[10px] font-medium leading-none text-white/55">{eyebrow}</span><span className="mt-1 block text-base font-semibold leading-none tracking-tight">{label}</span></span></>;
  return href ? <a href={href} target="_blank" rel="noreferrer" className={className}>{content}</a> : <button type="button" disabled title={`${label} link will be added soon.`} aria-label={`${label} link coming soon`} className={className}>{content}</button>;
}
