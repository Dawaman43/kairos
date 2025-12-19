const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.error("TMDB API key is not set. Set VITE_TMDB_API_KEY in .env");
}
const GENRE_MAP: Record<string, number> = {
  action: 28, fast: 28, adrenaline: 28, fight: 28,
  adventure: 12, journey: 12, explore: 12, epic: 12,
  animation: 16, anime: 16, cartoon: 16,
  comedy: 35, funny: 35, laugh: 35, fun: 35, happy: 35,
  crime: 80, murder: 80, police: 80, heist: 80,
  documentary: 99, real: 99, fact: 99, learning: 99,
  drama: 18, sad: 18, cry: 18, emotional: 18, deep: 18, heavy: 18,
  family: 10751, kids: 10751, cute: 10751, wholesome: 10751,
  fantasy: 14, magic: 14, dream: 14, myth: 14,
  history: 36, past: 36, ancient: 36, war: 36,
  horror: 27, scary: 27, fear: 27, dark: 27, creep: 27, blood: 27,
  music: 10402, song: 10402, musical: 10402,
  mystery: 9648, secret: 9648, twist: 9648, strange: 9648,
  romance: 10749, love: 10749, kiss: 10749, couple: 10749,
  scifi: 878, space: 878, future: 878, robot: 878, tech: 878, alien: 878,
  thriller: 53, suspense: 53, nervous: 53, tension: 53,
  western: 37, cowboy: 37, desert: 37
};

async function getKeywordId(word: string): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/search/keyword?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(word)}&page=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].id;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function discoverMoviesByEmotion(emotions: string[]) {
  const genreIds = new Set<number>();
  const keywordIds = new Set<number>();

  const rawWords = emotions
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);

  await Promise.all(rawWords.map(async (word) => {

    if (GENRE_MAP[word]) {
      genreIds.add(GENRE_MAP[word]);
      return;
    }

    const fuzzyMatch = Object.keys(GENRE_MAP).find(k => word.includes(k));
    if (fuzzyMatch) {
      genreIds.add(GENRE_MAP[fuzzyMatch]);
    }

    const keywordId = await getKeywordId(word);
    if (keywordId) {
      keywordIds.add(keywordId);
    }
  }));

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    sort_by: 'popularity.desc',
    include_adult: 'false',
    page: '1',
    'vote_count.gte': '10',
  });


  if (keywordIds.size > 0) {
    params.append('with_keywords', Array.from(keywordIds).join('|'));
  }

  if (genreIds.size > 0) {
    const joiner = keywordIds.size > 0 ? ',' : '|';
    params.append('with_genres', Array.from(genreIds).join(joiner));
  }

  let response = await fetch(`${BASE_URL}/discover/movie?${params}`);
  let data = await response.json();
  let discoverResults = data.results || [];

  const queryStr = emotions.join(' ').trim();
  let searchResults: any[] = [];
  if (queryStr.length > 0) {
    try {
      const sres = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(queryStr)}&page=1&include_adult=false`);
      const sdata = await sres.json();
      searchResults = sdata.results || [];
    } catch (e) {
      searchResults = [];
    }
  }

  const byId = new Map<number, any>();
  (discoverResults || []).forEach((m: any) => byId.set(m.id, { ...m, _source: 'discover' }));
  (searchResults || []).forEach((m: any) => {
    if (!byId.has(m.id)) byId.set(m.id, { ...m, _source: 'search' });
  });

  let results = Array.from(byId.values());

  if (results.length < 5 && genreIds.size > 0) {
    params.delete('with_keywords');
    params.set('with_genres', Array.from(genreIds).join('|'));
    response = await fetch(`${BASE_URL}/discover/movie?${params}`);
    data = await response.json();
    const fallback = data.results || [];
    fallback.forEach((m: any) => { if (!byId.has(m.id)) byId.set(m.id, { ...m, _source: 'fallback' }); });
    results = Array.from(byId.values());
  }

  if (results.length === 0) {
    response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
    data = await response.json();
    results = data.results || [];
  }

  const keywordSet = new Set(Array.from(keywordIds));
  const genreSet = new Set(Array.from(genreIds));
  const queryWords = new Set(rawWords);

  const scored = results.map((m: any) => {
    let score = 50;
    if (m.popularity) score += Math.min(20, Math.round(Math.log10(Math.max(1, m.popularity)) * 5));
    if (m.vote_average) score += Math.round(m.vote_average * 2);

    if (m.genre_ids && m.genre_ids.some((g: number) => genreSet.has(g))) score += 15;

    if (m.keyword_ids && m.keyword_ids.some((k: number) => keywordSet.has(k))) score += 12;

    const title = (m.title || '').toLowerCase();
    const overview = (m.overview || '').toLowerCase();
    let textMatches = 0;
    queryWords.forEach(w => { if (title.includes(w) || overview.includes(w)) textMatches++; });
    score += Math.min(12, textMatches * 6);

    score = Math.min(99, Math.max(1, Math.round(score)));

    return { movie: m, score };
  });

  scored.sort((a, b) => b.score - a.score || (a.movie._source === 'discover' ? -1 : 1));

  return scored.map(({ movie, score }) => formatMovieData(movie, emotions, score));
}

function formatMovieData(m: any, userEmotions: string[], matchScore?: number) {
  const genreNames = getGenreNames(m.genre_ids).slice(0, 2);
  const score = typeof matchScore === 'number' ? matchScore : (m.match || Math.min(99, Math.round(75 + (Math.random() * 15))));

  return {
    id: m.id,
    title: m.title,
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : m.poster || 'https://placehold.co/500x750/000000/FFFFFF/png?text=NO+IMAGE',
    year: m.release_date ? m.release_date.split('-')[0] : (m.year || 'UNKNOWN'),
    match: Math.min(99, Math.round(score)),
    tags: [...new Set([...userEmotions.slice(0, 2), ...genreNames])],
    overview: m.overview,
    rating: m.vote_average,
    pacing: (m.genre_ids || []).includes(28) || (m.genre_ids || []).includes(53) ? 'FAST' : 'STEADY',
    weight: (m.genre_ids || []).includes(18) || (m.genre_ids || []).includes(36) ? 'HEAVY' : 'LIGHT'
  };
}

function getGenreNames(ids: number[]): string[] {
  const names: Record<number, string> = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Docu", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
  };
  return (ids || []).map(id => names[id]).filter(Boolean);
}