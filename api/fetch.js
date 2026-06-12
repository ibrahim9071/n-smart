export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    
    const API_KEY = process.env.TMDB_API_KEY || 'Buraya Api Key Gir';
    
    const BASE_URL = 'https://api.themoviedb.org/3';

    const {
        action,
        type,
        mode,
        page = 1,
        query,
        with_genres,
        primary_release_year,
        with_original_language,
        exclude_anime,
        language = 'tr-TR',        // Varsayılan Türkçe
        with_keywords              // Türkçe dublaj/altyazı için
    } = req.query;

    let target_url = '';

    // Dil parametresini ekle
    const langParam = `&language=${language}`;

    if (action === 'search') {

        target_url =
            `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}${langParam}`;

    } else if (action === 'south') {

        target_url =
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=te|ta|ml|kn&sort_by=popularity.desc&page=${page}${langParam}`;

    } else {

        if (type === 'trending') {

            target_url =
                `${BASE_URL}/trending/${mode}/week?api_key=${API_KEY}&page=${page}${langParam}`;

        } else {

            target_url =
                `${BASE_URL}/discover/${mode}?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}${langParam}`;
        }
    }

    // Türkçe Dublaj/Altyazı keyword filtresi
    if (with_keywords) {
        target_url += `&with_keywords=${encodeURIComponent(with_keywords)}`;
    }

    if (with_genres) {
        target_url += `&with_genres=${with_genres}`;
    }

    if (primary_release_year) {

        if (mode === 'movie') {

            target_url += `&primary_release_year=${primary_release_year}`;

        } else {

            target_url += `&first_air_date_year=${primary_release_year}`;
        }
    }

    if (with_original_language) {
        target_url += `&with_original_language=${with_original_language}`;
    }

    if (exclude_anime === 'true') {
        target_url += `&without_genres=16`;
    }

    try {

        const response = await fetch(target_url);

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {

        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
}
