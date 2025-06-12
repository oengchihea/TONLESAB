"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"

const menuData = {
  appetizers: [
    {
      name: "Fresh Spring Rolls (Nime Chow)",
      description:
        "Delicate rice paper rolls filled with shrimp, fresh herbs, and rice vermicelli, served with a rich peanut dipping sauce.",
      price: "$7.00",
      image: "/images/springroll.jpg",
    },
    {
      name: "Green Mango Salad (Nhoam Svay)",
      description:
        "A refreshing salad of shredded green mango, dried shrimp, roasted peanuts, and aromatic herbs, tossed in a tangy lime dressing.",
      price: "$8.00",
      image: "/images/green.jpg",
    },
    {
      name: "Crispy Rice Cakes with Natang Dip",
      description:
        "Crunchy fried rice cakes served with a savory and creamy pork and coconut dip, lightly spiced with Khmer herbs.",
      price: "$8.50",
      image: "/images/crispy.jpg",
    },
  ],
  mainCourses: [
    {
      name: "Fish Amok (Amok Trey)",
      description:
        "A signature Khmer dish. Tender fish fillets steamed in a creamy coconut curry, infused with kroeung paste and wrapped in banana leaves.",
      price: "$15.00",
      image: "/images/amok.png",
    },
    {
      name: "Beef Lok Lak",
      description:
        "Succulent stir-fried beef cubes marinated in a savory sauce, served on a bed of fresh lettuce, tomatoes, and onions with a zesty lime-pepper dip.",
      price: "$16.00",
      image: "/images/beef.jpg",
    },
    {
      name: "Khmer Red Curry (Kari Sach Moan)",
      description:
        "A fragrant and milder red curry with tender chicken pieces, sweet potatoes, green beans, and bamboo shoots, simmered in rich coconut milk.",
      price: "$14.00",
      image: "/images/khmer red.jpg",
    },
  ],
  desserts: [
    {
      name: "Pumpkin Custard (Sankhya Lapov)",
      description:
        "A delightful dessert featuring a whole pumpkin filled with a smooth, sweet coconut custard, steamed to perfection.",
      price: "$9.00",
      image: "/images/lapov.jpg",
    },
    {
      name: "Banana Tapioca Pudding (Chek Khtis)",
      description:
        "Sweet and creamy tapioca pudding with ripe bananas and rich coconut milk, a comforting classic Khmer dessert.",
      price: "$6.50",
      image: "/images/banana.jpg",
    },
    {
      name: "Sticky Rice with Mango",
      description:
        "Sweet glutinous rice steamed with coconut milk, served with fresh, ripe mango slices and a drizzle of coconut cream.",
      price: "$9.50",
      image: "/images/mango.jpg",
    },
  ],
}

const allItems = [...menuData.mainCourses, ...menuData.appetizers, ...menuData.desserts]
const bannerOneItems = allItems.slice(0, Math.ceil(allItems.length / 2))
const bannerTwoItems = allItems.slice(Math.ceil(allItems.length / 2))

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
  }

  return (
    <div className="w-full overflow-hidden py-2">
      <motion.div
        ref={bannerRef}
        className="flex gap-6 pr-6"
        variants={bannerVariants}
        animate={isPaused ? "paused" : "animate"}
      >
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={`${item.name}-${index}`}
            layoutId={`gallery-card-${item.name}-${index}`}
            onClick={() => onItemClick(item)}
            className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0 cursor-pointer rounded-lg shadow-lg overflow-hidden border-4 border-amber-100/80 hover:border-amber-300 transition-colors duration-200"
            style={{
              transform: `rotate(${index % 2 === 0 ? 3 : -3}deg)`,
            }}
            whileHover={{
              y: -8,
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(245, 158, 11, 0.3)",
              transition: { duration: 0.2, ease: "easeOut" },
            }}
          >
            <Image
              src={item.image || "/placeholder.svg?width=200&height=200&query=Food"}
              alt={item.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <h4 className="absolute bottom-2 left-3 font-playfair text-base sm:text-lg text-white font-semibold drop-shadow-md p-1 bg-black/20 rounded">
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

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] flex flex-col items-center justify-center gap-4 sm:gap-6 bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-3 sm:p-4 my-10 md:my-12 overflow-hidden border border-amber-500/40">
      <InfiniteBanner items={bannerOneItems} direction="left" onItemClick={setSelectedItem} isPaused={!!selectedItem} />
      <InfiniteBanner
        items={bannerTwoItems}
        direction="right"
        onItemClick={setSelectedItem}
        isPaused={!!selectedItem}
      />

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              layoutId={`gallery-card-${selectedItem.name}-${allItems.findIndex((it) => it.name === selectedItem.name) % bannerOneItems.length}`}
              className="relative w-full h-auto max-w-xl aspect-[4/3] sm:max-w-2xl rounded-xl shadow-2xl overflow-hidden border-8 border-amber-300 bg-black"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            >
              <Image
                src={selectedItem.image || "/placeholder.svg?width=800&height=600&query=Selected+Food"}
                alt={selectedItem.name}
                fill
                className="object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h4 className="font-playfair text-2xl sm:text-3xl text-amber-200 font-bold drop-shadow-lg">
                  {selectedItem.name}
                </h4>
                {selectedItem.description && <p className="text-sm text-gray-300 mt-1">{selectedItem.description}</p>}
                {selectedItem.price && (
                  <p className="text-lg font-semibold text-amber-400 mt-2">{selectedItem.price}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs sm:text-sm text-amber-200/80 mt-2">Click on any dish to see more details!</p>
    </div>
  )
}

export default function MenuSection() {
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

  return (
    <section
      id="menu"
      className="relative py-16 md:py-24 overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/menu.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <motion.div
        className="container relative z-10 mx-auto px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
      >
        <motion.h2
          className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-amber-400 mb-3 sm:mb-4"
          style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)" }}
          variants={titleVariants}
        >
          Taste of Cambodia
        </motion.h2>
        <motion.p
          className="mt-2 max-w-lg md:max-w-2xl mx-auto text-center text-sm sm:text-base md:text-lg text-gray-200 mb-10 sm:mb-16"
          style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)" }}
          variants={titleVariants}
          transition={{ delay: 0.1 }}
        >
          Explore the rich and aromatic flavors of authentic Khmer cuisine, prepared with the freshest local
          ingredients.
        </motion.p>

        <FoodGallerySandbox />

        {Object.entries(menuData).map(([category, items]) => (
          <div key={category} className="mb-12 md:mb-16">
            <motion.h3
              className="font-playfair text-2xl sm:text-3xl font-semibold text-amber-300 mt-8 sm:mt-10 mb-6 sm:mb-8 border-b-2 border-amber-500/50 pb-3"
              style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}
              variants={categoryTitleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, " $1")}
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10">
              {items.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="group bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-out flex flex-col border border-white/20 hover:shadow-amber-400/30"
                  custom={index}
                  variants={itemCardVariants}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25, ease: "circOut" } }}
                >
                  <div className="w-full h-52 sm:h-60 md:h-64 overflow-hidden rounded-t-xl">
                    <Image
                      src={item.image || "/placeholder.svg?width=400&height=300&query=Delicious+Food"}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <h4
                      className="font-playfair text-xl sm:text-2xl font-semibold text-amber-300 mb-2"
                      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)" }}
                    >
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3 sm:mb-4 flex-grow leading-relaxed">{item.description}</p>
                    <p
                      className="text-lg sm:text-xl font-bold text-amber-400 mt-auto"
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
