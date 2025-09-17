'use client'
import { useState } from 'react'
import { z } from 'zod'
import contactService from '../../../services/contactService'
import styles from './minimalist.module.css'

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().max(100, 'El nombre de la empresa no puede exceder 100 caracteres').optional(),
  subject: z.string().max(200, 'El asunto no puede exceder 200 caracteres').optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(2000, 'El mensaje no puede exceder 2000 caracteres'),
  type: z.enum(['general', 'booking', 'collaboration', 'technical', 'other']).default('general')
})

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    type: 'booking'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setIsError(false)
    setValidationErrors({})

    try {
      // Validate form data with Zod
      const validatedData = contactSchema.parse(formData)

      // Send to MySQL backend
      const response = await contactService.submitContactForm(validatedData)

      setSubmitMessage('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        type: 'booking'
      })
    } catch (error) {
      console.error('Error submitting form:', error)

      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors = {}
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message
        })
        setValidationErrors(errors)
        setSubmitMessage('Por favor, corrige los errores en el formulario.')
      } else {
        // Handle API errors
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        setSubmitMessage(`Error al enviar el mensaje: ${errorMessage}`)
      }
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.form}>
          <h2 className={styles.title}>Contáctame</h2>

          <form onSubmit={handleSubmit} className={styles.formInner}>
            <div className={styles.formGrid}>
              {/* Datos personales */}
              <div className={styles.formField}>
                <label htmlFor="name" className={styles.label}>
                  NOMBRE COMPLETO *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
                  required
                  placeholder="Tu nombre completo"
                />
                {validationErrors.name && (
                  <span className={styles.errorText}>{validationErrors.name}</span>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="email" className={styles.label}>
                  CORREO ELECTRÓNICO *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
                  required
                  placeholder="tu@email.com"
                />
                {validationErrors.email && (
                  <span className={styles.errorText}>{validationErrors.email}</span>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="phone" className={styles.label}>
                  TELÉFONO
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${styles.input} ${validationErrors.phone ? styles.inputError : ''}`}
                  placeholder="+34 600 000 000"
                />
                {validationErrors.phone && (
                  <span className={styles.errorText}>{validationErrors.phone}</span>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="company" className={styles.label}>
                  EMPRESA
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`${styles.input} ${validationErrors.company ? styles.inputError : ''}`}
                  placeholder="Nombre de la empresa (opcional)"
                />
                {validationErrors.company && (
                  <span className={styles.errorText}>{validationErrors.company}</span>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="type" className={styles.label}>
                  TIPO DE CONSULTA *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`${styles.select} ${validationErrors.type ? styles.inputError : ''}`}
                  required
                >
                  <option value="booking">Contratación/Booking</option>
                  <option value="collaboration">Colaboración</option>
                  <option value="general">Consulta General</option>
                  <option value="technical">Soporte Técnico</option>
                  <option value="other">Otro</option>
                </select>
                {validationErrors.type && (
                  <span className={styles.errorText}>{validationErrors.type}</span>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="subject" className={styles.label}>
                  ASUNTO
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`${styles.input} ${validationErrors.subject ? styles.inputError : ''}`}
                  placeholder="Asunto del mensaje"
                />
                {validationErrors.subject && (
                  <span className={styles.errorText}>{validationErrors.subject}</span>
                )}
              </div>

              {/* Mensaje */}
              <div className={`${styles.formField} ${styles.colSpan2}`}>
                <label htmlFor="message" className={styles.label}>
                  MENSAJE DETALLADO *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${validationErrors.message ? styles.inputError : ''}`}
                  rows="4"
                  required
                  placeholder="Cuéntanos sobre tu evento, estilo musical preferido, duración, etc. (mínimo 10 caracteres)"
                />
                {validationErrors.message && (
                  <span className={styles.errorText}>{validationErrors.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </div>

            {submitMessage && (
              <div className={`${styles.submitMessage} ${isError ? styles.errorMessage : styles.successMessage}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}                                                                                                                                       