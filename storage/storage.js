// Initialize global arrays for storing movie lists
let favoriteMovies = [];
let watchLaterMovies = [];
let movieComments = {};
let movieRatings = {};

// Converts movie ids into stable object keys for keyed maps.
function normalizeMovieId(movieId) {
    return String(movieId);
}

// Validates and rounds user ratings to a supported 1-5 star integer.
function clampRating(rating) {
    const parsed = Number(rating);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    const rounded = Math.round(parsed);
    if (rounded < 1 || rounded > 5) {
        return null;
    }
    return rounded;
}

class Storage {
    // Save favorite movies to localStorage
    static saveFavoriteMovies() {
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    }
    // Load favorite movies from localStorage
    static loadFavoriteMovies() {
        const storedFavorites = localStorage.getItem('favoriteMovies');
        if (storedFavorites) {
            favoriteMovies = JSON.parse(storedFavorites);
        }
    }
    // Save watch later movies to localStorage
    static saveWatchLaterMovies() {
        localStorage.setItem('watchLaterMovies', JSON.stringify(watchLaterMovies));
    }
    // Load watch later movies from localStorage
    static loadWatchLaterMovies() {
        const storedWatchLater = localStorage.getItem('watchLaterMovies');
        if (storedWatchLater) {
            watchLaterMovies = JSON.parse(storedWatchLater);
        }
    }

    // Save all movie comments to localStorage keyed by movie id.
    static saveMovieComments() {
        localStorage.setItem('movieComments', JSON.stringify(movieComments));
    }

    // Load movie comments from localStorage.
    static loadMovieComments() {
        const storedMovieComments = localStorage.getItem('movieComments');
        if (storedMovieComments) {
            movieComments = JSON.parse(storedMovieComments);
        }
    }

    // Save all movie ratings to localStorage keyed by movie id.
    static saveMovieRatings() {
        localStorage.setItem('movieRatings', JSON.stringify(movieRatings));
    }

    // Load movie ratings from localStorage.
    static loadMovieRatings() {
        const storedMovieRatings = localStorage.getItem('movieRatings');
        if (storedMovieRatings) {
            movieRatings = JSON.parse(storedMovieRatings);
        }
    }

    // Initialize all storage-backed collections.
    static loadAll() {
        this.loadFavoriteMovies();
        this.loadWatchLaterMovies();
        this.loadMovieComments();
        this.loadMovieRatings();
    }

    // Add movie to favorites
    static addToFavorites(movie) {
        if (!this.isInFavorites(movie.id)) {
            favoriteMovies.push(movie);
            this.saveFavoriteMovies();
            return true;
        }
        return false;
    }

    // Remove movie from favorites
    static removeFromFavorites(movieId) {
        const index = favoriteMovies.findIndex(movie => movie.id === movieId);
        if (index > -1) {
            favoriteMovies.splice(index, 1);
            this.saveFavoriteMovies();
            return true;
        }
        return false;
    }

    // Check if movie is in favorites
    static isInFavorites(movieId) {
        return favoriteMovies.some(movie => movie.id === movieId);
    }

    // Add movie to watch later
    static addToWatchLater(movie) {
        if (!this.isInWatchLater(movie.id)) {
            watchLaterMovies.push(movie);
            this.saveWatchLaterMovies();
            return true;
        }
        return false;
    }

    // Remove movie from watch later
    static removeFromWatchLater(movieId) {
        const index = watchLaterMovies.findIndex(movie => movie.id === movieId);
        if (index > -1) {
            watchLaterMovies.splice(index, 1);
            this.saveWatchLaterMovies();
            return true;
        }
        return false;
    }

    // Check if movie is in watch later
    static isInWatchLater(movieId) {
        return watchLaterMovies.some(movie => movie.id === movieId);
    }

    // Get all favorite movies
    static getFavoriteMovies() {
        return favoriteMovies;
    }

    // Get all watch later movies
    static getWatchLaterMovies() {
        return watchLaterMovies;
    }

    // Create or update a comment linked to a specific movie id.
    static setMovieComment(movieId, commentText) {
        if (movieId === null || movieId === undefined) {
            return false;
        }

        const id = normalizeMovieId(movieId);
        const normalizedComment = String(commentText || '').trim();
        movieComments[id] = normalizedComment;
        this.saveMovieComments();
        return true;
    }

    // Read a comment for a specific movie id.
    static getMovieComment(movieId) {
        const id = normalizeMovieId(movieId);
        return movieComments[id] || '';
    }

    // Remove a saved comment for a specific movie id.
    static removeMovieComment(movieId) {
        const id = normalizeMovieId(movieId);
        if (!(id in movieComments)) {
            return false;
        }

        delete movieComments[id];
        this.saveMovieComments();
        return true;
    }

    // Return all comments keyed by movie id.
    static getAllMovieComments() {
        return { ...movieComments };
    }

    // Create or update a 1-5 star rating linked to a specific movie id.
    static setMovieRating(movieId, rating) {
        if (movieId === null || movieId === undefined) {
            return false;
        }

        const clamped = clampRating(rating);
        if (clamped === null) {
            return false;
        }

        const id = normalizeMovieId(movieId);
        movieRatings[id] = clamped;
        this.saveMovieRatings();
        return true;
    }

    // Read a rating for a specific movie id.
    static getMovieRating(movieId) {
        const id = normalizeMovieId(movieId);
        return movieRatings[id] || null;
    }

    // Remove a saved rating for a specific movie id.
    static removeMovieRating(movieId) {
        const id = normalizeMovieId(movieId);
        if (!(id in movieRatings)) {
            return false;
        }

        delete movieRatings[id];
        this.saveMovieRatings();
        return true;
    }

    // Return all ratings keyed by movie id.
    static getAllMovieRatings() {
        return { ...movieRatings };
    }
}

export default Storage;
