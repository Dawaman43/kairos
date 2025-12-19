import { Movie, allMoods, emotionMappings } from '../data/movies';

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dot = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
  const norm1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
  const norm2 = Math.sqrt(vec2.reduce((sum, b) => sum + b * b, 0));
  return norm1 && norm2 ? dot / (norm1 * norm2) : 0;
}

function getMoodVector(moods: string[]): number[] {
  return allMoods.map(mood => moods.includes(mood) ? 1 : 0);
}

export function recommendMovies(selectedEmotions: string[], movies: Movie[]): Movie[] {
  if (selectedEmotions.length === 0) return movies.slice(0, 1);

  const emotionVectors = selectedEmotions.map(emotion => getMoodVector([emotion]));

  const movieScores = movies.map(movie => {
    const movieVec = getMoodVector(movie.moods);
    const similarities = emotionVectors.map(vec => cosineSimilarity(vec, movieVec));
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

    let score = avgSimilarity * 10;

    const pacings = selectedEmotions.map(e => emotionMappings[e]?.pacing).filter(Boolean);
    const weights = selectedEmotions.map(e => emotionMappings[e]?.weight).filter(Boolean);
    const avgPacing = pacings.length > 0 ? pacings[Math.floor(pacings.length / 2)] : 'medium';
    const avgWeight = weights.length > 0 ? weights[Math.floor(weights.length / 2)] : 'medium';

    if (movie.pacing === avgPacing) score += 2;
    if (movie.weight === avgWeight) score += 1;
    if (movie.runtime > 150) score -= 1;

    return { movie, score };
  });

  movieScores.sort((a, b) => b.score - a.score);
  return movieScores.map(s => s.movie);
}

export function getRecommendedMovies(selectedEmotions: string[], movies: Movie[], count: number = 5): Movie[] {
  if (selectedEmotions.length === 0) return movies.slice(0, count);

  const emotionVectors = selectedEmotions.map(emotion => getMoodVector([emotion]));

  const movieScores = movies.map(movie => {
    const movieVec = getMoodVector(movie.moods);
    const similarities = emotionVectors.map(vec => cosineSimilarity(vec, movieVec));
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

    let score = avgSimilarity * 10;


    const pacings = selectedEmotions.map(e => emotionMappings[e]?.pacing).filter(Boolean);
    const weights = selectedEmotions.map(e => emotionMappings[e]?.weight).filter(Boolean);
    const avgPacing = pacings.length > 0 ? pacings[Math.floor(pacings.length / 2)] : 'medium';
    const avgWeight = weights.length > 0 ? weights[Math.floor(weights.length / 2)] : 'medium';

    if (movie.pacing === avgPacing) score += 2;
    if (movie.weight === avgWeight) score += 1;
    if (movie.runtime > 150) score -= 1;

    return { movie, score };
  });

  movieScores.sort((a, b) => b.score - a.score);
  return movieScores.slice(0, count).map(s => s.movie);
}