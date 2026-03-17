function renderHeader() {
    let header = document.getElementById('header');
    header.innerHTML = `
        <header class="header">
            <span class="home-saved">
                <button id="home" class="material-symbols-outlined">home</button>
                <button id="saved" class="fontdiner-swanky-regular">My Lists</button>
            </span>
            <span class="searchBar fontdiner-swanky-regular">
                <input type="text" id="searchString" name="searchString" placeholder="Search (NOT IMPLEMENTED)" required>
                <button type="submit" id="searchButton" class="material-symbols-outlined">search</button>
            </span>
            <button id="settings" class="material-symbols-outlined">settings</button>
        </header>
    `;
}

function addHeaderFunctionality() {
    let homeBTN = document.getElementById('home');
    homeBTN.addEventListener('click', function (event) {
        window.location.href = 'index.html';
    });

    let myListsBTN = document.getElementById('saved');
    myListsBTN.addEventListener('click', function (event) {
        window.location.href = 'saved.html';
    });
}

function searchFunctionality(searchQuery) {
    console.log('Not Finished');
}

export function createHeader() {
    renderHeader();
    addHeaderFunctionality();
}