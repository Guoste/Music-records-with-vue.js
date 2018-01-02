"use strict";

let app = new Vue({
    el: "#app",
    data: {
        albums: [],
        searchText: "",
        selectedYears: "Visi metai",
        serverName: "http://localhost:3026",
        newAlbum: {
            artist: "",
            album: "",
            releaseDate: "",
            genre: "",
            image: ""
        },
        modalEdit: {
            visible: false,
            albumId: "",
            saved: false
        }
    },
    methods: {
        start: function() {
            fetch(this.serverName + "/albums")
                .then(function(response){
                    response.json()
                        .then(function(albums) {
                            app.albums = albums;
                        });
                })
        },
        deleteAlbums: function (album) {
            let result = window.confirm("Ar tikrai norite ištrinti albumą?");
            if(result) {
                fetch(app.serverName + "/albums/" + album.id, {
                    method: "delete",
                }).then(
                    function (response) {
                        console.log("Albumas ištrintas")
                    }).catch(
                    function (error) {
                        console.log("Albumas neištrintas", error);
                    });
    
                let index = app.albums.indexOf(album);
                app.albums.splice(index, 1);

            }
 
        },
        getTags: function (text) {
            return text.split(", ");
        },
        processFile: function (event) {
            this.newAlbum.image = event.target.files[0] ? event.target.files[0].name : "";
        },
        saveAlbum: function () {
            fetch(this.serverName + "/albums", {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(this.newAlbum)
            }).then(function (response) {
                response.json()                
                    .then(function (result) {
                        console.log("albumas išsaugotas");
                    });
            })
            
            this.albums.push(this.newAlbum);
        },
        clearForm: function() {
            this.modalEdit.visible = false;
            this.modalEdit.albumId = "";
            this.modalEdit.saved = false;

            this.newAlbum = {
                artist: "",
                album: "",
                releaseDate: "",
                genre: "",
                image: ""
            }
          
        },
        editAlbum: function(album) {
            this.modalEdit.visible = true;
            this.modalEdit.albumId = album.id;

            this.newAlbum = { 
                artist: album.artist,
                album: album.album,
                releaseDate: album.releaseDate,
                genre: album.genre,
                image: album.image
            }
        },
        updateAlbum: function() {
            // update on server
            fetch(this.serverName + "/albums/" + this.modalEdit.albumId , {
                method: "PUT",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.newAlbum)
            })
            .then(function(response) {
                response.json()
                    .then(function(result) {
                        console.log("albumas atnaujintas");
                        app.modalEdit.saved = true;
                    })
            })
            .catch(function(error) {
                console.log("klaida: nepavyko atnaujinti albumo", error);
            })

            // update UI with recent changes
            app.albums.forEach(function(album){
                if(app.modalEdit.albumId === album.id) {
                    album.artist = app.newAlbum.artist;
                    album.album = app.newAlbum.album;
                    album.releaseDate = app.newAlbum.releaseDate;
                    album.genre = app.newAlbum.genre;
                    album.image = app.newAlbum.image
                }
            });
        }   
    },

    computed: {
        filteredAlbums: function () {
            let filteredByYear;
            if (this.selectedYears !== "Visi metai") {
                filteredByYear = this.albums.filter(function (item) {
                    return app.selectedYears === item.releaseDate
                });
            } else {
                filteredByYear = this.albums;
            }

            return filteredByYear.filter(function (item) {
                let searchText = app.searchText.toLowerCase();
                let resultArtist = item.artist.toLowerCase().indexOf(searchText) !== -1 ? true : false;
                let resultAlbum = item.album.toLowerCase().indexOf(searchText) !== -1 ? true : false;
                let resultGenre = item.genre.toLowerCase().indexOf(searchText) !== -1 ? true : false;
                if (resultArtist || resultAlbum || resultGenre) {
                    return true;
                }
                return false;
            })
        },
        albumsYear: function () {
            let allYears = [];
            this.albums.forEach(function (album) {
                if (allYears.indexOf(album.releaseDate) === -1) {
                    allYears.push(album.releaseDate);
                }
            })
            return allYears;
        }
        }
    
});

app.start();

// $('#newAlbum').on('hidden.bs.modal', function () {
//   app.clearForm();
// });

