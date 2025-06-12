"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react" // Added useRef, useState
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { MenuIcon, CalendarCheck } from "lucide-react"
// MODIFICATION: Removed framer-motion as it's not used for the static logo or header animation here
// import { motion } from "framer-motion"
import "../../styles/layout/header.css"

// Define the color themes for each section
// Ensure these hex codes are what you want for each section
const sectionThemes = {
  hero: {
    // Current Orange theme
    "--header-bg": "#f0ad4e",
    "--header-border": "#1a202c",
    "--header-text": "#2d3748",
    "--header-text-hover": "#1a202c",
    "--header-btn-border": "#d97706",
    "--header-bg-hover": "#e69500",
    "--header-btn-border-hover": "#c76b00",
    "--header-hover-overlay": "rgba(0, 0, 0, 0.1)",
  },
  about: {
    // Dark Gray/Brownish theme
    "--header-bg": "#4a5568", // Slate-600
    "--header-border": "#1a202c", // Gray-900
    "--header-text": "#f7fafc", // Gray-100
    "--header-text-hover": "#e2e8f0", // Gray-200
    "--header-btn-border": "#718096", // Slate-500
    "--header-bg-hover": "#2d3748", // Slate-700
    "--header-btn-border-hover": "#1a202c", // Slate-800
    "--header-hover-overlay": "rgba(255, 255, 255, 0.1)",
  },
  menu: {
    // Light Gray theme
    "--header-bg": "#f7fafc", // Gray-100
    "--header-border": "#e2e8f0", // Gray-200
    "--header-text": "#2d3748", // Gray-800
    "--header-text-hover": "#1a202c", // Gray-900
    "--header-btn-border": "#cbd5e0", // Gray-400
    "--header-bg-hover": "#e2e8f0", // Gray-200
    "--header-btn-border-hover": "#a0aec0", // Gray-500
    "--header-hover-overlay": "rgba(0, 0, 0, 0.05)",
  },
  gallery: {
    // Deep Teal theme
    "--header-bg": "#0d9488", // Teal-600
    "--header-border": "#042f2e", // Teal-950
    "--header-text": "#f0fdfa", // Teal-50
    "--header-text-hover": "#ccfbf1", // Teal-100
    "--header-btn-border": "#14b8a6", // Teal-500
    "--header-bg-hover": "#0f766e", // Teal-700
    "--header-btn-border-hover": "#134e4a", // Teal-900
    "--header-hover-overlay": "rgba(255, 255, 255, 0.1)",
  },
  testimonials: {
    // White theme
    "--header-bg": "#ffffff",
    "--header-border": "#e2e8f0", // Gray-200
    "--header-text": "#2d3748", // Gray-800
    "--header-text-hover": "#1a202c", // Gray-900
    "--header-btn-border": "#cbd5e0", // Gray-400
    "--header-bg-hover": "#f1f5f9", // Gray-100 (slightly off-white)
    "--header-btn-border-hover": "#a0aec0", // Gray-500
    "--header-hover-overlay": "rgba(243, 243, 243, 0.05)",
  },
  contact: {
    // Matching the hero section's "dark yellow" / golden theme
    "--header-bg": "#f0ad4e", // Rich golden yellow (similar to amber-400/500)
    "--header-border": "#1a202c", // Very dark gray/black top border
    "--header-text": "#2d3748", // Dark gray text
    "--header-text-hover": "#1a202c", // Even darker gray text on hover
    "--header-btn-border": "#d97706", // Darker amber button border (amber-600)
    "--header-bg-hover": "#e69500", // Slightly darker yellow for button bg hover
    "--header-btn-border-hover": "#c76b00", // Even darker amber for button border hover (amber-700)
    "--header-hover-overlay": "rgba(0, 0, 0, 0.1)", // Overlay for mobile menu icon hover
  },
  scrolled: {
    // White theme for scrolled state
    "--header-bg": "#ffffff",
    "--header-border": "#e2e8f0", // Gray-200
    "--header-text": "#2d3748", // Gray-800
    "--header-text-hover": "#1a202c", // Gray-900
    "--header-btn-border": "#cbd5e0", // Gray-400
    "--header-bg-hover": "#f1f5f9", // Gray-100 (slightly off-white)
    "--header-btn-border-hover": "#a0aec0", // Gray-500
    "--header-hover-overlay": "rgba(0, 0, 0, 0.05)",
  },
}

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Reservations" },
]

