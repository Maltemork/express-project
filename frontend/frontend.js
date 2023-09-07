"use strict";

import {
    getArtists,
    updateArtist,
    submitNewArtist,
    deleteArtist
} from "./rest.js";

let sortType = "default";
let artistsArray = [];
let favoritesArray = [];


window.addEventListener("load", startFunction);

async function startFunction() {
    // eventlisteners
    console.log("Javascript is running 👍");

    

    let artistsArray = await getArtists();

    sortArray(artistsArray);

    fillFavoritesArray(artistsArray);

    startEventListeners();

    document.querySelector("#sortBy").addEventListener("change", () => {sortArray(artistsArray);});

    document.querySelector("#searchField").addEventListener("input", () => {searchInArray(artistsArray)});
}

function startEventListeners() {
    // Navigation buttons in the header.
    document.querySelector("#nav-frontpage").addEventListener("click", async function() { 
        artistsArray = await getArtists();
        sortArray(artistsArray); 
        changeView("frontpage");});
    document.querySelector("#nav-create").addEventListener("click", () => { changeView("create"); });
    document.querySelector("#nav-favorites").addEventListener("click", async() => { artistsArray = await getArtists(); fillFavoritesArray(artistsArray); sortArray(artistsArray); changeView("favorites"); });

    // Submit event for create new artist form.
    document.querySelector("#form-container").addEventListener("submit", submitNewArtist)

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

// Sort array

function sortArray(array) {
    console.log("hej")
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

function searchInArray(array) {
    let searchInput = document.querySelector("#searchField").value.toLowerCase();
    let filteredArray= array.filter((obj) => obj.name.toLowerCase().includes(searchInput));
    if (array.length === 0) {
        sortArray(array);
    } else {
        displayArtists(filteredArray);
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

    let updatedArtist = {
        "id": artist.id,
        "name": artist.name,
        shortDescription,
        birthdate,
        activeSince,

    }

    // Submit edited artist.
    document.querySelector("#edit-container").addEventListener("submit", (event) => {
        event.preventDefault();
        submitNewArtist(event, );});
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
            console.log(artist.favorite)
            favoritesArray.push(artist)
        }
    }

    console.log(favoritesArray);

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
    displayArtists
}