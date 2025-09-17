import db from '../utils/database.js';

// NOTE: Basic implementation. Does not include track management yet.

/**
 * Fetches all music sets. Can include unpublished sets for admin view.
 * @param {boolean} includeUnpublished - Whether to include non-published sets.
 * @returns {Promise<Array>} A list of music sets.
 */
export async function getAllSets(includeUnpublished = false) {
  let query = 'SELECT * FROM MusicSet';
  if (!includeUnpublished) {
    query += ' WHERE published = 1';
  }
  query += ' ORDER BY releaseDate DESC';
  const [rows] = await db.query(query);
  return rows;
}

/**
 * Fetches a single music set by its ID.
 * @param {number} id - The ID of the set.
 * @returns {Promise<object|null>} The set object or null if not found.
 */
export async function getSetById(id) {
  const [rows] = await db.query('SELECT * FROM MusicSet WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Creates a new music set.
 * @param {object} setData - The data for the new set.
 * @returns {Promise<number>} The ID of the newly created set.
 */
export async function createSet(setData) {
  const { title, slug, ...otherData } = setData;
  const [result] = await db.query(
    'INSERT INTO MusicSet (title, slug, genre, description, published) VALUES (?, ?, ?, ?, ?)',
    [title, slug, otherData.genre, otherData.description, otherData.published || 1]
  );
  return result.insertId;
}

/**
 * Updates an existing music set.
 * @param {number} id - The ID of the set to update.
 * @param {object} setData - The new data for the set.
 * @returns {Promise<boolean>} True if the update was successful.
 */
export async function updateSet(id, setData) {
  const { title, slug, genre, description, published } = setData;
  const [result] = await db.query(
    'UPDATE MusicSet SET title = ?, slug = ?, genre = ?, description = ?, published = ? WHERE id = ?',
    [title, slug, genre, description, published, id]
  );
  return result.affectedRows > 0;
}

/**
 * Deletes a music set by its ID.
 * @param {number} id - The ID of the set to delete.
 * @returns {Promise<boolean>} True if the deletion was successful.
 */
export async function deleteSet(id) {
  const [result] = await db.query('DELETE FROM MusicSet WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Updates the published status of a set.
 * @param {number} id - The ID of the set.
 * @param {boolean} published - The new published status.
 * @returns {Promise<boolean>} True if the update was successful.
 */
export async function setSetPublishedStatus(id, published) {
    const [result] = await db.query('UPDATE MusicSet SET published = ? WHERE id = ?', [published, id]);
    return result.affectedRows > 0;
}

// Note: Play and download counts are not in the MusicSet table. They seem to be in Analytics.
// I will skip implementing incrementPlayCount and incrementDownloadCount for now.
