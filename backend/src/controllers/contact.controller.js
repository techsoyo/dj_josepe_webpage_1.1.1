import { createContactMessage } from '../daos/contact.dao.js';

/**
 * Handles the submission of a new contact form message.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export async function handleNewMessage(req, res) {
  const { name, email, message, ...otherData } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const messageData = {
      name,
      email,
      message,
      ...otherData
    };

    const newId = await createContactMessage(messageData);

    res.status(201).json({ success: true, message: 'Message received.', id: newId });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to process message.' });
  }
}
