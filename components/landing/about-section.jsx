"use client"

import React from "react"
import { motion } from "framer-motion"
import { Waves, Fish, Users } from "lucide-react"
import Marquee from "../ui/marquee" // Assuming this path is correct
import CssRotatingCube from "./css-rotating-cube" // Assuming this path is correct

const features = [
  {
    icon: <Waves className="h-8 w-8" />,
    title: "Unique Ecosystem",
    description: "Home to a diverse range of flora and fauna, adapting to the dramatic seasonal water level changes.",
  },
  {
    icon: <Fish className="h-8 w-8" />,
    title: "Rich Biodiversity",
    description: "A vital fishing ground supporting millions and boasting hundreds of fish species.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Floating Villages",
    description: "Witness the unique lifestyle of communities living in stilted houses and floating homes.",
  },
]

const aboutMarqueeItems = [
  "UNESCO Biosphere Reserve",
  "Critical Natural Resource",
  "Cultural Treasure",
  "Seasonal Wonders",
  "Heart of Cambodia",
]

// MODIFICATION: Accept props to pass down the data-section-id
export default function AboutSection(props) {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    // MODIFICATION: Spread props onto the section element
    <section
      id="about"
      className="relative overflow-hidden pt-0 pb-24 md:pb-32 before:content-[''] before:absolute before:inset-0 before:bg-cover before:bg-center before:bg-fixed before:z-0 after:content-[''] after:absolute after:inset-0 after:z-[1] after:bg-gradient-to-b after:from-black/50 after:via-black/30 after:to-black/50"
      style={{ "--bg-image-url": "url('/images/about.jpg')" }}
      {...props} // Apply data-section-id here
    >
      <style jsx global>{`
        #about::before {
          background-image: var(--bg-image-url);
        }
      `}</style>

      {/* MOVED MARQUEE BLOCK HERE */}
      <motion.div
        className="w-full relative z-[2] mt-0 mb-8 sm:mb-10" // Adjusted margins for new position
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <Marquee items={aboutMarqueeItems} speed={30} />
      </motion.div>

      {/* TITLE/SUBTITLE BLOCK */}
      <motion.div
        className="container relative z-[2] mx-auto px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div variants={itemVariants} className="text-center">
          {" "}
          {/* Removed pt-12 md:pt-16 as marquee is now above */}
          <h2
            className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-amber-400"
            style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.6), 0 0 10px rgba(251, 191, 36, 0.3)" }}
          >
            The Heartbeat of Cambodia
          </h2>
          <p
            className="mt-4 max-w-xl md:max-w-3xl mx-auto text-base sm:text-lg text-gray-100"
            style={{ textShadow: "1px 1px 6px rgba(0, 0, 0, 0.9)" }}
          >
            Tonle Sap is more than just a lake; it's a UNESCO Biosphere Reserve, a critical natural resource, and a
            cultural treasure.
          </p>
        </motion.div>
      </motion.div>

      {/* FEATURES/CUBE BLOCK (remains after title/subtitle) */}
      {/* Add some top margin to this block if needed after moving marquee */}
      <motion.div
        className="container relative z-[2] mx-auto px-4 md:px-6 mt-10 sm:mt-14" // Added margin-top
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          <motion.div
            className="md:col-span-2 w-full h-[300px] sm:h-[400px] flex items-center justify-center"
            variants={itemVariants}
          >
            <CssRotatingCube />
          </motion.div>

          <div className="md:col-span-3 space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group flex items-center gap-4 md:gap-6 p-4 rounded-lg transition-all duration-300"
                variants={itemVariants}
              >
                <div className="flex-shrink-0 p-3.5 bg-white/10 rounded-full text-white border border-white/20 backdrop-blur-sm transition-all duration-300 ease-in-out group-hover:bg-white/20 group-hover:scale-110">
                  {React.cloneElement(feature.icon, { className: "h-8 w-8 text-amber-400" })}
                </div>
                <div className="flex-grow">
                  <h3
                    className="font-playfair text-xl sm:text-2xl font-semibold text-amber-400"
                    style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5), 0 0 8px rgba(251, 191, 36, 0.25)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="mt-1 text-sm text-gray-200 leading-relaxed"
                    style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
