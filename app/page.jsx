// This is your HomePage component
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
        {/* MODIFICATION: Ensured data-section-id is passed to all sections */}
        <HeroSection data-section-id="hero" />
        <AboutSection data-section-id="about" />
        <MenuSection data-section-id="menu" />
        <GallerySection data-section-id="gallery" />
        <TestimonialsSection data-section-id="testimonials" />
        <ContactSection data-section-id="contact" />
      </main>
      <Footer />
    </div>
  )
}
