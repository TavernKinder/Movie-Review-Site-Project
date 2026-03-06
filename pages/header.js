function renderHeader(){
    let header = document.getElementById('header')
    header.innerHTML = `
            <header class="header">
            <span class="home-saved">
                <button id="home" class="material-symbols-outlined">home</button>
                <button id="saved">My Lists</button>
            </span>
            <span class="searchBar">
                <input type="text" id="searchString" name="searchString" placeholder="Search">
                <button type="submit" id="searchButton" class="material-symbols-outlined">search</button>
            </span>
            <button id="settings" class="material-symbols-outlined">settings</button>
        </header>
    `;
}

function addHeaderFunctionality(){
    let homeBTN = document.getElementById('home')
    homeBTN.addEventListener(`click`, function(event){
        window.location.href='index.html';
    })
    //////////// SEARCH FUNCTIONALITY ADD HERE
    //////////////////////////////////
    //////////////////////////
    let myListsBTN = document.getElementById('saved')
    myListsBTN.addEventListener('click', function(event){
        onclick=window.location.href='saved.html'
    })
}

function searchFunctionality(searchQuery){
    console.log('Not Finnished')
}

export function createHeader(){
    renderHeader();
    addHeaderFunctionality();
}