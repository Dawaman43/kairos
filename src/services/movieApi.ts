const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || (typeof process !== 'undefined' ? process.env.TMDB_API_KEY : '') || '';
const BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.warn('TMDB API key is not set. Set VITE_TMDB_API_KEY in .env or TMDB_API_KEY in the environment.');
}

export async function fetchMovieData(movieId: string | number) {
  if (!TMDB_API_KEY) throw new Error('Missing TMDB API key');

  const [movieRes, videoRes] = await Promise.all([
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`),
    fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`),
  ]);

  if (!movieRes.ok) throw new Error('Failed to fetch movie details');
  if (!videoRes.ok) {
    // continue — videos are optional
  }

  const details = await movieRes.json();
  const videoData = videoRes.ok ? await videoRes.json() : { results: [] };

  const trailer = (videoData.results || []).find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const pacing = details.genres?.some((g: any) => [28, 53].includes(g.id))
    ? 'fast'
    : details.genres?.some((g: any) => [18].includes(g.id))
    ? 'slow'
    : 'medium';

  const weight = details.budget > 50000000 ? 'heavy' : 'light';

  return {
    id: details.id,
    title: details.title,
    poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
    youtubeId: trailer?.key || '',
    year: details.release_date ? new Date(details.release_date).getFullYear() : undefined,
    runtime: details.runtime,
    origin: details.production_countries?.[0]?.iso_3166_1 + '_SECTOR' || 'UNKNOWN',
    moods: (details.genres || []).map((g: any) => g.name.toLowerCase()),
    pacing,
    weight,
    rating: details.vote_average,
    overview: details.overview,
  };
}
