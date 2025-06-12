"use client"

import "../../styles/landing/testimonials-section.css"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Star } from "lucide-react"

const testimonialsData = [
  {
    name: "Alex P.",
    avatar: "/placeholder.svg?width=40&height=40",
    title: "Travel Enthusiast",
    quote:
      "Visiting Tonle Sap was an unforgettable experience. The floating villages are incredible, and the sunset views are magical!",
    rating: 5,
  },
  {
    name: "Maria S.",
    avatar: "/placeholder.svg?width=40&height=40",
    title: "Photographer",
    quote:
      "Tonle Sap offers endless photographic opportunities. The light, the people, the nature – it's all so inspiring.",
    rating: 5,
  },
  {
    name: "John B.",
    avatar: "/placeholder.svg?width=40&height=40",
    title: "Nature Lover",
    quote: "The biodiversity here is astounding. I learned so much about the unique ecosystem and its importance.",
    rating: 4,
  },
]

export default function TestimonialsSection() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section id="testimonials" className="testimonials-section-wrapper">
      <motion.div
        className="container mx-auto px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="testimonials-section-title">Voices of Visitors</h2>
          <p className="testimonials-section-subtitle">
            Hear what others have to say about their Tonle Sap experience.
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={sectionVariants}>
          {testimonialsData.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="testimonial-card">
                <CardHeader className="testimonial-header">
                  <Avatar className="testimonial-avatar">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="testimonial-name">{testimonial.name}</h3>
                    <p className="testimonial-user-title">{testimonial.title}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                  <div className="testimonial-stars">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
