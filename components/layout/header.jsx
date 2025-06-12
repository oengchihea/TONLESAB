"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { MenuIcon, CalendarCheck } from "lucide-react"
import { motion } from "framer-motion"
import "../../styles/layout/header.css"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Reservations" },
]

const AnimatedImageLogo = ({ className, size = 70 }) => {
  const logoAnimationVariants = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 1.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      variants={logoAnimationVariants}
      animate="animate"
    >
      <Image
        src="/images/tonle-logo.png"
        alt="Tonle Sap Restaurant Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </motion.div>
  )
}

const DesktopNav = () => (
  <nav className="hidden md:flex items-center gap-4 md:gap-6">
    {navLinks.map((link) => (
      <Link key={link.href} href={link.href} className="header-nav-link" prefetch={false}>
        {link.label}
      </Link>
    ))}
    <Button asChild size="sm" className="ml-4 header-reserve-button">
      <Link href="#contact">
        <CalendarCheck className="mr-2 h-4 w-4" /> Reserve Table
      </Link>
    </Button>
  </nav>
)

const MobileNav = () => (
  <div className="md:hidden flex items-center">
    <Button asChild size="icon" className="mr-2 header-reserve-button-mobile">
      <Link href="#contact" aria-label="Reserve Table">
        <CalendarCheck className="h-5 w-5" />
      </Link>
    </Button>
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="mobile-menu-trigger">
          <MenuIcon className="mobile-menu-icon" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="mobile-sheet-content">
        <div className="grid gap-4 p-4">
          <Link href="#" className="flex items-center justify-center gap-2 mb-4" prefetch={false}>
            <div className="mobile-logo-frame">
              <AnimatedImageLogo size={90} />
            </div>
          </Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="mobile-nav-link" prefetch={false}>
              {link.label}
            </Link>
          ))}
          <Button asChild size="lg" className="mt-4 w-full header-reserve-button">
            <Link href="#contact">
              <CalendarCheck className="mr-2 h-4 w-4" /> Reserve Table
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  </div>
)

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="header-container"
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-2">
        <Link href="#" className="flex items-center" prefetch={false}>
          <div className="logo-frame">
            <AnimatedImageLogo size={70} className="sm:hidden" />
            <AnimatedImageLogo size={85} className="hidden sm:flex" />
          </div>
        </Link>
        <DesktopNav />
        <MobileNav />
      </div>
    </motion.header>
  )
}
