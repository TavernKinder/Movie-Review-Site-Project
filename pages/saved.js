import { createHeader } from './header.js';
import Storage from '../storage/storage.js';
import { renderContentRow, setupContentRowResizeRerender } from '../scripts/rows.js';

createHeader();

// Shows an empty-state message block when a saved list has no movies.
function showEmptyMessage(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

// Loads saved lists from storage and renders each row or its empty-state fallback.
async function main() {
    Storage.loadFavoriteMovies();
    Storage.loadWatchLaterMovies();

    const favorites = Storage.getFavoriteMovies();
    const watchLater = Storage.getWatchLaterMovies();

    if (favorites.length > 0) {
        await renderContentRow(favorites, 'Favorites', 'favorites-row', 'poster-row-a');
    } else {
        showEmptyMessage('favorites-empty');
    }

    if (watchLater.length > 0) {
        await renderContentRow(watchLater, 'Watch Later', 'watchlater-row', 'poster-row-b');
    } else {
        showEmptyMessage('watchlater-empty');
    }

    setupContentRowResizeRerender();
}

main();
