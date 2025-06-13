"use client"

import "../../styles/layout/footer.css"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, PhoneIcon } from "lucide-react"
import { motion } from "framer-motion"

const FooterLogo = ({ size = 60 }) => (
  <Image
    src="/images/tonle-logo.png"
    alt="Tonle Sap Restaurant Logo"
    width={size}
    height={size}
    className="object-contain footer-actual-logo"
  />
)

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="footer-container"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="footer-grid-container">
          <div>
            <Link href="#" className="footer-logo-link" prefetch={false}>
              <div className="footer-logo-frame">
                <FooterLogo size={40} />
              </div>
            </Link>
            <p className="footer-description">Discover the wonders of Southeast Asia's largest freshwater lake.</p>
          </div>
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-link-list">
              <li>
                <Link href="#about" className="footer-link" prefetch={false}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="footer-link" prefetch={false}>
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="#contact" className="footer-link" prefetch={false}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link" prefetch={false}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-link-list">
              <li className="footer-contact-item">
                <Mail />
                <a href="mailto:info@tonlesabjourneys.com" className="footer-link">
                  info@tonlesabjourneys.com
                </a>
              </li>
              <li className="footer-contact-item">
                <PhoneIcon />
                <a href="tel:+85512345678" className="footer-link">
                  +855 12 345 678
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer-heading">Follow Us</h3>
            <div className="footer-social-icons">
              <Link href="#" className="footer-social-icon-link" prefetch={false} aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="footer-social-icon-link" prefetch={false} aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="footer-social-icon-link" prefetch={false} aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Tonle Sab Journeys. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
