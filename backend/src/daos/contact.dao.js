import db from '../utils/database.js';

/**
 * Inserts a new contact message into the database.
 * @param {object} messageData - The contact message data.
 * @param {string} messageData.name - Sender's name.
 * @param {string} messageData.email - Sender's email.
 * @param {string} [messageData.phone] - Sender's phone.
 * @param {string} [messageData.company] - Sender's company.
 * @param {string} [messageData.subject] - Message subject.
 * @param {string} messageData.message - The message content.
 * @returns {Promise<number>} The ID of the inserted message.
 */
export async function createContactMessage(messageData) {
  const {
    name,
    email,
    phone = null,
    company = null,
    subject = 'Contacto General',
    message
  } = messageData;

  const [result] = await db.query(
    'INSERT INTO ContactMessage (name, email, phone, company, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, company, subject, message, 'new']
  );

  return result.insertId;
}
