"use client"

import { useState, useRef, useEffect } from "react"
import "../../styles/landing/gallery-section.css"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

// Create a custom event that will be triggered when scrolling past the gallery section
const triggerNavbarChange = () => {
  const event = new CustomEvent("navbarColorChange", { detail: { scrolled: true } })
  window.dispatchEvent(event)
}

const galleryData = [
  {
    category: "Khmer Cuisine",
    slug: "khmer-cuisine",
    items: [
      {
        id: "kc1",
        title: "Fish Amok",
        description:
          "Steamed fish curry with kroeung (lemongrass, galangal, turmeric paste) and coconut milk, traditionally served in a banana leaf.",
        location: "Riverside Restaurant",
        established: "Generational Recipe",
        featuredImage: "/images/fish1.jpg",
        thumbnails: ["/images/fish2.jpg", "/images/fish3.jpg", "/images/fish4.jpg", "/images/fish5.jpg"],
      },
      {
        id: "kc2",
        title: "Beef Lok Lak",
        description:
          "Stir-fried marinated beef cubes served with fresh lettuce, tomatoes, cucumbers, onions, and a tangy lime-pepper dipping sauce.",
        location: "Street Food Stall Favorite",
        established: "Since 1990s",
        featuredImage: "/images/beef1.jpg",
        thumbnails: ["/images/beef2.jpg", "/images/beef3.jpg", "/images/beef4.jpg", "/images/beef5.jpg"],
      },
      {
        id: "kc3",
        title: "Nom Banh Chok",
        description:
          "Freshly made rice noodles topped with a fragrant, greenish fish-based gravy, garnished with crisp raw vegetables like banana flower, cucumber, and bean sprouts.",
        location: "Local Market Delight",
        established: "Daily Fresh",
        featuredImage: "/images/nom1.jpg",
        thumbnails: ["/images/nom2.jpg", "/images/nom 3.jpg", "/images/nom4.jpg", "/images/nom5.jpg"],
      },
      {
        id: "kc4",
        title: "Prahok Ktis",
        description:
          "A rich and savory dip made from fermented fish (prahok), minced pork belly, coconut milk, kroeung, and chili, typically served with fresh crunchy vegetables.",
        location: "Family Kitchen Secret",
        established: "Traditional Special",
        featuredImage: "/images/prorhok1.jpg",
        thumbnails: ["/images/prorhok2.jpg", "/images/prorhok3.jpg", "/images/prorhok4.jpg", "/images/prorhok5.jpg"],
      },
    ],
  },
]

export default function GallerySection({ ...props }) {
  const [activeCategorySlug, setActiveCategorySlug] = useState(galleryData[0].slug)
  const activeCategoryData = galleryData.find((cat) => cat.slug === activeCategorySlug)
  const sectionRef = useRef(null)

  const activeCategoryItems = activeCategoryData?.items || []
  const showHorizontalScroll = activeCategoryItems.length > 1

  const galleryScrollContainerRef = useRef(null)
  const PIN_PAGES = 4
  const { scrollYProgress } = useScroll({
    target: galleryScrollContainerRef,
    offset: ["start start", "end start"],
    disabled: !showHorizontalScroll,
  })

  // Add scroll event listener to check when we've scrolled past the gallery section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      // If the top of the gallery section is above the viewport, trigger navbar change
      if (rect.top <= 0) {
        triggerNavbarChange()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    showHorizontalScroll ? ["0%", `-${(PIN_PAGES - 1) * 100}%`] : ["0%", "0%"],
  )

  const sectionEntryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const GalleryItemContent = ({ item, index, priority = false }) => (
    <div className="gallery-item-display">
      <div className="gallery-item-text-content">
        <h3 className="gallery-item-title">{item.title.toUpperCase()}</h3>
        <p className="gallery-item-description">{item.description}</p>
        <div className="gallery-item-meta">
          <div className="gallery-meta-item">
            <span className="gallery-item-meta-label">Location</span>
            <span className="gallery-item-meta-value">{item.location}</span>
          </div>
          <div className="gallery-meta-item">
            <span className="gallery-item-meta-label">Established</span>
            <span className="gallery-item-meta-value">{item.established}</span>
          </div>
        </div>
      </div>
      <div className="gallery-featured-image-wrapper">
        <Image
          src={item.featuredImage || "/placeholder.svg?width=800&height=600&query=Featured+Gallery+Image"}
          alt={item.title}
          width={800}
          height={600}
          className="gallery-featured-image"
          priority={priority}
        />
      </div>
      <div className="gallery-thumbnails-wrapper">
        <div className="gallery-thumbnail-grid">
          {item.thumbnails.map((thumbUrl, thumbIndex) => (
            <motion.div
              key={thumbIndex}
              className="gallery-thumbnail-container"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={thumbUrl || "/placeholder.svg?width=150&height=150&query=Gallery+Thumbnail"}
                alt={`${item.title} thumbnail ${thumbIndex + 1}`}
                width={150}
                height={150}
                className="gallery-thumbnail"
              />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="gallery-faded-number">{`0${index + 1}`}</div>
    </div>
  )

  return (
    <motion.section
      id="gallery"
      ref={sectionRef}
      {...props}
      className="gallery-section-wrapper"
      variants={sectionEntryVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="gallery-header">
        <div className="gallery-title-container">
          <span className="gallery-title-our">OUR</span>
          <span className="gallery-title-gallery">GALLERY</span>
        </div>

        <div className="gallery-filter-tabs-container">
          <div className="gallery-filter-tabs">
            {galleryData.map((cat) => (
              <motion.button
                key={cat.slug}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`gallery-filter-button ${activeCategorySlug === cat.slug ? "active" : ""}`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {cat.category.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div ref={galleryScrollContainerRef} className="gallery-horizontal-scroll-container" style={{ height: "400vh" }}>
        <div className="gallery-sticky-viewport">
          <motion.div
            className="gallery-items-strip"
            style={{
              x,
              width: `${activeCategoryItems.length * 35}%`,
            }}
          >
            {activeCategoryItems.length >= 4 ? (
              activeCategoryItems.slice(0, 4).map((item, index) => (
                <div key={item.id} className="gallery-single-item-slide">
                  <GalleryItemContent item={item} index={index} priority={index === 0} />
                </div>
              ))
            ) : (
              <div className="gallery-single-item-slide">
                <p className="gallery-empty-message">Not enough items to display the gallery.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
