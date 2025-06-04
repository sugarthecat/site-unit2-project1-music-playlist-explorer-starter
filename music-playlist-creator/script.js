function hideModalOverlay() {
  document.getElementById("modal-overlay").style.display = "none";
}
function modalContentClicked(event) {
  event.stopPropagation();
}

let songs = [];
let playlists = [];
//load data
function loadData(data) {
  songs = data.songs;
  for (let i = 0; i < data.playlists.length; i++) {
    let playlistData = data.playlists[i];
    let playlist = new Playlist(playlistData.title, playlistData.creator);

    for (let k = 0; k < playlistData.songs.length; k++) {
      for (let j = 0; j < songs.length; j++) {
        if (songs[j].title == playlistData.songs[k]) {
          playlist.songs.push(songs[j]);
          break;
        }
      }
    }
    playlists.push(playlist);
    document
      .getElementById("playlist-cards")
      .appendChild(playlists[i].getDOMCard());
  }
}
fetch("assets/data.json")
  .then((x) => x.json())
  .then((x) => loadData(x));
hideModalOverlay();
