class Playlist {
  constructor(title, creator) {
    this.title = title;
    this.creator = creator;
    this.dateCreated = new Date();
    this.songs = [];
  }
  getDOMCard() {
    let ref = this;

    let mainBody = document.createElement("div");
    mainBody.className = "playlist-card";
    let playlistCover = document.createElement("img");
    playlistCover.src = this.getPlaylistCoverImage();
    mainBody.appendChild(playlistCover);
    let playlistName = document.createElement("h3");
    playlistName.innerText = this.title;
    mainBody.appendChild(playlistName);
    let playlistCreator = document.createElement("p");
    playlistCreator.innerText = this.creator;
    mainBody.appendChild(playlistCreator);
    mainBody.onclick = function () {
      ref.focusPlaylist();
    };
    return mainBody;
  }
  focusPlaylist() {
    document.getElementById("modal-overlay").style.display = "flex";
    document.getElementById("playlist-name").innerText = this.title;
    document.getElementById(
      "playlist-creator-name"
    ).innerText = `Created by ${this.creator}`;
    document.getElementById("songs-list").innerHTML = "";
    for (let i = 0; i < this.songs.length; i++) {
      document
        .getElementById("songs-list")
        .appendChild(this.getSongCard(this.songs[i]));
    }
    document.getElementById('playlist-cover').src = this.getPlaylistCoverImage();
    let ref = this;
    document.getElementById("shuffleButton").onclick = function () {
      ref.shuffleSongs();
    };
  }
  getPlaylistCoverImage() {
    if (this.songs.length == 0) {
      return "assets/img/playlist.png";
    } else {
      return `assets/img/${this.songs[0].albumcover}`;
    }
  }
  getSongCard(song) {
    let card = document.createElement("div");
    let image = document.createElement("img");
    image.src = `assets/img/${song.albumcover}`;
    card.appendChild(image);
    let songTitle = document.createElement("p");
    songTitle.innerText = song.title;
    songTitle.className = "song-title";
    card.append(songTitle);
    let songAlbum = document.createElement("p");
    songAlbum.innerText = song.album;
    card.append(songAlbum);
    let songArtist = document.createElement("p");
    songArtist.innerText = song.artist;
    card.append(songArtist);
    return card;
  }
  shuffleSongs() {
    document.getElementById("songs-list").innerHTML = "";
    //get random shuffle
    let indexes = [];
    while (indexes.length < this.songs.length) {
      indexes.splice(
        Math.floor(Math.random() * indexes.length),
        0,
        indexes.length
      );
    }
    //insert according to new order
    for (let i = 0; i < this.songs.length; i++) {
      document
        .getElementById("songs-list")
        .appendChild(this.getSongCard(this.songs[indexes[i]]));
    }
  }
}
