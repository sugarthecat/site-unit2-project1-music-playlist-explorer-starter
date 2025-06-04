function hideModalOverlay(){
    document.getElementById('modal-overlay').style.display = "none";
}
function modalContentClicked(event){
    event.stopPropagation();
}

let songs = []
let playlists = []
//load data
function loadData(data){
    songs = data.songs;
    for(let i = 0; i<data.playlists.length; i++){
        playlists.push(new Playlist(data.playlists[i]))
        document.getElementById("playlist-cards").appendChild(playlists[i].getDOMCard())
    }
}
fetch("assets/data.json").then(x => x.json()).then(x => loadData(x));