import CatalogTeaser from "@/components/catalog-teaser"
import Footer from "@/components/footer"
import FullTransparency from "@/components/full-transparency"
import Header from "@/components/header"
import Hero from "@/components/hero"
import HowItWorks from "@/components/how-it-works"
import NorwegianPartners from "@/components/norwegian-partners"
import ServiceHighlight from "@/components/service-highlight"
import TrimmingGuide from "@/components/trimming-guide"
import { useEffect } from "react"

const Index = () => {
  useEffect(() => {
    document.title = "Nordic Seafood | Norwegian Salmon in Ethiopia"
    const description =
      "Nordic Seafood delivers premium Norwegian salmon to Ethiopia with verified cold-chain logistics, traceability, and chef-ready cuts."
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", description)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main aria-label="Nordic Seafood landing">
        <Hero />
        <ServiceHighlight />
        <HowItWorks />
        <CatalogTeaser />
        <FullTransparency />
        <NorwegianPartners />
        <TrimmingGuide />
      </main>
      <Footer />
    </div>
  )
}

export default Index
