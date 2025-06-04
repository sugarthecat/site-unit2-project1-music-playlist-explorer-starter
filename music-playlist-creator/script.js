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
  }
  sortPlaylists();
}
fetch("assets/data.json")
  .then((x) => x.json())
  .then((x) => loadData(x));
hideModalOverlay();

function sortPlaylists() {
  let sortCriteria = document.getElementById("playlist-sort-type").value;
  document.getElementById("playlist-cards").innerHTML = "";
  //sort playlists - bubble sort
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 0; i + 1 < playlists.length; i++) {
      //default: a2z sorting
      let comparison =
        playlists[i].title
          .toLowerCase()
          .localeCompare(playlists[i + 1].title.toLowerCase()) <= 0;
      switch (sortCriteria) {
        case "len":
          comparison =
            playlists[i].getTotalLength() > playlists[i + 1].getTotalLength() ||
            (comparison &&
              playlists[i].getTotalLength() ==
                playlists[i + 1].getTotalLength());
          break;
        case "songcount":
          comparison =
            playlists[i].songs.length > playlists[i + 1].songs.length ||
            (comparison &&
              playlists[i].songs.length == playlists[i + 1].songs.length);
          break;
        case "likes":
          comparison =
            playlists[i].likes > playlists[i + 1].likes ||
            (playlists[i].likes == playlists[i + 1].likes && comparison);
          break;
        case "z2a":
          comparison = !comparison;
          break;
      }
      if (!comparison) {
        let temp = playlists[i + 1];
        playlists[i + 1] = playlists[i];
        playlists[i] = temp;
        sorted = false;
      }
    }
  }
  for (let i = 0; i < playlists.length; i++) {
    document
      .getElementById("playlist-cards")
      .appendChild(playlists[i].getDOMCard());
  }
}
