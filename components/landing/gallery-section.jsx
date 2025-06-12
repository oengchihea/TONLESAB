"use client"

import { useState, useRef } from "react"
import "../../styles/landing/gallery-section.css"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

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
  {
    category: "Authentic Ambiance",
    slug: "authentic-ambiance",
    items: [
      {
        id: "aa1",
        title: "Warm & Welcoming",
        description: "Traditional Khmer hospitality with local art and silk tapestries.",
        location: "Main Dining Hall",
        established: "Interior Design 2015",
        featuredImage: "/images/cocktail.jpg",
        thumbnails: ["/images/come.jpg", "/images/visit.jpg"],
      },
    ],
  },
]

export default function GallerySection() {
  const [activeCategorySlug, setActiveCategorySlug] = useState(galleryData[0].slug)
  const activeCategoryData = galleryData.find((cat) => cat.slug === activeCategorySlug)

  const activeCategoryItems = activeCategoryData?.items || []
  const showHorizontalScroll = activeCategoryItems.length > 1

  const galleryScrollContainerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: galleryScrollContainerRef,
    offset: ["start start", "end end"],
    disabled: !showHorizontalScroll,
  })

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    showHorizontalScroll ? ["0%", `-${(activeCategoryItems.length - 1) * 100}%`] : ["0%", "0%"],
  )

  const sectionEntryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  }

  const GalleryItemContent = ({ item, index, priority = false }) => (
    <div className="gallery-item-display">
      <div className="gallery-item-text-content">
        <h3 className="gallery-item-title">{item.title.toUpperCase()}</h3>
        <p className="gallery-item-description">{item.description}</p>
        <div className="gallery-item-meta">
          <div>
            <span className="gallery-item-meta-label">Location</span>
            <span className="gallery-item-meta-value">{item.location}</span>
          </div>
          <div>
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
              whileHover={{ scale: 1.1, borderColor: "var(--amber-500)" }}
              transition={{ type: "spring", stiffness: 300 }}
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
      <div className="gallery-faded-number-horizontal">{`0${index + 1}`}</div>
    </div>
  )

  return (
    <motion.section
      id="gallery-section-main"
      className="gallery-section-wrapper"
      variants={sectionEntryVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
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
              className={`gallery-filter-button ${activeCategorySlug === cat.slug ? "gallery-filter-button-active" : ""}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {cat.category.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {showHorizontalScroll ? (
        <div
          ref={galleryScrollContainerRef}
          className="gallery-horizontal-scroll-container"
          style={{ height: `${activeCategoryItems.length * 100}vh` }}
        >
          <div className="gallery-sticky-viewport">
            <motion.div
              className="gallery-items-strip"
              style={{
                x,
                width: `${activeCategoryItems.length * 100}%`,
              }}
            >
              {activeCategoryItems.map((item, index) => (
                <div key={`${item.id}-${activeCategorySlug}`} className="gallery-single-item-slide">
                  <GalleryItemContent item={item} index={index} priority={index === 0} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="gallery-static-item-wrapper">
          {activeCategoryItems.length === 1 ? (
            <div className="gallery-single-item-slide">
              <GalleryItemContent item={activeCategoryItems[0]} index={0} priority />
            </div>
          ) : (
            <div className="gallery-single-item-slide">
              <p className="text-center text-xl text-[var(--light-text-color)]">No items in this category.</p>
            </div>
          )}
        </div>
      )}
    </motion.section>
  )
}
