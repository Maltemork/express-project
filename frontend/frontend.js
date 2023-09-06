"use strict";

import {
    getArtists,
    submitNewArtist,
    deleteArtist,
} from "./rest.js";

let artistsArray = [];
let favoritesArray = [];


window.addEventListener("load", startFunction);

async function startFunction() {
    // eventlisteners
    console.log("Javascript is running 👍");
    startEventListeners();
    let artistsArray = await getArtists();
    
    displayArtists(artistsArray);
    console.log(artistsArray);
    fillFavoritesArray(artistsArray);
}

function startEventListeners() {
    // Navigation buttons in the header.
    document.querySelector("#nav-frontpage").addEventListener("click", () => { changeView("frontpage"); });
    document.querySelector("#nav-create").addEventListener("click", () => { changeView("create"); });
    document.querySelector("#nav-favorites").addEventListener("click", () => { changeView("favorites"); });

    // Submit event for create new artist form.
    document.querySelector("#form-container").addEventListener("submit", submitNewArtist)

    // Eventlistener for NO button in delete dialog.
    document.querySelector("#btn-no").addEventListener("click", () => {
        document.querySelector("#dialog-delete-artist").close();});

    document.querySelector("#close-delete-button").addEventListener("click", () => {
        document.querySelector("#dialog-delete-artist").close();});
    
}


// Display artists.
function displayArtists(list) {
    // Clear grid
    document.querySelector("#main-content-grid").innerHTML = "";
    
    // insert HTML for each item in globalArtistsArray.
    for (const artist of list) { 
        // define the element we will place on the website.
        let HTMLelement = /* HTML */ `
            <article class="grid-item-artist">
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
        document.querySelector("#main-content-grid").insertAdjacentHTML(
            "beforeend", HTMLelement);

        if (artist.favorite === true) {
            document.querySelector("#main-content-grid article:last-child .btn-favorite").classList.add("favorite");
        }

        document
            .querySelector("#main-content-grid article:last-child .btn-delete")
            .addEventListener("click", () => deleteArtistClicked(artist));
        
    }
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
        deleteArtist(artist.id)});
}

// Fill the favorites array.

function fillFavoritesArray(list) {
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
            <article class="grid-item-artist">
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
        
    }
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