import { renderContentRow, setupContentRowResizeRerender } from '../scripts/rows.js';


const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODExZmFlYmNmMDNhODk2ZjZiZGE5YWMxOWY3Nzk1ZCIsIm5iZiI6MTc3MjgwOTE2My40OCwic3ViIjoiNjlhYWViY2I2MzU2ZWI2OGMxNzdjODFhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.B4n3DVcJ3Sg4ts7fddWM66kGCvnKXC3G3hDulq-7Al0'


function renderIndex(){
    let indexMain = document.getElementById(`indexMain`)
}

// Converts user input into a safe positive integer count.
function clampRequestedAmount(amount) {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 0;
    }
    return Math.floor(parsed);
}

// Fetches paginated movie results from TMDB and returns only the requested amount.
async function fetchMoviePages(endpointPath, amount, queryParams = {}) {
    const requestedAmount = clampRequestedAmount(amount);
    if (requestedAmount === 0) {
        return [];
    }

    const collected = [];
    let page = 1;
    let totalPages = 1;

    while (collected.length < requestedAmount && page <= totalPages) {
        const params = new URLSearchParams({
            language: 'en-US',
            page: String(page),
            ...queryParams
        });

        const response = await fetch(`https://api.themoviedb.org/3/${endpointPath}?${params.toString()}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`TMDB request failed (${response.status}) for ${endpointPath}`);
        }

        const data = await response.json();
        totalPages = data.total_pages || 1;

        if (Array.isArray(data.results) && data.results.length > 0) {
            collected.push(...data.results);
        } else {
            break;
        }

        page += 1;
    }

    return collected.slice(0, requestedAmount);
}

// Gets a default popular movie list used across the index page.
async function getPopularMovies() {
    return fetchPopularContent(20);
}

// Builds the featured banner carousel from popular movies.
async function renderFeaturedBanner(popularMoviesArg) {
    const popularMovies = popularMoviesArg || await getPopularMovies();
    const carouselBannerContent = document.getElementById('carouselBannerContent');
    carouselBannerContent.innerHTML = '';

    const bannerMovieCount = Math.min(5, popularMovies.length);

    for (let i = 0; i < bannerMovieCount; i++) {
        const movie = popularMovies[i];
        const movieId = movie?.id;
        const detailsHref = movieId ? `details.html?id=${encodeURIComponent(movieId)}` : '#';
        const title = movie?.title || movie?.name || `Slide ${i + 1}`;
        const backdropSrc = movie?.backdrop_path
            ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
            : 'img/banner_backup.png';

        carouselBannerContent.innerHTML += `
        <div id="Banner${i + 1}" class="carousel-item ${i === 0 ? 'active' : ''}">
            <a href="${detailsHref}" class="d-block text-decoration-none text-reset" aria-label="View details for ${title}">
                <img id="BannerImage${i + 1}" class="d-block w-100" src="${backdropSrc}" alt="${title}" onerror="this.onerror=null;this.src='img/banner_backup.png';">
                <div class="carousel-caption banner-caption">
                    <h5 id="BannerTitle${i + 1}">${title}</h5>
                </div>
            </a>
        </div>
        `;
    }
}

// Fetches movies for a specific TMDB numeric genre id.
async function fetchContentByCategory(category, amount){
    // TMDB categories use numeric genre IDs (ex: Action=28, Comedy=35).
    const genreId = Number(category);
    if (!Number.isInteger(genreId)) {
        throw new Error('Category must be a TMDB numeric genre id.');
    }

    return fetchMoviePages('discover/movie', amount, {
        with_genres: String(genreId),
        sort_by: 'popularity.desc',
        include_adult: 'false',
        include_video: 'false'
    });
}

// Fetches a popular movies list for content rows.
async function fetchPopularContent(amount){
    return fetchMoviePages('movie/popular', amount, {
        include_adult: 'false',
        include_video: 'false'
    });
}

// Fetches "new" movies using TMDB now_playing endpoint.
async function fetchNewContent(amount){
    // Using now_playing as the "new" list for theatrical releases.
    return fetchMoviePages('movie/now_playing', amount, {
        include_adult: 'false',
        include_video: 'false'
    });
}

// Fetches available movie genres from TMDB.
async function fetchMovieGenres() {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`TMDB genres request failed (${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data.genres) ? data.genres : [];
}

// Returns a random subset of genres with the requested count.
function pickRandomGenres(genres, count) {
    const shuffled = [...genres].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Provides a local fallback list when genre fetch is unavailable.
function getFallbackGenres() {
    return [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
        { id: 27, name: 'Horror' },
        { id: 878, name: 'Sci-Fi' }
    ];
}

// Main page bootstrap: fetches content, renders rows, and enables resize rerender.
export async function renderHome(){
    const rowFetchAmount = 32;
    const popularMovies = await getPopularMovies();
    await renderFeaturedBanner(popularMovies);

    const newMoviesPromise = fetchNewContent(rowFetchAmount);
    const popularRowPromise = fetchPopularContent(rowFetchAmount);
    const genresPromise = fetchMovieGenres();

    const [newMovies, popularRowMovies, genres] = await Promise.all([
        newMoviesPromise,
        popularRowPromise,
        genresPromise
    ]);

    await renderContentRow(newMovies, 'New Movies', 'row-new', 'poster-row-a');
    await renderContentRow(popularRowMovies, 'Popular Movies', 'row-popular', 'poster-row-b');

    const genresSource = genres.length >= 5 ? genres : getFallbackGenres();
    const randomGenres = pickRandomGenres(genresSource, 5);
    const genreRows = await Promise.all(
        randomGenres.map(async (genre) => {
            const genreMovies = await fetchContentByCategory(genre.id, rowFetchAmount);
            return {
                rowId: `row-genre-${genre.id}`,
                heading: genre.name,
                content: genreMovies
            };
        })
    );

    for (let i = 0; i < genreRows.length; i++) {
        const row = genreRows[i];
        const alternatingClass = i % 2 === 0 ? 'poster-row-a' : 'poster-row-b';
        await renderContentRow(row.content, row.heading, row.rowId, alternatingClass);
    }

    setupContentRowResizeRerender();
}
