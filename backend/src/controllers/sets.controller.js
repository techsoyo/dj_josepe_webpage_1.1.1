import * as setsDAO from '../daos/sets.dao.js';

// Controller to get all PUBLIC sets
export async function getAllPublicSets(req, res) {
  try {
    const sets = await setsDAO.getAllSets(false);
    res.json(sets);
  } catch (error) {
    console.error('Error getting public sets:', error);
    res.status(500).json({ error: 'Failed to retrieve sets.' });
  }
}

// Controller to get all ADMIN sets
export async function getAllAdminSets(req, res) {
  try {
    const sets = await setsDAO.getAllSets(true);
    res.json(sets);
  } catch (error) {
    console.error('Error getting admin sets:', error);
    res.status(500).json({ error: 'Failed to retrieve sets.' });
  }
}

// Controller to get a single set by ID
export async function getSetById(req, res) {
  try {
    const set = await setsDAO.getSetById(req.params.id);
    if (!set) {
      return res.status(404).json({ error: 'Set not found.' });
    }
    res.json(set);
  } catch (error) {
    console.error(`Error getting set ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve set.' });
  }
}

// Controller to create a new set
export async function createSet(req, res) {
  try {
    if (!req.body.title || !req.body.slug) {
      return res.status(400).json({ error: 'Title and slug are required.' });
    }
    const newSetId = await setsDAO.createSet(req.body);
    res.status(201).json({ id: newSetId, ...req.body });
  } catch (error) {
    console.error('Error creating set:', error);
    res.status(500).json({ error: 'Failed to create set.' });
  }
}

// Controller to update a set
export async function updateSet(req, res) {
  try {
    const success = await setsDAO.updateSet(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ error: 'Set not found or no changes made.' });
    }
    res.json({ success: true, message: 'Set updated.' });
  } catch (error) {
    console.error(`Error updating set ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update set.' });
  }
}

// Controller to delete a set
export async function deleteSet(req, res) {
  try {
    const success = await setsDAO.deleteSet(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Set not found.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error deleting set ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete set.' });
  }
}

// Controller to toggle the published status of a set
export async function togglePublished(req, res) {
    try {
        const { published } = req.body;
        if (typeof published !== 'boolean') {
            return res.status(400).json({ error: 'Published status must be a boolean.' });
        }
        const success = await setsDAO.setSetPublishedStatus(req.params.id, published);
        if (!success) {
            return res.status(404).json({ error: 'Set not found.' });
        }
        res.json({ success: true, message: `Set published status set to ${published}.` });
    } catch (error) {
        console.error(`Error updating set ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to update set.' });
    }
}
