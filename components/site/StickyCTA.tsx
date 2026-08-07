import { CONTACTS } from "@/lib/site";

export default function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-black/10 bg-paper p-3 md:hidden">
      <a
        href={CONTACTS.phoneHref}
        className="press flex-1 rounded-full border border-black/15 py-3 text-center text-sm font-semibold text-ink"
      >
        Позвонить
      </a>
      <a
        href="#lead"
        className="press flex-[1.4] rounded-full bg-brand py-3 text-center text-sm font-semibold text-white"
      >
        Оставить заявку
      </a>
    </div>
  );
}
