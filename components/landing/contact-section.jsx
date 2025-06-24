"use client"

import { useState } from "react"
import "../../styles/landing/contact-section.css"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { User, PhoneIcon, Mail, CalendarDays, Clock, Users, MessageSquare, X } from "lucide-react"

export default function ContactSection() {
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: today,
    time: "18:00",
    guests: "2",
    requests: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [errorDetails, setErrorDetails] = useState("")

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }))
    }
    setSubmitSuccess(false)
    setSubmitError("")
    setErrorDetails("")
  }

  const validate = () => {
    const tempErrors = {}
    if (!formData.name.trim()) tempErrors.name = "Full Name is required."
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone Number is required."
    } else if (!/^\+?[0-9\s-()]{7,20}$/.test(formData.phone)) {
      tempErrors.phone = "Phone number is invalid."
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email Address is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email address is invalid."
    }
    if (!formData.date) tempErrors.date = "Date is required."
    else if (new Date(formData.date) < new Date(today)) tempErrors.date = "Date cannot be in the past."
    if (!formData.time) tempErrors.time = "Time is required."
    const [hour] = formData.time.split(":").map(Number)
    if (hour < 10 || hour >= 22) tempErrors.time = "Reservations are between 10:00 AM and 10:00 PM."

    if (!formData.guests || Number.parseInt(formData.guests, 10) < 1) {
      tempErrors.guests = "Number of guests must be at least 1."
    } else if (Number.parseInt(formData.guests, 10) > 20) {
      tempErrors.guests = "For parties larger than 20, please call us."
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitSuccess(false)
    setSubmitError("")
    setErrorDetails("")
    
    if (validate()) {
      setIsSubmitting(true)
      
      try {
        const response = await fetch('/api/send-reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const result = await response.json()

        if (response.ok) {
          setSubmitSuccess(true)
          // Only reset form on successful submission
          setFormData({
            name: "",
            phone: "",
            email: "",
            date: today,
            time: "18:00",
            guests: "2",
            requests: "",
          })
          setErrors({})
          
          // Show development mode message if applicable
          if (result.message.includes('Development mode')) {
            console.log('🔧 Development mode active - check browser console for email details')
          }
        } else {
          // Handle different error types
          if (response.status === 503) {
            setSubmitError('Email service is temporarily unavailable. Your reservation has been recorded and we will contact you shortly.')
            if (result.details) {
              setErrorDetails(result.details)
            }
          } else {
            setSubmitError(result.error || 'Failed to send reservation request. Please try again.')
            if (result.details) {
              setErrorDetails(result.details)
            }
          }
        }
      } catch (error) {
        console.error('Error submitting reservation:', error)
        setSubmitError('Network error. Please check your connection and try again.')
        if (process.env.NODE_ENV === 'development') {
          setErrorDetails(error.message)
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const closeSuccessMessage = () => {
    setSubmitSuccess(false)
  }

  const closeErrorMessage = () => {
    setSubmitError("")
    setErrorDetails("")
  }

  return (
    <section id="contact" className="contact-section-wrapper">
      <motion.div
        className="container mx-auto px-4 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h2 className="contact-section-title">Make a Reservation</h2>
          <p className="contact-section-subtitle">
            Book your table or send us a message. We'll get back to you shortly.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form-grid" noValidate>
            <div className="md:col-span-1">
              <Label htmlFor="name" className="contact-form-label">
                <User className="text-amber-500" /> Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`contact-form-input ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="phone" className="contact-form-label">
                <PhoneIcon className="text-amber-500" /> Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={handleChange}
                className={`contact-form-input ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            <div className="contact-form-full-width">
              <Label htmlFor="email" className="contact-form-label">
                <Mail className="text-amber-500" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`contact-form-input ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="date" className="contact-form-label">
                <CalendarDays className="text-amber-500" /> Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                className={`contact-form-input ${errors.date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="error-message">{errors.date}</p>}
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="time" className="contact-form-label">
                <Clock className="text-amber-500" /> Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                min="10:00"
                max="22:00"
                step="900"
                className={`contact-form-input ${errors.time ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                aria-invalid={!!errors.time}
              />
              {errors.time && <p className="error-message">{errors.time}</p>}
            </div>

            <div className="contact-form-full-width">
              <Label htmlFor="guests" className="contact-form-label">
                <Users className="text-amber-500" /> Number of Guests
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="20"
                placeholder="2"
                value={formData.guests}
                onChange={handleChange}
                className={`contact-form-input ${errors.guests ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                aria-invalid={!!errors.guests}
              />
              {errors.guests && <p className="error-message">{errors.guests}</p>}
            </div>

            <div className="contact-form-full-width">
              <Label htmlFor="requests" className="contact-form-label">
                <MessageSquare className="text-amber-500" /> Special Requests / Message (Optional)
              </Label>
              <Textarea
                id="requests"
                placeholder="e.g., window seat, dietary restrictions, or your message..."
                value={formData.requests}
                onChange={handleChange}
                rows={4}
                className="contact-form-textarea"
              />
            </div>

            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="success-message-dark"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold">Reservation submitted successfully!</div>
                      <div className="text-sm opacity-90">
                        {process.env.NODE_ENV === 'development' 
                          ? 'Check browser console for email details (Development mode)'
                          : 'Check your email for confirmation'
                        }
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeSuccessMessage}
                    className="text-green-400 hover:text-green-300 transition-colors"
                    aria-label="Close success message"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message-dark"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold">Submission Error</div>
                      <div className="text-sm opacity-90">{submitError}</div>
                      {errorDetails && (
                        <div className="text-xs opacity-75 mt-1 font-mono bg-red-900 bg-opacity-50 p-1 rounded">
                          {errorDetails}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeErrorMessage}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Close error message"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            <Button type="submit" size="lg" className="contact-submit-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </div>
              ) : (
                "Submit Reservation Request"
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </section>
  )
}
