import { createHeader } from './header.js';
import Storage from '../scripts/storage.js';
import { renderContentRow, setupContentRowResizeRerender } from '../scripts/rows.js';

createHeader();

function showEmptyMessage(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

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
