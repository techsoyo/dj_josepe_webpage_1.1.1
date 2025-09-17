import db from '../utils/database.js';

// NOTE: Basic implementation. Error handling, pagination, and advanced filtering should be added.

/**
 * Fetches all events. Can include unpublished events for admin view.
 * @param {boolean} includeUnpublished - Whether to include non-published events.
 * @returns {Promise<Array>} A list of events.
 */
export async function getAllEvents(includeUnpublished = false) {
  let query = 'SELECT * FROM Event';
  if (!includeUnpublished) {
    query += ' WHERE published = 1';
  }
  query += ' ORDER BY date DESC';
  const [rows] = await db.query(query);
  return rows;
}

/**
 * Fetches a single event by its ID.
 * @param {number} id - The ID of the event.
 * @returns {Promise<object|null>} The event object or null if not found.
 */
export async function getEventById(id) {
  const [rows] = await db.query('SELECT * FROM Event WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Creates a new event.
 * @param {object} eventData - The data for the new event.
 * @returns {Promise<number>} The ID of the newly created event.
 */
export async function createEvent(eventData) {
  // Destructure with defaults to match the DB schema
  const {
    title, slug, venue, date,
    description = null, shortDescription = null, address = null, city = null, country = 'España',
    coordinates = null, endDate = null, time = null, endTime = null, timezone = 'Europe/Madrid',
    price = null, currency = 'EUR', ticketUrl = null, facebookUrl = null, instagramUrl = null,
    status = 'scheduled', eventType = 'performance', capacity = null, featured = 0, soldOut = 0, published = 1
  } = eventData;

  const [result] = await db.query(
    `INSERT INTO Event (title, slug, venue, date, description, shortDescription, address, city, country, coordinates, endDate, time, endTime, timezone, price, currency, ticketUrl, facebookUrl, instagramUrl, status, eventType, capacity, featured, soldOut, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [title, slug, venue, date, description, shortDescription, address, city, country, coordinates, endDate, time, endTime, timezone, price, currency, ticketUrl, facebookUrl, instagramUrl, status, eventType, capacity, featured, soldOut, published]
  );
  return result.insertId;
}

/**
 * Updates an existing event.
 * @param {number} id - The ID of the event to update.
 * @param {object} eventData - The new data for the event.
 * @returns {Promise<boolean>} True if the update was successful.
 */
export async function updateEvent(id, eventData) {
  // A real implementation would dynamically build the SET clause
  // This is a simplified version assuming all fields are provided
  const {
    title, slug, venue, date, description, shortDescription, address, city, country, coordinates, endDate, time, endTime, timezone, price, currency, ticketUrl, facebookUrl, instagramUrl, status, eventType, capacity, featured, soldOut, published
  } = eventData;

  const [result] = await db.query(
    `UPDATE Event SET title = ?, slug = ?, venue = ?, date = ?, description = ?, shortDescription = ?, address = ?, city = ?, country = ?, coordinates = ?, endDate = ?, time = ?, endTime = ?, timezone = ?, price = ?, currency = ?, ticketUrl = ?, facebookUrl = ?, instagramUrl = ?, status = ?, eventType = ?, capacity = ?, featured = ?, soldOut = ?, published = ?
     WHERE id = ?`, 
    [title, slug, venue, date, description, shortDescription, address, city, country, coordinates, endDate, time, endTime, timezone, price, currency, ticketUrl, facebookUrl, instagramUrl, status, eventType, capacity, featured, soldOut, published, id]
  );
  return result.affectedRows > 0;
}

/**
 * Deletes an event by its ID.
 * @param {number} id - The ID of the event to delete.
 * @returns {Promise<boolean>} True if the deletion was successful.
 */
export async function deleteEvent(id) {
  const [result] = await db.query('DELETE FROM Event WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Updates the published status of an event.
 * @param {number} id - The ID of the event.
 * @param {boolean} published - The new published status.
 * @returns {Promise<boolean>} True if the update was successful.
 */
export async function setEventPublishedStatus(id, published) {
    const [result] = await db.query('UPDATE Event SET published = ? WHERE id = ?', [published, id]);
    return result.affectedRows > 0;
}
