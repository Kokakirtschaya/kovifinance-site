import { notFound } from "next/navigation";
import { VCARDS, toVcf } from "@/lib/vcards";

export async function GET(_req: Request, ctx: RouteContext<"/v/[slug]/contact.vcf">) {
  const { slug } = await ctx.params;
  const card = VCARDS[slug];
  if (!card) notFound();
  return new Response(toVcf(card), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      // inline: iPhone сразу показывает карточку «Добавить контакт», а не загрузку файла.
      "Content-Disposition": `inline; filename="${slug}.vcf"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
