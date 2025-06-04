class Playlist {
  constructor(dataInput) {
    this.title = dataInput.title;
    this.creator = dataInput.creator;
    this.dateCreated = new Date();
    this.songs = [];
    for (let i = 0; i < dataInput.songs.length; i++) {
      for (let j = 0; j < songs.length; j++) {
        if (songs[j].title == dataInput.songs[i]) {
          this.songs.push(songs[j]);
          break;
        }
      }
    }
  }
  getDOMCard() {
    let ref = this;

    let mainBody = document.createElement("div");
    mainBody.className = "playlist-card"
    let playlistCover = document.createElement("img");
    playlistCover.src = "assets/img/playlist.png"
    mainBody.appendChild(playlistCover)
    let playlistName = document.createElement("h3");
    playlistName.innerText = this.title
    mainBody.appendChild(playlistName)
    let playlistCreator = document.createElement("p");
    playlistCreator.innerText = this.creator;
    mainBody.appendChild(playlistCreator)
    mainBody.onclick = function(){ref.focusPlaylist()};
    return mainBody;
  }
  focusPlaylist(){
    document.getElementById("modal-overlay").style.display = "flex"
    //TODO: Actually implement
  }
}
