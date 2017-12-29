"use strict";

// Forma ir mygtukai
const formElement = document.querySelector("form");
const submitBtn = document.querySelector(".modal .modal-footer > .btn-primary");
const closeBtn = document.querySelector(".modal .modal-footer > .btn-default");
const addOther = document.querySelector(".success-message a");
const deleteBtn = document.querySelector(".delete");
const searchBtn = document.querySelector(".search");
// Formos laukai
const artistInput = document.getElementById("artist");
const albumInput = document.getElementById("album");
const releaseDateInput = document.getElementById("releaseDate");
const imageInput = document.getElementById("image");
const genreInput = document.getElementById("genre");
const searchInput = document.querySelector(".search-input");

const albumListElement = document.querySelector(".album-list");

let allAlbums = [];
const serverName = "http://localhost:3026"; 


// duomenys iš serverio
 fetch(serverName + "/albums")
  .then(function(response){
         response.json()
            .then(function(albums) {
                  // Išsisaugom visus albumus
                  app.albums = albums;
                // Spausdinam į HTML
                 // renderAlbums(allAlbums);
             });
     })


// funkcija, kuri ištrina formos laukelius
function deleteFormFields () {
    artistInput.value = "";
    albumInput.value = ""
    releaseDateInput.value = "";
    imageInput.value  = "";
    genreInput.value = "";
}