// MODIFICATION: Static logo, framer-motion removed from this component
const StaticImageLogo = ({ className, size = 60 }) => {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Image
        src="/images/tonle-logo.png"
        alt="Tonle Sap Restaurant Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  )
}

const DesktopNav = () => (
  <nav className="hidden md:flex items-center gap-3 md:gap-5">
    {navLinks.map((link) => (
      <Link key={link.href} href={link.href} className="header-nav-link" prefetch={false}>
        {link.label}
      </Link>
    ))}
    <Link href="#contact" className="ml-3">
      <Button size="sm" className="header-reserve-button">
        <CalendarCheck className="mr-2 h-3 w-3" />
        {" Reserve Table"}
      </Button>
    </Link>
  </nav>
)

const MobileNav = () => (
  <div className="md:hidden flex items-center">
    <Link href="#contact" aria-label="Reserve Table" className="mr-2">
      <Button size="sm" className="header-reserve-button-mobile">
        <CalendarCheck className="h-4 w-4" />
      </Button>
    </Link>
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="mobile-menu-trigger w-8 h-8">
          <MenuIcon className="mobile-menu-icon" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="mobile-sheet-content">
        <div className="grid gap-4 p-4">
          <Link href="#" className="flex items-center justify-center gap-2 mb-4" prefetch={false}>
            <div className="mobile-logo-frame">
              <StaticImageLogo size={80} />
            </div>
          </Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="mobile-nav-link" prefetch={false}>
              {link.label}
            </Link>
          ))}
          <Link href="#contact" className="mt-4 w-full">
            <Button size="lg" className="w-full header-reserve-button">
              <CalendarCheck className="mr-2 h-4 w-4" />
              {" Reserve Table"}
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  </div>
)

export default function Header() {
  const headerRef = useRef(null) // Ref for the header element
  const [hasScrolled, setHasScrolled] = useState(false)

  // Add this new useEffect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Change to white background after scrolling 100px
      if (window.scrollY > 100) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll("[data-section-id]")
    const headerElement = headerRef.current

    if (!sections.length || !headerElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Only apply section themes if we haven't scrolled past the threshold
        if (!hasScrolled) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionId = entry.target.getAttribute("data-section-id")
              const theme = sectionId && sectionThemes[sectionId] ? sectionThemes[sectionId] : sectionThemes.hero // Fallback to hero theme

              Object.keys(theme).forEach((key) => {
                headerElement.style.setProperty(key, theme[key])
              })
            }
          })
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px", // Trigger when the section is in the middle of the viewport
        threshold: 0, // Trigger as soon as any part of the target is visible based on rootMargin
      },
    )

    sections.forEach((section) => observer.observe(section))

    // Set initial theme based on scroll position or first section
    if (hasScrolled) {
      // Apply white scrolled theme
      Object.keys(sectionThemes.scrolled).forEach((key) => {
        headerElement.style.setProperty(key, sectionThemes.scrolled[key])
      })
    } else {
      // Apply theme from first section
      const firstSectionId = sections[0]?.getAttribute("data-section-id")
      const initialTheme =
        firstSectionId && sectionThemes[firstSectionId] ? sectionThemes[firstSectionId] : sectionThemes.hero
      Object.keys(initialTheme).forEach((key) => {
        headerElement.style.setProperty(key, initialTheme[key])
      })
    }

    return () => sections.forEach((section) => observer.unobserve(section))
  }, [hasScrolled]) // Added hasScrolled as a dependency

  return (
    // MODIFICATION: Removed framer-motion from header, using ref instead of style prop for direct DOM manipulation
    <header
      ref={headerRef} // Added ref
      className="header-container"
      // Initial animation can be handled by CSS if desired, or re-add framer-motion if specifically for initial load.
      // For simplicity, initial animation is removed here.
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center" prefetch={false}>
          <div className="logo-frame">
            <StaticImageLogo size={50} className="sm:hidden" />
            <StaticImageLogo size={60} className="hidden sm:flex" />
          </div>
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <DesktopNav />
        </div>

        <MobileNav />
      </div>
    </header>
  )
}
