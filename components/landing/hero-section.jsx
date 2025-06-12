"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import "../../styles/landing/hero-section.css"

// MODIFICATION: Accept props to pass down the data-section-id
export default function HeroSection(props) {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden" {...props}>
      <video
        src="/video/food.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="relative z-20 container mx-auto flex flex-col items-center justify-center h-full text-center px-4 md:px-6 pt-16 sm:pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hero-title"
        >
          Tonle Sab
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="hero-subtitle"
        >
          Experience the breathtaking beauty and vibrant life of Southeast Asia's largest freshwater lake.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10"
        >
          <Button asChild className="hero-discover-button">
            <Link href="#about">
              Discover More <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
