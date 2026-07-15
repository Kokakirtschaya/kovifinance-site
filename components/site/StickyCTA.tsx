import { CONTACTS } from "@/lib/site";

export default function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-black/10 bg-paper/95 p-3 backdrop-blur md:hidden">
      <a
        href={CONTACTS.phoneHref}
        className="flex-1 rounded-full border border-black/15 py-3 text-center text-sm font-semibold text-ink"
      >
        Позвонить
      </a>
      <a
        href="#lead"
        className="flex-[1.4] rounded-full bg-brand py-3 text-center text-sm font-semibold text-white"
      >
        Оставить заявку
      </a>
    </div>
  );
}
