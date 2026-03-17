// Initialize global arrays for storing movie lists
let favoriteMovies = [];
let watchLaterMovies = [];

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
}

export default Storage;





