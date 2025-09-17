// components/ContactForm.js
//
// A reusable contact form component used on the public contact page.
// Users can submit their name, email and message.
// Submissions are sent to the backend via the contactService.
// Success and error states are displayed to the user and the form resets on successful submission.

'use client';

import { useState } from 'react';
import contactService from '../../services/contactService';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await contactService.submitContactForm(form);
      setSuccess('¡Gracias! Tu mensaje ha sido enviado correctamente.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      // Use message from backend if available
      const message = err?.response?.data?.message || 'Error al enviar el mensaje.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Nombre
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Mensaje
        </label>
        <textarea
          className="form-control"
          id="message"
          name="message"
          rows="5"
          required
          value={form.message}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-warning" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}