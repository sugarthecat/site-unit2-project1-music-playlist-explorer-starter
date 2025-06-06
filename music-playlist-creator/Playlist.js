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
  /**
   *
   * @returns a HTML element of the playlist card
   */
  getPlaylistCard() {
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
  /**
   * Gets a text indicating the total runtime of the playlist
   * @returns A string, representing the playtime of the playlist
   */
  getLengthText() {
    return `${Math.floor(this.getTotalLength() / 60)}m ${
      this.getTotalLength() % 60
    }${this.getTotalLength() % 60 < 10 ? 0 : ""}s (${this.songs.length} songs)`;
  }
  /**
   * Focuses the playlist on the modal overlay
   */
  focusPlaylist() {
    document.getElementById("modal-overlay").style.display = "flex";
    document.getElementById("playlist-name").innerText = this.title;
    document.getElementById("playlist-duration").innerText =
      this.getLengthText();
    document.getElementById(
      "playlist-creator-name"
    ).innerText = `Created by ${this.creator}`;

    this.focusSongList();
    document.getElementById("playlist-cover").src =
      this.getPlaylistCoverImage();
    let ref = this;
    //make sure shuffle button is visible & link to playlist object
    document.getElementById("shuffle-button").hidden = false;
    document.getElementById("shuffle-button").onclick = function () {
      ref.shuffleSongs();
    };
    //default to non-edit mode & link edit/save button to playlist object
    this.editing = false;
    document.getElementById("edit-button").innerText = "✏️";
    document.getElementById("edit-button").onclick = function (event) {
      ref.toggleEdit();
    };
    //hide new song section & show playlist duration
    document.getElementById("add-new-song-section").hidden = true;
    document.getElementById("add-song-button").onclick = function (event) {
      ref.addSong();
    };
    document.getElementById("playlist-duration").hidden = false;
  }
  /**
   * Remakes the song list in the playlist focus
   */
  focusSongList(){
    document.getElementById("songs-list").innerHTML = "";
    for (let i = 0; i < this.songs.length; i++) {
      document
        .getElementById("songs-list")
        .appendChild(this.getSongCard(this.songs[i]));
    }
    if(this.editing){
      let deleteButtons = document.getElementsByClassName("song-delete-button");
      for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].hidden = false;
      }
    }
  }
  /**
   * Toggles if the playlist is in edit mode. If reverting back from edit mode, saves changes.
   */
  toggleEdit() {
    if (this.editing) {
      //save edits
      this.title = document.getElementById("playlist-name").children[0].value;
      this.creator = document.getElementById(
        "playlist-creator-name"
      ).children[0].value;
      document.getElementById(
        "playlist-creator-name"
      ).innerText = `Created by ${this.creator}`;
      //make
      this.focusPlaylist();
      document.getElementById("shuffle-button").hidden = false;
      //update playlists
      if (!playlists.includes(this)) {
        playlists.push(this);
      }
      refreshPlaylistGrid();
      this.editing = false;
    } else {
      //fix song order
      this.editing = true;
      this.focusSongList();
      document.getElementById("playlist-name").innerHTML = "<input/>";
      document.getElementById("playlist-name").children[0].value = this.title;
      document.getElementById(
        "playlist-creator-name"
      ).innerHTML = `Created by <input/>`;
      document.getElementById("playlist-creator-name").children[0].value =
        this.creator;
      document.getElementById("edit-button").innerText = "💾";
      document.getElementById("shuffle-button").hidden = true;
      document.getElementById("add-new-song-section").hidden = false;
      document.getElementById("playlist-duration").hidden = true;
    }
  }
  /**
   * Gets the cover image for the playlist
   * @returns The source for the playlist cover image
   */
  getPlaylistCoverImage() {
    if (this.songs.length == 0) {
      return "assets/img/playlist.png";
    } else {
      return `assets/img/${this.songs[0].albumcover}`;
    }
  }
  /**
   * Calculates the total length (in seconds) of the playlist
   * @returns The total length in seconds of the playlist
   */
  getTotalLength() {
    let secLength = 0;
    for (let i = 0; i < this.songs.length; i++) {
      let durationParts = this.songs[i].duration.split(":");
      secLength += parseInt(durationParts[0]) * 60;
      secLength += parseInt(durationParts[1]);
    }
    return secLength;
  }
  /**
   * Creates a HTML card element for a given song
   * @param {Object} song The song data which to create a card for
   * @returns The HTML Element representing the song card
   */
  getSongCard(song) {
    let card = document.createElement("div");
    //album cover
    let image = document.createElement("img");
    image.src = `assets/img/${song.albumcover}`;
    card.appendChild(image);
    //build and write song info (title, album, artist)
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
    //build duration text blurb
    let rightSection = document.createElement("div");
    let songDuration = document.createElement("p");
    songDuration.innerText = song.duration;
    rightSection.appendChild(songDuration);
    rightSection.className = "song-right-section";
    //build delete button
    let deleteButton = document.createElement("button");
    deleteButton.className = "delete-button card-button song-delete-button";
    deleteButton.innerText = "✕";
    deleteButton.hidden = true;
    let ref = this;
    deleteButton.onclick = function (event) {
      //delete song element
      card.remove();
      //delete song from playlist
      ref.songs.splice(ref.songs.indexOf(song), 1);
    };
    card.appendChild(deleteButton);
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
  addSong(){
    let newSong = {
      title: document.getElementById('add-song-title').value,
      artist: document.getElementById('add-song-artist').value,
      duration: document.getElementById('add-song-duration').value,
      album: document.getElementById('add-song-album').value,
      albumcover: "song.png"
    }
    //check for valid duration
    let durationSplit = newSong.duration.split(":")
    if (!(durationSplit.length == 2 && !isNaN(Number(durationSplit[0]))&& !isNaN(Number(durationSplit[1])))){
      alert("Invalid Duration")
      return;
    }
    //match valid album
    let songExists = false;
    for(let i = 0; i<songs.length; i++){
      //if they match album, fix any case errors with the album name and use the same album cover
      if(newSong.album.toLowerCase() == songs[i].album.toLowerCase()){
        newSong.albumcover = songs[i].albumcover
        newSong.album = songs[i].album
      }
      //if they match artist, correct any case errors.
      if(newSong.artist.toLowerCase() == songs[i].artist.toLowerCase()){
        newSong.artist = songs[i].artist
      }
      if(newSong.artist == songs[i].artist && newSong.title.toLowerCase() == songs[i]){
        songExists = false;
        newSong = songs[i];
      }
    }
    if(!songExists){
      songs.push(newSong)
    }
    this.songs.push(newSong)
    this.focusSongList();
  }
}
