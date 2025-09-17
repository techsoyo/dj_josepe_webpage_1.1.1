import * as eventDAO from '../daos/events.dao.js';

// Controller to get all PUBLIC events
export async function getAllPublicEvents(req, res) {
  try {
    const events = await eventDAO.getAllEvents(false); // Always false for public
    res.json(events);
  } catch (error) {
    console.error('Error getting public events:', error);
    res.status(500).json({ error: 'Failed to retrieve events.' });
  }
}

// Controller to get all ADMIN events (includes unpublished)
export async function getAllAdminEvents(req, res) {
  try {
    const events = await eventDAO.getAllEvents(true); // Always true for admin
    res.json(events);
  } catch (error) {
    console.error('Error getting admin events:', error);
    res.status(500).json({ error: 'Failed to retrieve events.' });
  }
}

// Controller to get a single event by ID
export async function getEventById(req, res) {
  try {
    const event = await eventDAO.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json(event);
  } catch (error) {
    console.error(`Error getting event ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve event.' });
  }
}

// Controller to create a new event
export async function createEvent(req, res) {
  try {
    if (!req.body.title || !req.body.slug || !req.body.venue || !req.body.date) {
      return res.status(400).json({ error: 'Title, slug, venue, and date are required.' });
    }
    const newEventId = await eventDAO.createEvent(req.body);
    res.status(201).json({ id: newEventId, ...req.body });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event.' });
  }
}

// Controller to update an event
export async function updateEvent(req, res) {
  try {
    const success = await eventDAO.updateEvent(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ error: 'Event not found or no changes made.' });
    }
    res.json({ success: true, message: 'Event updated.' });
  } catch (error) {
    console.error(`Error updating event ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update event.' });
  }
}

// Controller to delete an event
export async function deleteEvent(req, res) {
  try {
    const success = await eventDAO.deleteEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error deleting event ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
}

// Controller to toggle the published status of an event
export async function togglePublished(req, res) {
    try {
        const { published } = req.body;
        if (typeof published !== 'boolean') {
            return res.status(400).json({ error: 'Published status must be a boolean.' });
        }
        const success = await eventDAO.setEventPublishedStatus(req.params.id, published);
        if (!success) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json({ success: true, message: `Event published status set to ${published}.` });
    } catch (error) {
        console.error(`Error updating event ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to update event.' });
    }
}