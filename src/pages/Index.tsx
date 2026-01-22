import CatalogTeaser from "@/components/CatalogTeaser"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import QualityPromise from "@/components/QualityPromise"
import TechnicalDetails from "@/components/TechnicalDetails"
import TrimmingGuide from "@/components/TrimmingGuide"

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <QualityPromise />
        <TechnicalDetails />
        <CatalogTeaser />
        <TrimmingGuide />
      </main>
      <Footer />
    </div>
  )
}

export default Index
