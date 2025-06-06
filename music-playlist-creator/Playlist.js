class Playlist {
  constructor(title, creator, likes = 0) {
    this.title = title;
    this.creator = creator;
    this.likes = likes;
    this.dateCreated = new Date();
    this.songs = [];
    this.liked = false;
    this.editing = false;
    this.isNewPlaylist = false;
  }
  //gets the playlist card DOM element
  getDOMCard() {
    let ref = this;

    let mainBody = document.createElement("div");
    mainBody.className = "playlist-card";
    //setup playlist cover
    let playlistCover = document.createElement("img");
    playlistCover.src = this.getPlaylistCoverImage();
    mainBody.appendChild(playlistCover);
    let playlistName = document.createElement("h3");
    playlistName.innerText = this.title;
    mainBody.appendChild(playlistName);
    let playlistCreator = document.createElement("p");
    playlistCreator.innerText = this.creator;
    mainBody.appendChild(playlistCreator);
    //add like button
    let likeSection = document.createElement("p");
    likeSection.className = "like-section";
    let likeButton = document.createElement("button");
    likeButton.className = "like-button card-button";
    likeButton.innerText = "♥";
    if (this.liked) {
      likeButton.classList.add("liked");
    }
    let likeCounter = document.createElement("span");
    likeCounter.innerText = this.likes;
    likeCounter.className = "like-counter";
    likeButton.onclick = function (event) {
      event.stopPropagation();
      if (ref.liked) {
        likeButton.classList.remove("liked");
        ref.liked = false;
        ref.likes--;
        likeCounter.innerText = ref.likes;
      } else {
        likeButton.classList.add("liked");
        ref.liked = true;
        ref.likes++;
        likeCounter.innerText = ref.likes;
      }
    };
    likeSection.appendChild(likeButton);
    likeSection.appendChild(likeCounter);
    mainBody.appendChild(likeSection);
    //add delete button
    let deleteSection = document.createElement("button");
    deleteSection.className = "delete-button card-button";
    deleteSection.innerText = "✕";
    deleteSection.onclick = function (event) {
      event.stopPropagation();
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i] == ref) {
          playlists.splice(i, 1);
        }
      }
      refreshPlaylistGrid();
    };
    mainBody.appendChild(deleteSection);
    mainBody.onclick = function () {
      ref.focusPlaylist();
    };
    return mainBody;
  }
  //gets the text, indicating the length of the playlist, both in time and songs.
  getLengthText() {
    return `${Math.floor(this.getTotalLength() / 60)}m ${
      this.getTotalLength() % 60
    }${this.getTotalLength() % 60 < 10 ? 0 : ""}s (${this.songs.length} songs)`;
  }
  //
  focusPlaylist() {
    document.getElementById("modal-overlay").style.display = "flex";
    document.getElementById("playlist-name").innerText = this.title;
    document.getElementById("playlist-duration").innerText =
      this.getLengthText();
    document.getElementById(
      "playlist-creator-name"
    ).innerText = `Created by ${this.creator}`;
    document.getElementById("songs-list").innerHTML = "";
    for (let i = 0; i < this.songs.length; i++) {
      document
        .getElementById("songs-list")
        .appendChild(this.getSongCard(this.songs[i]));
    }
    document.getElementById("playlist-cover").src =
      this.getPlaylistCoverImage();
    let ref = this;
    document.getElementById("shuffle-button").hidden = false;
    document.getElementById("shuffle-button").onclick = function () {
      ref.shuffleSongs();
    };
    this.editing = false;
    document.getElementById("edit-button").innerText = "✏️";
    document.getElementById("edit-button").onclick = function (event) {
      ref.toggleEdit();
    };
  }
  toggleEdit() {
    if (this.editing) {
      //save edits
      this.title = document.getElementById("playlist-name").children[0].value;
      document.getElementById("playlist-name").innerText = this.title;
      this.creator = document.getElementById(
        "playlist-creator-name"
      ).children[0].value;
      document.getElementById(
        "playlist-creator-name"
      ).innerText = `Created by ${this.creator}`;
      document.getElementById("edit-button").innerText = "✏️";
    document.getElementById("shuffle-button").hidden = false;
      //update playlists
      if(!playlists.includes(this)){
        playlists.push(this);
      }
      refreshPlaylistGrid();
    } else {
      document.getElementById("playlist-name").innerHTML = "<input/>";
      document.getElementById("playlist-name").children[0].value = this.title;
      document.getElementById(
        "playlist-creator-name"
      ).innerHTML = `Created by <input/>`;
      document.getElementById("playlist-creator-name").children[0].value =
        this.creator;
      document.getElementById("edit-button").innerText = "💾";
    document.getElementById("shuffle-button").hidden = true;
    }
    this.editing = !this.editing;
  }
  getPlaylistCoverImage() {
    if (this.songs.length == 0) {
      return "assets/img/playlist.png";
    } else {
      return `assets/img/${this.songs[0].albumcover}`;
    }
  }
  getTotalLength() {
    let secLength = 0;
    for (let i = 0; i < this.songs.length; i++) {
      let durationParts = this.songs[i].duration.split(":");
      secLength += parseInt(durationParts[0]) * 60;
      secLength += parseInt(durationParts[1]);
    }
    return secLength;
  }
  getSongCard(song) {
    let card = document.createElement("div");
    //album cover
    let image = document.createElement("img");
    image.src = `assets/img/${song.albumcover}`;
    card.appendChild(image);
    //song info (title, album, artist)
    let centerSection = document.createElement("div");
    let songTitle = document.createElement("p");
    songTitle.innerText = song.title;
    songTitle.className = "song-title";
    centerSection.appendChild(songTitle);
    let songAlbum = document.createElement("p");
    songAlbum.innerText = song.album;
    centerSection.appendChild(songAlbum);
    let songArtist = document.createElement("p");
    songArtist.innerText = song.artist;
    centerSection.appendChild(songArtist);
    card.appendChild(centerSection);
    //duration
    let rightSection = document.createElement("div");
    let songDuration = document.createElement("p");
    songDuration.innerText = song.duration;
    rightSection.appendChild(songDuration);
    rightSection.className = "song-right-section";
    card.appendChild(rightSection);
    return card;
  }
  shuffleSongs() {
    document.getElementById("songs-list").innerHTML = "";
    //get random shuffle
    let indexes = [];
    while (indexes.length < this.songs.length) {
      indexes.splice(
        Math.floor(Math.random() * (1 + indexes.length)),
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
