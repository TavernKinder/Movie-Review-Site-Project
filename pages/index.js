import { createHeader } from './header.js';
createHeader();


import { renderHome } from './home.js';
import { renderSearch } from './search.js';

// Builds the home page shell that search and home rendering both target.
function homeInitiate() {
    const main = document.getElementById('indexMain');
    main.innerHTML = `
            <div id="featured-content" class="featured-content">
                <div id="carouselBanner" class="carousel slide" data-bs-ride="carousel">
                    <div id="carouselBannerContent" class="carousel-inner">
                        <!-- Carousel items will be dynamically inserted here -->
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselBanner" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselBanner" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                    </div>
            </div>
                <div id="content-rows-root"></div>`;
}

// Boots the page and routes to search mode when a search query exists.
async function main() {
    homeInitiate();

    const params = new URLSearchParams(window.location.search);
    const searchQuery = (params.get('search') || '').trim();

    if (searchQuery) {
        await renderSearch(searchQuery);
        return;
    }

    await renderHome();
}

main();