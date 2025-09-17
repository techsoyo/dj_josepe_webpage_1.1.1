// services/settingsService.js
//
// Admin settings service providing endpoints for retrieving and
// updating general settings, social media links and third party
// integrations.  All endpoints require a valid authentication token.

import api from './api';

const settingsService = {
  /** Fetch all settings for the admin panel. */
  async getSettings() {
    return await api.get('/api/admin/settings');
  },

  /** Update general settings with provided data. */
  async updateSettings(data) {
    return await api.put('/admin/settings', data);
  },

  /** Retrieve the configured social media profiles. */
  async getSocialMedia() {
    return await api.get('/admin/settings/social-media');
  },

  /** Update social media profiles. */
  async updateSocialMedia(data) {
    return await api.put('/admin/settings/social-media', data);
  },

  /** Retrieve the integration settings. */
  async getIntegrations() {
    return await api.get('/admin/settings/integrations');
  },

  /** Update integration settings. */
  async updateIntegrations(data) {
    return await api.put('/admin/settings/integrations', data);
  },
};

export default settingsService;