import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QualityPromise from "@/components/QualityPromise";
import TechnicalDetails from "@/components/TechnicalDetails";
import CatalogTeaser from "@/components/CatalogTeaser";
import TrimmingGuide from "@/components/TrimmingGuide";
import Footer from "@/components/Footer";

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
  );
};

export default Index;