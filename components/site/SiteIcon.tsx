import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  mortgage: <><path d="M4 21V7l8-4 8 4v14M2 21h20M9 21v-5h6v5M8 8h1m6 0h1M8 12h1m6 0h1" /></>,
  credit: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a22 22 0 0 0 18 0M12 11v4" /></>,
  guarantee: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  factoring: <><path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4 4-4-4 4-4" /></>,
  leasing: <><path d="M3 16V7h11v9H3Zm11-6h4l3 4v2h-7M3 16v2h2m5 0h5m5 0h1v-2" /><circle cx="7.5" cy="18" r="2.5" /><circle cx="17.5" cy="18" r="2.5" /></>,
  project: <><path d="M3 21V11h8v10M11 21V3h10v18M1 21h22M6 15h2m-2 3h2m7-11h2m-2 4h2m-2 4h2m-2 3h2" /></>,
  result: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  banks: <><path d="m3 8 9-5 9 5H3Zm2 3v6m7-6v6m7-6v6M3 21h18M4 18h16" /></>,
  cases: <><path d="M8 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" /><rect x="8" y="2" width="8" height="5" rx="1" /><path d="m8 14 3 3 5-6" /></>,
  manager: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  crm: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 22h8m-4-4v4M3 9h18M9 9v9" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

export type SiteIconName = keyof typeof paths;

export default function SiteIcon({ name, className = "size-6" }: { name: SiteIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {paths[name]}
    </svg>
  );
}
