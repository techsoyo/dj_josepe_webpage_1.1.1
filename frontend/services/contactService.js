// services/contactService.js
//
// Servicio simplificado para manejar el envío de formularios de contacto.
// Los mensajes se envían a un correo electrónico y no se almacenan en base de datos.

import api from './api';

const contactService = {
  /**
   * Envía un formulario de contacto con nombre, email y mensaje.
   * La ruta de backend se encargará de enviar estos datos por correo.
   */
  async submitContactForm(data) {
    return await api.post('/api/contact', data);
  }
};

export default contactService;