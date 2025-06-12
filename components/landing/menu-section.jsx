"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { X } from "lucide-react"

const menuData = {
  appetizers: [
    {
      id: "app1",
      name: "Fresh Spring Rolls (Nime Chow)",
      description:
        "Delicate rice paper rolls filled with shrimp, fresh herbs, and rice vermicelli, served with a rich peanut dipping sauce.",
      price: "$7.00",
      image: "/images/springroll.jpg",
    },
    {
      id: "app2",
      name: "Green Mango Salad (Nhoam Svay)",
      description:
        "A refreshing salad of shredded green mango, dried shrimp, roasted peanuts, and aromatic herbs, tossed in a tangy lime dressing.",
      price: "$8.00",
      image: "/images/green.jpg",
    },
    {
      id: "app3",
      name: "Crispy Rice Cakes with Natang Dip",
      description:
        "Crunchy fried rice cakes served with a savory and creamy pork and coconut dip, lightly spiced with Khmer herbs.",
      price: "$8.50",
      image: "/images/crispy.jpg",
    },
  ],
  mainCourses: [
    {
      id: "main1",
      name: "Fish Amok (Amok Trey)",
      description:
        "A signature Khmer dish. Tender fish fillets steamed in a creamy coconut curry, infused with kroeung paste and wrapped in banana leaves.",
      price: "$15.00",
      image: "/images/amok.png",
    },
    {
      id: "main2",
      name: "Beef Lok Lak",
      description:
        "Succulent stir-fried beef cubes marinated in a savory sauce, served on a bed of fresh lettuce, tomatoes, and onions with a zesty lime-pepper dip.",
      price: "$16.00",
      image: "/images/beef.jpg",
    },
    {
      id: "main3",
      name: "Khmer Red Curry (Kari Sach Moan)",
      description:
        "A fragrant and milder red curry with tender chicken pieces, sweet potatoes, green beans, and bamboo shoots, simmered in rich coconut milk.",
      price: "$14.00",
      image: "/images/khmer red.jpg",
    },
  ],
  desserts: [
    {
      id: "des1",
      name: "Pumpkin Custard (Sankhya Lapov)",
      description:
        "A delightful dessert featuring a whole pumpkin filled with a smooth, sweet coconut custard, steamed to perfection.",
      price: "$9.00",
      image: "/images/lapov.jpg",
    },
    {
      id: "des2",
      name: "Banana Tapioca Pudding (Chek Khtis)",
      description:
        "Sweet and creamy tapioca pudding with ripe bananas and rich coconut milk, a comforting classic Khmer dessert.",
      price: "$6.50",
      image: "/images/banana.jpg",
    },
    {
      id: "des3",
      name: "Sticky Rice with Mango",
      description:
        "Sweet glutinous rice steamed with coconut milk, served with fresh, ripe mango slices and a drizzle of coconut cream.",
      price: "$9.50",
      image: "/images/mango.jpg",
    },
  ],
}

// Flatten all items and ensure they have unique IDs for keys and layout animations
const allItems = [...menuData.appetizers, ...menuData.mainCourses, ...menuData.desserts].map((item, index) => ({
  ...item,
  uniqueId: item.id || `item-${index}`,
}))

const bannerItems = [...allItems]

