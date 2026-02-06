import CatalogTeaser from "@/components/CatalogTeaser"
import Footer from "@/components/Footer"
import FullTransparency from "@/components/FullTransparency"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import NorwegianPartners from "@/components/NorwegianPartners"
import ServiceHighlight from "@/components/ServiceHighlight"
import TrimmingGuide from "@/components/TrimmingGuide"
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
        <FullTransparency />
        <NorwegianPartners />
        <CatalogTeaser />
        <TrimmingGuide />
      </main>
      <Footer />
    </div>
  )
}

export default Index
