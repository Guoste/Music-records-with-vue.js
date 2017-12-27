"use strict";

let app = new Vue({
    el: "#app",
    data: {
        albums: [],
        searchText: "",
        newAlbum: {
            artist: "",
            album: "",
            releaseDate: "",
            genre: "",
            image: ""
        }
    },
    methods: {
        deleteAlbums: function(album){
            fetch(serverName + "/albums/" + album.id, {
                method: "delete"
               }).then(
                   function(response) {
                   console.log("Albumas ištrintas")
               }).catch(
                   function(error){
                       console.log("Albumas neištrintas", error);
                   });
           
            let index = this.albums.indexOf(album);
            this.albums.splice(index, 1);
        },
        getTags: function(text){
           return text.split(", ");
        },
        processFile: function(event) {
            this.newAlbum.image = event.target.files[0] ? event.target.files[0].name : "";
        },
        saveAlbum: function() {
            fetch(serverName + "/albums", {
                method: "POST",
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(this.newAlbum)
            }).then(function(response){
                response.json()
                  .then(function(result){
                      console.log("albumas išsaugotas");
                });
            })
            
            this.albums.push(this.newAlbum);
        }
        
    },
    computed: {
        filteredAlbums: function() {
           return this.albums.filter (function(item){
               let searchText = app.searchText.toLowerCase();
               let resultArtist = item.artist.toLowerCase().indexOf(searchText) !== -1 ? true : false;
               let resultAlbum = item.album.toLowerCase().indexOf(searchText) !== -1 ? true : false;
               let resultGenre = item.genre.toLowerCase().indexOf(searchInput.value) !== -1 ? true : false;
               let resultYears = item.releaseDate.indexOf(searchInput.value) !== -1 ? true : false;   
               if (resultArtist || resultAlbum || resultGenre || resultYears) {
                   return true;
               }
               
               return false;

           });

        }
    }
});

