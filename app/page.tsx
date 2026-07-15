import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import Services from "@/components/site/Services";
import Cases from "@/components/site/Cases";
import Calculator from "@/components/site/Calculator";
import Process from "@/components/site/Process";
import Agents from "@/components/site/Agents";
import Team from "@/components/site/Team";
import FAQ from "@/components/site/FAQ";
import LeadForm from "@/components/site/LeadForm";
import Footer from "@/components/site/Footer";
import StickyCTA from "@/components/site/StickyCTA";
import { CONTACTS } from "@/lib/site";

const schema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "KOVI Finance",
  url: "https://kovifinance.ru",
  logo: "https://kovifinance.ru/brand/logo-primary.svg",
  image: "https://kovifinance.ru/brand/logo-primary.svg",
  telephone: CONTACTS.phone,
  email: CONTACTS.email,
  description:
    "Независимый брокер: помогаем бизнесу получить кредиты, банковские гарантии, факторинг и лизинг на лучших условиях.",
  areaServed: "RU",
  sameAs: [CONTACTS.telegram, CONTACTS.youtube, CONTACTS.instagram],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Services />
        <Cases />
        <Calculator />
        <Process />
        <Agents />
        <Team />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
