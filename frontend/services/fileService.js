// services/fileService.js
//
// Handles file uploads and deletions as well as generating URLs for
// files stored on the server.  Uploads are performed with
// multipart/form-data.  Deletion accepts the path to remove.  The
// `getFileUrl` helper ensures relative paths are resolved to full
// URLs using the base API URL.

import api from './api';

const fileService = {
  /** Upload a file.  Provide a File instance along with a type (e.g. image/audio)
   * and optionally a folder name.  Returns the uploaded file info.
   */
  async uploadFile(file, type = 'image', folder = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('folder', folder);
    return await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** Delete a previously uploaded file by path. */
  async deleteFile(path) {
    return await api.delete('/api/upload', { data: { path } });
  },

  /**
   * Construct a full URL for a file path.  If the provided path is
   * already a complete URL (starting with http or https) it is
   * returned unchanged.  Otherwise we prefix it with the API base
   * URL.  Accepts null/undefined and returns null.
   */
  getFileUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//.test(path)) return path;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000';
    return `${base}/${path.replace(/^\//, '')}`;
  },
};

export default fileService;