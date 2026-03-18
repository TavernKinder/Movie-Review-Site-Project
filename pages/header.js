// Renders the shared top navigation and search controls.
function renderHeader() {
    let header = document.getElementById('header');
    header.innerHTML = `
        <header class="header">
            <span class="home-saved">
                <button id="home" class="material-symbols-outlined">home</button>
                <button id="saved" class="fontdiner-swanky-regular">My Lists</button>
            </span>
            <span class="searchBar fontdiner-swanky-regular">
                <input type="text" id="searchString" name="searchString" placeholder="Search movies" required>
                <button type="submit" id="searchButton" class="material-symbols-outlined">search</button>
            </span>
            <button id="settings" class="material-symbols-outlined">settings</button>
        </header>
    `;
}

// Wires navigation buttons and search interactions for the header UI.
function addHeaderFunctionality() {
    let homeBTN = document.getElementById('home');
    homeBTN.addEventListener('click', function (event) {
        window.location.href = 'index.html';
    });

    let myListsBTN = document.getElementById('saved');
    myListsBTN.addEventListener('click', function (event) {
        window.location.href = 'saved.html';
    });

    const searchInput = document.getElementById('searchString');
    const searchButton = document.getElementById('searchButton');

    const params = new URLSearchParams(window.location.search);
    const currentQuery = (params.get('search') || '').trim();
    if (currentQuery) {
        searchInput.value = currentQuery;
    }

    // Navigates to index search mode using the current input value.
    const runSearch = () => {
        const query = searchInput.value.trim();
        if (!query) {
            return;
        }
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    };

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        runSearch();
    });

    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            runSearch();
        }
    });
}

// Public entrypoint for drawing the header and attaching handlers.
export function createHeader() {
    renderHeader();
    addHeaderFunctionality();
}