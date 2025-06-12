import Header from "../components/layout/header"
import HeroSection from "../components/landing/hero-section"
import AboutSection from "../components/landing/about-section"
import MenuSection from "../components/landing/menu-section"
import GallerySection from "../components/landing/gallery-section"
import TestimonialsSection from "../components/landing/testimonials-section"
import ContactSection from "../components/landing/contact-section"
import Footer from "../components/layout/footer"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
