import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contacto - DJ Josepe',
  description: 'Ponte en contacto con DJ Josepe para contrataciones, colaboraciones y consultas. Disponible para eventos, fiestas y celebraciones.',
  keywords: ['contacto', 'DJ Josepe', 'contratación', 'booking', 'eventos', 'fiestas'],
}

export default function ContactPage() {
  return (
    <main>
      <ContactForm />
    </main>
  )
}