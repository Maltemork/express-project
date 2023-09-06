"use strict";

const endpoint = "http://localhost:8801";

// Artists array (global);

async function getArtists() {
    const response = await fetch(`${endpoint}/artists`);
    const data = await response.json();
    const artists = Object.keys(data).map(key => ({ id: key, ...data[key] }));
    return artists;
} 


// Submit new artist function.
async function submitNewArtist(event) {
    console.log("Submit artist.");
    // prevent default behaviour.
    event.preventDefault();

    // Define all the values.
    const form = event.target;
    const name = form.name.value;
    const birthdate = form.birth.value;
    const activeSince = form.activeSince.value;
    const label = form.label.value;
    const website = form.website.value;
    const genres = form.genres.value;
    const shortDescription = form.description.value;
    const image = form.image.value;
    const favorite = false;
  
    // create new artist object.
    const newArtist = {
      name,
      birthdate,
      activeSince,
      label,
      website,
      genres,
      shortDescription,
      image,
      favorite,
    };
    
    // Make the object into a json format.
    const artistAsJson = JSON.stringify(newArtist);
    // Send object to server (POST request)
    const response = await fetch(`${endpoint}/artists`, {
      method: "POST",
      body: artistAsJson,
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    // If POST is OK, update the artistgrid and change view to frontpage.
    if (response.ok) {
        document.querySelector("#form-container").reset();
        let artistsArray = await getArtists();
        displayArtists(artistsArray);
        changeView("frontpage");
    }
  }

// Delete a specific artist.
async function deleteArtist(id) {
    // Console log ID of artist.
    console.log(id);
    // Make a DELETE request to the endpoint.
    const response = await fetch(`${endpoint}/artists/${id}`, {
      method: "DELETE",
    });

    // If the response is okay, update the artists array and display it on the frontpage.
    if (response.ok) {
        let artistsArray = await getArtists();
        displayArtists(artistsArray);
    }
  }
  


export {
    getArtists,
    submitNewArtist,
    deleteArtist
};

