"use strict";

// Import Express, FS and CORS.
import express from "express";
import fs from "fs/promises";
import cors from "cors";

// Define app.
const app = express();

// Define empty artists array for use when changing the artists JSON.
let artists = [];

// Use express and cors.
app.use(express.json());
app.use(cors({ credentials: true, origin: true }))


// Response when testing if server is alive.
app.get("/", (request, response) => {
    response.send("Hi there! All is well.")
})


// Get request for /artists (.json of artists)
app.get("/artists", async (request, response) => {
    // Read the JSON file.
    const data = await fs.readFile("artists.json");
    // Parse the data
    const artists = JSON.parse(data);
    // Return the JSON data.
    return response.json(artists);
    });

// Get request for a specific artist ID.

app.get("/artists/:id", async (request, response) => {
    const id = Number(request.params.id);
    console.log(id);
    console.log("hi there");
    const data = await fs.readFile("artists.json");
    const artists = JSON.parse(data);
    const result = artists.find(artist => artist.id == id);
    response.json(result);
    });


// POST request for new Artist submission
app.post("/artists", async (request, response) => {
    // Define the body of the POST-request.
    const newArtist = request.body;
    // Give it a unique ID.
    newArtist.id = new Date().getTime();
    // Read the JSON file and define it as data.
    const data = await fs.readFile("artists.json");
    // Parse the JSON data.
    const artists = JSON.parse(data);
    // Push new artist into the JSON data.
    artists.push(newArtist);
    // Rewrite the JSON file so that it now include the new artist.
    fs.writeFile("artists.json", JSON.stringify(artists));
    // Respond with new JSON file.
    response.json(artists);
  });

// DELETE request for a specific artist.
app.delete("/artists/:id", async (request, response) => {
    // Find specific ID for object which needs to be deleted.
    const id = request.params.id;
    // Console.log the ID.
    console.log(`System received a request to deleted artist ID ${id}`);
    
    // Read the JSON file containing all artist.
    const data = await fs.readFile("artists.json");
    // Parse the JSON file.
    const artists = JSON.parse(data);
    
    // Make an array with every artist who does NOT have an ID equal to the deleted ID.
    const newArtists = artists.filter(artist => artist.id != id);
    console.log(`Artist has been deleted from array.`);
  
    // Write the new array into the artists.json file.
    fs.writeFile("artists.json", JSON.stringify(newArtists));
    console.log(`Rebuilding artists.json file.`)
    
    
    // Respond with the updated artists array.
    response.json(artists);
  });


// Server port 8801 listen.
app.listen(8801, () => {
console.log("Kører på http://localhost:8801");
});


  