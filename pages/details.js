import { createHeader } from './header.js';
import Storage from '../scripts/storage.js';

createHeader();

// Store the current movie details object
let currentMovie = null;

const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODExZmFlYmNmMDNhODk2ZjZiZGE5YWMxOWY3Nzk1ZCIsIm5iZiI6MTc3MjgwOTE2My40OCwic3ViIjoiNjlhYWViY2I2MzU2ZWI2OGMxNzdjODFhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.B4n3DVcJ3Sg4ts7fddWM66kGCvnKXC3G3hDulq-7Al0"; // replace with your key

function getIdFromUrl(url = window.location.href) {
  try {
    const parsed = new URL(url);

    // 1) Query param style: ?id=123
    const queryId = parsed.searchParams.get('id');
    if (queryId && /^\d+$/.test(queryId)) return Number(queryId);

    // 2) Path style: /details/123 or /movie/123
    const lastSegment = parsed.pathname.split('/').filter(Boolean).pop();
    if (lastSegment && /^\d+$/.test(lastSegment)) return Number(lastSegment);

    return null;
  } catch {
    return null;
  }
}

async function fetchMediaDetails(mediaId) {
  if (!mediaId) {
    console.error('Invalid media ID:', mediaId);
    return null;
  } else {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${mediaId}?language=en-US`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching media details:', error);
      return null;
    }
  }
}

async function renderMediaDetails(mediaDetails) {
    const detailsContainer = document.getElementById('detailsContainer');
    const poster = document.getElementById('poster-image');
    const title = document.getElementById('mediaTitle');
    const releaseDate = document.getElementById('releaseDate');
    const movieLength = document.getElementById('movieLength');
    const movieGenres = document.getElementById('movieGenres');
    const overview = document.getElementById('mediaOverview');
    
    // Store the current movie
    currentMovie = mediaDetails;
    
    if (mediaDetails) {
        poster.onerror = () => {
            poster.onerror = null;
            poster.src = 'img/poster_backup.png';
        };

        if (mediaDetails.poster_path) {
            poster.src = `https://image.tmdb.org/t/p/w500${mediaDetails.poster_path}`;
            poster.alt = mediaDetails.title || 'Poster';
        } else {
            poster.src = 'img/poster_backup.png';
            poster.alt = 'No Poster Available';
        }
        title.textContent = mediaDetails.title || 'No Title Available';
        overview.textContent = mediaDetails.overview || 'No Overview Available';
        releaseDate.textContent = mediaDetails.release_date ? `${mediaDetails.release_date} ` : 'Release Date: N/A';
        movieLength.textContent = mediaDetails.runtime ? `${mediaDetails.runtime} minutes ` : 'Runtime: N/A';
        if (mediaDetails.genres && mediaDetails.genres.length > 0) {
            movieGenres.innerHTML = `${mediaDetails.genres.map(g => g.name).join(' &middot ')}`;
        } else {
            movieGenres.textContent = 'Genres: N/A';
        }
        
        // Update button states based on storage status
        updateButtonStates();
    } else {
        title.textContent = 'Media Not Found';
        overview.textContent = '';
    }
}

function handleLayout() {
    const detailsMain = document.getElementById('detailsMain');
    if (window.innerWidth <= 770) {
        detailsMain.classList.add('details-narrow');
    } else {
        detailsMain.classList.remove('details-narrow');
    }
}

function updateButtonStates() {
    if (!currentMovie) return;

    // Update Watch Later button
    const watchLaterText = document.getElementById('watchLaterText');
    if (watchLaterText) {
        if (Storage.isInWatchLater(currentMovie.id)) {
            watchLaterText.textContent = 'Remove from';
        } else {
            watchLaterText.textContent = 'Add to';
        }
    }

    // Update Favorites button
    const favoriteText = document.getElementById('favoriteText');
    if (favoriteText) {
        if (Storage.isInFavorites(currentMovie.id)) {
            favoriteText.textContent = 'Remove from';
        } else {
            favoriteText.textContent = 'Add to';
        }
    }
}

function setupButtonListeners() {
    // Watch Later button
    const watchLaterBtn = document.getElementById('saveToWatchLaterBtn');
    watchLaterBtn.addEventListener('click', function() {
        if (!currentMovie) return;
        
        if (Storage.isInWatchLater(currentMovie.id)) {
            Storage.removeFromWatchLater(currentMovie.id);
        } else {
            Storage.addToWatchLater(currentMovie);
        }
        updateButtonStates();
    });

    // Favorites button
    const favoritesBtn = document.getElementById('addToFavoritesBtn');
    favoritesBtn.addEventListener('click', function() {
        if (!currentMovie) return;
        
        if (Storage.isInFavorites(currentMovie.id)) {
            Storage.removeFromFavorites(currentMovie.id);
        } else {
            Storage.addToFavorites(currentMovie);
        }
        updateButtonStates();
    });
}

async function main() {
    // Load stored lists from localStorage
    Storage.loadFavoriteMovies();
    Storage.loadWatchLaterMovies();

    const mediaId = getIdFromUrl();
    console.log('Parsed ID:', mediaId);
    if (mediaId) {
        const mediaDetails = await fetchMediaDetails(mediaId);
        console.log('Media Details:', mediaDetails);
        await renderMediaDetails(mediaDetails);
    }

    // Setup button event listeners
    setupButtonListeners();

    handleLayout();
    window.addEventListener('resize', handleLayout);
}

main();