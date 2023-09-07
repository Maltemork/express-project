"use strict";

import {
    getArtists,
    updateArtist,
    submitNewArtist,
    deleteArtist,
    editArtist
} from "./rest.js";

let artistsArray = [];
let favoritesArray = [];


window.addEventListener("load", startFunction);

async function startFunction() {
    // eventlisteners
    console.log("Javascript is running 👍");

    

    artistsArray = await getArtists();

    filterInArray(artistsArray);

    fillFavoritesArray(artistsArray);

    startEventListeners();

    document.querySelector("#filterArtists").addEventListener("change", () => {filterInArray(artistsArray)})

    document.querySelector("#sortBy").addEventListener("change", () => {filterInArray(artistsArray);});

    document.querySelector("#searchField").addEventListener("input", () => {filterInArray(artistsArray)});
}

function startEventListeners() {
    // Navigation buttons in the header.
    document.querySelector("#nav-frontpage").addEventListener("click", async function() { 
        artistsArray = await getArtists();
        filterInArray(artistsArray); 
        changeView("frontpage");});

    document.querySelector("#nav-create").addEventListener("click", () => { changeView("create"); });
    document.querySelector("#nav-favorites").addEventListener("click", async() => { artistsArray = await getArtists(); fillFavoritesArray(artistsArray); changeView("favorites"); });

    // Submit event for create new artist form.
    document.querySelector("#form-container").addEventListener("submit", (event) => {
        submitNewArtist(event);
    })

    // Eventlistener for NO button in delete dialog.
    document.querySelector("#btn-no").addEventListener("click", () => {
        document.querySelector("#dialog-delete-artist").close();});

    // Close delete dialog
    document.querySelector("#close-delete-button").addEventListener("click", () => {
        document.querySelector("#dialog-delete-artist").close();});
    
    // Close edit dialog
    document.querySelector("#close-edit-button").addEventListener("click", () => {
        document.querySelector("#edit-artist-dialog").close();});

    
    
    // Change sort type.
    
}

// Whether you search, filter or sort, the process is the same.
// First it will check if there are filters applied. If yes, it will filter the array and supply it into the search function.
// The search function takes the previous filtered array and checks if there is an input in the search field.
// If there is an input in the search field, it will filter the filtered array with the search input.
// After this is done, the now double-filtered array will be passed through the sort function to check for sorts.
// After sorting the double-filtered array, it will be displayed on the website.
// This way all 3 functions will be able to work at the same time - you can now filter, search and sort all at once!

//filter in array.
function filterInArray(array) {
    let filter = document.querySelector("#filterArtists").value;

    if (filter == "all") {
        searchInArray(array);
    } else {
        let filteredArray= array.filter((obj) => obj.genres.toLowerCase().includes(filter));
        searchInArray(filteredArray);
    }
}

// search array
function searchInArray(array) {
    // Define input
    let searchInput = document.querySelector("#searchField").value.toLowerCase();
    // Define filtered array based on input.
    let filteredArray= array.filter((obj) => obj.name.toLowerCase().includes(searchInput));
    // Check if there is any input in the searchfield, if no just pass array through, if yes apply filter.
    if (searchInput === 0) {
        sortArray(array);
    } else {
        sortArray(filteredArray);
    }
}

// Sort array
function sortArray(array) {
    console.log(array);
    const sortType = document.querySelector("#sortBy").value;
    
    if (sortType == "default") {
        displayArtists(array.sort((a, b) => a.id - b.id));
    }
    if (sortType == "name-reverse") {
      displayArtists(array.sort((a, b) => b.name.localeCompare(a.name)));
    }
    if (sortType == "name") {
      displayArtists(array.sort((a, b) => a.name.localeCompare(b.name)));
    }
    if (sortType == "age") {
        displayArtists(array.sort((a, b) => a.birthdate.localeCompare(b.birthdate)));
    }
    if (sortType == "activeSince") {
        displayArtists(array.sort((a, b) => a.activeSince  - b.activeSince));
    }
}



// Display artists.
function displayArtists(list) {
    // Clear grid
    document.querySelector("#main-content-grid").innerHTML = "";
    
    // insert HTML for each item in globalArtistsArray.
    for (const artist of list) { 
        // define the element we will place on the website.
        let HTMLelement = /* HTML */ `
            <article class="grid-item-artist" id="artist-${artist.id}">
                <img src="${artist.image}">
                <p>
                    <a href="${artist.website}">${artist.website}</a>
                </p>
                
                    <h2 class="artist-title">${artist.name}</h2>
                    
                    <h3>${artist.shortDescription}</h3>
                    <div class="artist-text-container">
                    <p>Born: ${artist.birthdate}</p>
                    <p>Active since: ${artist.activeSince}</p>
                    <p>Genres: ${artist.genres} </p>
                    <p>Label: ${artist.label}</p>
                    </div>
                    
        
                    <div class="btns">
                    
                        <button class="btn-update">🖊</button>
                        <button class="btn-delete">🗑</button>
                        <button class="btn-favorite" id="fav-btn-${artist.id}">♥</button>
                    </div> 
            </article>
        `;
        document.querySelector("#main-content-grid").insertAdjacentHTML(
            "beforeend", HTMLelement);

        if (artist.favorite === true) {
            document.querySelector("#main-content-grid article:last-child .btn-favorite").classList.add("favorite");
        }

        // edit button
        document
            .querySelector("#main-content-grid article:last-child .btn-update")
            .addEventListener("click", () => editArtistClicked(artist));

        // delete button
        document
            .querySelector("#main-content-grid article:last-child .btn-delete")
            .addEventListener("click", () => deleteArtistClicked(artist));
        // add to favorites button
        document
            .querySelector("#main-content-grid article:last-child .btn-favorite")
            .addEventListener("click", () => {addToFavoritesClicked(artist);
                
            });
        
    }
}