const InfiniteBanner = ({ items, direction, onItemClick, isPaused }) => {
  const bannerRef = useRef(null)
  const duplicatedItems = [...items, ...items]

  const bannerVariants = {
    animate: {
      x: direction === "left" ? "-100%" : "0%",
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: items.length * 5,
          ease: "linear",
        },
      },
    },
    paused: {
      x: direction === "left" ? "-100%" : "0%",
      transition: {
        duration: 0,
      },
    },
  }

  return (
    <div className="w-full overflow-hidden py-2">
      <motion.div
        ref={bannerRef}
        className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6"
        variants={bannerVariants}
        animate={isPaused ? "paused" : "animate"}
      >
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={`${item.uniqueId}-${index}`}
            onClick={() => onItemClick(item)}
            className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0 cursor-pointer rounded-lg shadow-lg overflow-hidden border-2 sm:border-4 border-amber-100/80 hover:border-amber-300 transition-colors duration-200"
            style={{
              transform: `rotate(${index % 2 === 0 ? 2 : -2}deg)`,
            }}
            whileHover={{
              y: -8,
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(245, 158, 11, 0.3)",
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.1 },
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <h4 className="absolute bottom-1 sm:bottom-2 left-2 sm:left-3 font-playfair text-xs sm:text-base md:text-lg text-white font-semibold drop-shadow-md p-1 bg-black/20 rounded">
              {item.name}
            </h4>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

const FoodGallerySandbox = () => {
  const [selectedItem, setSelectedItem] = useState(null)

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  return (
    <>
      <div className="relative w-full h-[200px] xs:h-[220px] sm:h-[250px] md:h-[300px] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-3 md:p-4 my-6 sm:my-8 md:my-10 lg:my-12 overflow-hidden border border-amber-500/40">
        <InfiniteBanner items={bannerItems} direction="left" onItemClick={handleItemClick} isPaused={false} />
        <p className="text-center text-xs sm:text-sm text-amber-200/80 mt-1 sm:mt-2 md:mt-3 px-2">
          Click on any dish to see more details!
        </p>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            onClick={handleCloseModal}
          >
            <motion.div
              key="modal-content"
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md h-auto max-h-[90vh] flex flex-col bg-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-amber-400/60"
              initial={{ 
                opacity: 0, 
                scale: 0.92,
                y: 40
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.92,
                y: 40
              }}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 300,
                duration: 0.25
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container with 3:2 aspect ratio */}
              <div className="w-full aspect-[3/2] bg-black/10 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details Container, scrollable if content overflows */}
              <div className="w-full flex-1 overflow-y-auto p-3 sm:p-4 gap-1 flex flex-col">
                <h4 className="font-playfair text-base sm:text-lg font-bold text-amber-300 leading-tight mb-1">
                  {selectedItem.name}
                </h4>
                <p className="text-sm sm:text-base font-semibold text-amber-400 mb-1">
                  {selectedItem.price}
                </p>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const GalleryItemContent = ({ item, index, priority = false }) => (
  <div className="gallery-item-display">
    <div className="gallery-item-text-content">
      <h3 className="gallery-item-title">{item.name?.toUpperCase()}</h3>
      <p className="gallery-item-description">{item.description}</p>
      <div className="gallery-item-meta">
        <div>
          <span className="gallery-item-meta-label">Price</span>
          <span className="gallery-item-meta-value">{item.price}</span>
        </div>
      </div>
    </div>
    <div className="gallery-featured-image-wrapper">
      <img
        src={item.image}
        alt={item.name}
        width={800}
        height={600}
        className="gallery-featured-image"
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  </div>
)

export default function MenuSection(props) {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const itemCardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  }

  const categoryTitleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "circOut" } },
  }

  const galleryScrollContainerRef = useRef(null)
  const x = useRef(0)

  const activeCategoryItems = allItems.filter((item) => item.category === props.category)

  return (
    <section
      id="menu"
      className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/menu.jpg')" }}
      {...props}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <motion.div
        className="container relative z-10 mx-auto px-3 sm:px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
      >
        <FoodGallerySandbox />

        {Object.entries(menuData).map(([category, items]) => (
          <div key={category} className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <motion.h3
              className="font-playfair text-xl sm:text-2xl md:text-3xl font-semibold text-amber-300 mt-6 sm:mt-8 md:mt-10 mb-4 sm:mb-6 md:mb-8 border-b-2 border-amber-500/50 pb-2 sm:pb-3"
              style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}
              variants={categoryTitleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, " $1")}
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {items.map((item, index) => (
                <motion.div
                  key={item.uniqueId || `menu-item-${index}`}
                  className="group bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-out flex flex-col border border-white/20 hover:shadow-amber-400/30"
                  custom={index}
                  variants={itemCardVariants}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25, ease: "circOut" } }}
                >
                  <div className="w-full h-40 xs:h-44 sm:h-48 md:h-52 lg:h-60 xl:h-64 overflow-hidden rounded-t-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                    <h4
                      className="font-playfair text-lg sm:text-xl md:text-2xl font-semibold text-amber-300 mb-2 leading-tight"
                      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)" }}
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 flex-grow leading-relaxed">
                      {item.description}
                    </p>
                    <p
                      className="text-base sm:text-lg md:text-xl font-bold text-amber-400 mt-auto"
                      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}
                    >
                      {item.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}