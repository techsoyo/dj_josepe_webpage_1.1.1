// frontend/services/setsService.js

function joinUrl(base, path) {
  // Si path es absoluto, úsalo tal cual
  if (/^https?:\/\//i.test(path)) return path;
  const b = (base || '').replace(/\/+$/, '');      // sin barra final
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`.replace(/([^:]\/)\/+/g, '$1'); // colapsa dobles barras
}

function toAbsoluteUrl(path, base) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return joinUrl(base || '', path);
}

async function fetchJson(url) {
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Lee MusicSet (publicados) desde tu backend.
 * ENV:
 *   NEXT_PUBLIC_API_URL        ej: http://localhost:4000   (SIN /api)
 *   NEXT_PUBLIC_MUSICSETS_PATH ej: /api/sets               (CON / inicial)
 *   NEXT_PUBLIC_ASSETS_BASE    ej: http://localhost:4000
 */
export async function getMusicSets() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const path = process.env.NEXT_PUBLIC_MUSICSETS_PATH || '/api/sets';

  // Construye una única URL final (sin duplicar /api)
  const url = apiBase ? joinUrl(apiBase, path) : path;

  console.info('[getMusicSets] URL:', url);

  const raw = await fetchJson(url);

  const assetsBase =
    process.env.NEXT_PUBLIC_ASSETS_BASE || apiBase || '';

  const normalize = (item) => {
    const coverImage = item.coverPhotoPath
      ? toAbsoluteUrl(item.coverPhotoPath, assetsBase)
      : null;

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description ?? '',
      genre: item.genre ?? null,
      subgenre: item.subgenre ?? null,
      bpm: item.bpm ?? null,
      duration: item.duration ?? null,
      releaseDate: item.releaseDate ?? item.createdAt,
      soundcloudUrl: item.soundcloudUrl ?? '',
      mixcloudUrl: item.mixcloudUrl ?? null,
      youtubeUrl: item.youtubeUrl ?? null,
      spotifyUrl: item.spotifyUrl ?? null,
      beatportUrl: item.beatportUrl ?? null,
      downloadUrl: item.downloadUrl ?? null,
      featured: !!item.featured,
      exclusive: !!item.exclusive,
      liveRecording: !!item.liveRecording,
      quality: item.quality ?? 'high',
      seo_title: item.seo_title ?? null,
      seo_description: item.seo_description ?? null,
      published: item.published === 1 || item.published === true,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      coverPhotoId: item.coverPhotoId ?? null,
      coverImage,
    };
  };

  return Array.isArray(raw) ? raw.map(normalize) : [];
}

export default { getMusicSets };