// Edit button clicked on a specific artist.
function editArtistClicked(artist) {
    // show dialog.
    document.querySelector("#edit-artist-dialog").showModal();

    // Change title
    document.querySelector("#edit-title").textContent = `Editing post for ${artist.name}`;

    // Fill out form
    let form = document.querySelector("#edit-container");

    form.name.value = artist.name;
    form.description.value = artist.shortDescription;
    form.birthdate.value = artist.birthdate;
    form.activeSince.value = artist.activeSince;
    form.genres.value = artist.genres;
    form.label.value = artist.label;
    form.image.value = artist.image;
    form.website.value = artist.website;

    

    // Submit edited artist.
    document.querySelector("#edit-container").addEventListener("submit", async(event) => {
        event.preventDefault();

        let updatedArtist = {
            "id": artist.id,
            "name": form.name.value,
            "shortDescription": form.description.value,
            "birthdate": form.birthdate.value,
            "activeSince": form.activeSince.value,
            "genres": form.genres.value,
            "label": form.label.value,
            "image": form.image.value,
            "website": form.website.value,
        }

        document.querySelector("#edit-artist-dialog").close();

        await editArtist(updatedArtist);
        artistsArray = await getArtists();
        sortArray(artistsArray);
    });

        

 }

 

// Delete button clicked on a specific artist.
function deleteArtistClicked(artist) {
    // Check if button works.
    console.log(`You are about to delete the artist post for ${artist.name} with id: ${artist.id}`);

    // Show dialog for deleting an artist.
    document.querySelector("#dialog-delete-artist").showModal();

    // Display artist information in dialog.
    document.querySelector("#dialog-delete-artist-name").textContent =
    `You are about to delete the artist post for ${artist.name} (ID: ${artist.id})`;
    
    // If YES is pressed, use the delete function made in rest.js
    document
    .querySelector("#form-delete-artist")
    .addEventListener("submit", (event) => {
        event.preventDefault();
        
        deleteArtist(artist.id);
        document.querySelector("#dialog-delete-artist").close();
    });
}

// Fill the favorites array.

function fillFavoritesArray(list) {
    favoritesArray.length = 0;
    for (const artist of list) {
        if (artist.favorite == true) {
            favoritesArray.push(artist)
        }
    }

    displayFavorites(favoritesArray);
}


// Display favorites array.

function displayFavorites(list) {
    // Clear grid
    document.querySelector("#favorites-content-grid").innerHTML = "";
    
    // insert HTML for each item in globalArtistsArray.
    for (const artist of list) { 
        // define the element we will place on the website.
        let HTMLelement = /* HTML */ `
            <article class="grid-item-artist" id="fav-artist-${artist.id}">
                <img src="${artist.image}">
                <p>
                    <a href="${artist.website}">${artist.website}</a>
                </p>
                
                    <h2 class="artist-title">${artist.name}</h2>
                    
                    <h3>${artist.shortDescription}</h3>
                    <div class="artist-text-container">
                    <p>Born: ${artist.birthdate}</p>
                    <p>Active since: ${artist.activeSince}</p>
                    <p>Genres: ${artist.genres} </p>
                    <p>Label: ${artist.label}</p>
                    </div>
                    
        
                    <div class="btns">
                    
                        <button class="btn-update">🖊</button>
                        <button class="btn-delete">🗑</button>
                        <button class="btn-favorite">♥</button>
                    </div> 
            </article>
        `;
        document.querySelector("#favorites-content-grid").insertAdjacentHTML(
            "beforeend", HTMLelement);

        if (artist.favorite === true) {
            document.querySelector("#favorites-content-grid article:last-child .btn-favorite").classList.add("favorite");
        }

        document
            .querySelector("#favorites-content-grid article:last-child .btn-delete")
            .addEventListener("click", () => deleteArtistClicked(artist));
        
        document
        .querySelector("#favorites-content-grid article:last-child .btn-favorite")
        .addEventListener("click", (event) => {
            addToFavoritesClicked(artist);
        });
        
    }
}

// Add to favorites clicked

function addToFavoritesClicked(artist) {
    // Console log what artist we are  checking.
    
    // Change favorite state for object.
    if (artist.favorite == true) {
        console.log(`Removed ${artist.name} from favorites.`);
        artist.favorite = false;
        document.querySelector(`#fav-btn-${artist.id}`).classList.remove("favorite");
        document.querySelector(`#fav-artist-${artist.id}`).remove();
        updateArtist(artist);
    } else {
        console.log(`Liked ${artist.name} and added to favorites.`);
        document.querySelector(`#fav-btn-${artist.id}`).classList.add("favorite");
        artist.favorite = true;
        updateArtist(artist);
    }
    // Update artist in server.
    
  }


function changeView(section) {
    console.log(section);
    // Hide all sections
    document.querySelector("#frontpage-section").classList.value = "hidden";
    document.querySelector("#create-section").classList.value = "hidden";
    document.querySelector("#edit-section").classList.value = "hidden";
    document.querySelector("#favorites-section").classList.value = "hidden";
    
    // Show selected section
    document.querySelector(`#${section}-section`).classList.remove("hidden");

    // Active class.
    document.querySelector(`#nav-frontpage`).classList.remove("active");
    document.querySelector(`#nav-create`).classList.remove("active");
    document.querySelector(`#nav-favorites`).classList.remove("active");
    document.querySelector(`#nav-${section}`).classList.add("active");
}

export {
    displayArtists,
    sortArray,
    artistsArray,
    changeView
}