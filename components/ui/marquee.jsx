"use client"

import { motion } from "framer-motion"
import "../../styles/ui/marquee.css"

export default function Marquee({ items, speed = 40, direction = "left", pauseOnHover = true, className = "" }) {
  if (!items || items.length === 0) {
    return null
  }

  const marqueeVariants = {
    animate: {
      x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: items.length * (100 / speed),
          ease: "linear",
        },
      },
    },
  }

  const extendedItems = [...items, ...items]

  return (
    <div className={`marquee-container ${className} ${pauseOnHover ? "pause-on-hover" : ""}`}>
      <motion.div className="marquee-content" variants={marqueeVariants} animate="animate">
        {extendedItems.map((item, index) => (
          <span key={index} className="marquee-item">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
