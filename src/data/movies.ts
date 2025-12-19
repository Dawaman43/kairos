export interface Movie {
  id: number;
  title: string;
  poster: string;
  youtubeId: string;
  moods: string[];
  pacing: 'slow' | 'medium' | 'fast';
  weight: 'light' | 'medium' | 'heavy';
  year: number;
  runtime: number;
  origin?: string;
}

export const movies: Movie[] = [
  {
    id: 278,
    title: "The Shawshank Redemption",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    youtubeId: "PLl99Dyc6iQ",
    moods: ["hopeful", "reflective"],
    pacing: "slow",
    weight: "heavy",
    year: 1994,
    runtime: 142,
    origin: "Portland_Sector"
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    youtubeId: "EXeTwQWrcwY",
    moods: ["anxious", "restless"],
    pacing: "fast",
    weight: "medium",
    year: 2008,
    runtime: 152,
    origin: "Gotham_Core"
  },
  {
    id: 13,
    title: "Forrest Gump",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    youtubeId: "bLvqoHBptjg",
    moods: ["hopeful", "calm"],
    pacing: "medium",
    weight: "light",
    year: 1994,
    runtime: 142,
    origin: "Alabama_Node"
  },
  {
    id: 238,
    title: "The Godfather",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    youtubeId: "UaVTIH8mujA",
    moods: ["heavy", "reflective"],
    pacing: "slow",
    weight: "heavy",
    year: 1972,
    runtime: 175,
    origin: "NewYork_Sector"
  },
  {
    id: 550,
    title: "Fight Club",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    youtubeId: "qtRKdVHc-cE",
    moods: ["anxious", "restless"],
    pacing: "fast",
    weight: "medium",
    year: 1999,
    runtime: 139,
    origin: "Industrial_Zone"
  },
  {
    id: 680,
    title: "Pulp Fiction",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    youtubeId: "tGpTpVyI_OQ",
    moods: ["anxious", "curious"],
    pacing: "fast",
    weight: "medium",
    year: 1994,
    runtime: 154,
    origin: "LA_Sector"
  },
  {
    id: 122,
    title: "LOTR: Return of the King",
    poster: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    youtubeId: "r5X-hFf6Bwo",
    moods: ["hopeful", "heavy"],
    pacing: "medium",
    weight: "heavy",
    year: 2003,
    runtime: 201,
    origin: "Middle_Earth_Node"
  },
  {
    id: 27205,
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    youtubeId: "YoHD9XEInc0",
    moods: ["anxious", "curious"],
    pacing: "medium",
    weight: "medium",
    year: 2010,
    runtime: 148,
    origin: "Dream_State_01"
  },
  {
    id: 157336,
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    youtubeId: "zSWdZVtXT7E",
    moods: ["hopeful", "heavy"],
    pacing: "slow",
    weight: "heavy",
    year: 2014,
    runtime: 169,
    origin: "Deep_Space_Buffer"
  },
  {
    id: 496243,
    title: "Parasite",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    youtubeId: "5xH0HfJHsaY",
    moods: ["anxious", "heavy"],
    pacing: "medium",
    weight: "heavy",
    year: 2019,
    runtime: 132,
    origin: "Seoul_Sector"
  },
  {
    id: 324857,
    title: "Spirited Away",
    poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    youtubeId: "ByXuk9QqQkk",
    moods: ["hopeful", "curious"],
    pacing: "medium",
    weight: "light",
    year: 2001,
    runtime: 125,
    origin: "Spirit_Realm"
  },
  {
    id: 475557,
    title: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    youtubeId: "zAGVQLHvwOY",
    moods: ["numb", "heavy"],
    pacing: "medium",
    weight: "heavy",
    year: 2019,
    runtime: 122,
    origin: "Gotham_Sublevel"
  },
  {
    id: 372058,
    title: "Your Name",
    poster: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    youtubeId: "s0wTdCQoc2k",
    moods: ["hopeful", "calm"],
    pacing: "medium",
    weight: "light",
    year: 2016,
    runtime: 106,
    origin: "Tokyo_Uplink"
  },
  {
    id: 603,
    title: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    youtubeId: "vKQi3bBA1y8",
    moods: ["anxious", "curious"],
    pacing: "fast",
    weight: "medium",
    year: 1999,
    runtime: 136,
    origin: "Sim_Core_01"
  },
  {
    id: 769,
    title: "GoodFellas",
    poster: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    youtubeId: "2ilzidi_J8Q",
    moods: ["restless", "heavy"],
    pacing: "fast",
    weight: "medium",
    year: 1990,
    runtime: 146,
    origin: "Liberty_Sector"
  }
];

export const allMoods = ['restless', 'heavy', 'empty', 'hopeful', 'numb', 'anxious', 'calm', 'curious', 'tired'];

export const emotionMappings: Record<string, { pacing: string; weight: string }> = {
  restless: { pacing: 'fast', weight: 'light' },
  heavy: { pacing: 'slow', weight: 'heavy' },
  empty: { pacing: 'slow', weight: 'medium' },
  hopeful: { pacing: 'medium', weight: 'light' },
  numb: { pacing: 'slow', weight: 'medium' },
  anxious: { pacing: 'fast', weight: 'medium' },
  calm: { pacing: 'slow', weight: 'light' },
  curious: { pacing: 'medium', weight: 'light' },
  tired: { pacing: 'slow', weight: 'medium' }
};