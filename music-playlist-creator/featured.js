let songs = []
let playlists = []

function loadData(data) {
  songs = data.songs;
  for (let i = 0; i < data.playlists.length; i++) {
    let playlistData = data.playlists[i];
    let playlist = new Playlist(
      playlistData.title,
      playlistData.creator,
      playlistData.likes
    );

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
  let chosenPlaylist = playlists[Math.floor(Math.random() * playlists.length)]
  console.log(chosenPlaylist)
  for(let i = 0; i<chosenPlaylist.songs.length; i++){
    document.getElementById("songs-list").appendChild(chosenPlaylist.getSongCard(chosenPlaylist.songs[i]))
  }
  document.getElementById("playlist-cover").src = `assets/img/${chosenPlaylist.songs[0].albumcover}`
  document.getElementById("playlist-name").innerText = chosenPlaylist.title
  document.getElementById("playlist-creator").innerText = `Created By ${chosenPlaylist.creator}`
  document.getElementById("playlist-length").innerText = `${chosenPlaylist.getLengthText()}`
}


fetch("assets/data.json")
  .then((x) => x.json())
  .then((x) => loadData(x));
