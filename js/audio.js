const stopBtn = document.getElementById('stop-button');
const stopBtnImg = document.getElementById('play_button_img');
const showMenu = document.getElementById('music_menu');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const musicTimer = document.getElementById('music_timer');
const musicTimerLength = document.getElementById('music_timer_duration');
const songImg = document.querySelector('.music_information_song-img');
const songName = document.querySelector('.music_information_text_name');
const songAuthor = document.querySelector('#music_information_text_subinfo_autor');
const songList = document.querySelector('.song_list');
const playerSongList = document.querySelector('.music_player_music-menu_next_song_container')
const  playerSongImg = document.getElementById('player_song_img');
const previousBtn = document.getElementById('previous-song');
const nextBtn = document.getElementById('next-song');
const  randomButton = document.getElementById('random_button');
let currentIndex = 0;
let currentAudio;
let timerInterval;
let elapsedTime = 0;
let isRepeatEnabled = false;
let isShuffleEnabled = false
let audioFiles;

function getSongDuration(songUrl) {
    const audio = new Audio(songUrl);
    return new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration;
            resolve(duration);
        });
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const currentTime = currentAudio.currentTime;
        const duration = currentAudio.duration;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = progressPercent + '%';
        elapsedTime = Math.floor(currentTime);
        musicTimer.innerText = formatTime(elapsedTime);
    }, 100);
}

function playAudio(song) {
    stopAudio();
    currentIndex = audioFiles.indexOf(song);
    if (currentIndex === -1) {
        currentIndex = 0;
    }
    currentAudio = new Audio(song.url);
    currentAudio.addEventListener('loadeddata', async () => {
        const songDuration = await getSongDuration(song.url);
        musicTimerLength.textContent = formatTime(songDuration);
        startTimer();
        musicTimer.innerText = formatTime(0);
        currentAudio.play();
    });
    currentAudio.addEventListener('ended', () => {
        if (isRepeatEnabled) {
            currentAudio.currentTime = 0;
            currentAudio.play();
        } else {
            playNextAudio();
        }
    });
    progressBar.addEventListener('click', (e) => {
        const progressWidth = progressBar.clientWidth;
        const clickX = e.offsetX;
        const clickOffset = clickX / progressWidth;
        const seekTime = clickOffset * currentAudio.duration;
        currentAudio.currentTime = seekTime;
    });
    updateSongInfo(song);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const returnedSeconds = Math.round(seconds % 60);
    return `${minutes}:${returnedSeconds < 10 ? '0' : ''}${returnedSeconds}`;
}

function stopAudio() {
    clearInterval(timerInterval);
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function updateSongInfo(song) {
    songImg.src = song.image;
    playerSongImg.src = song.image;
    songName.textContent = song.title;
    songAuthor.textContent = song.author;
    showMenu.classList.remove('hide');
}

function playNextAudio() {
    currentIndex = (currentIndex + 1) % audioFiles.length;
    playAudio(audioFiles[currentIndex]);
}

function playPreviousAudio() {
    currentIndex = (currentIndex - 1 + audioFiles.length) % audioFiles.length;
    playAudio(audioFiles[currentIndex]);
}
function toggleRepeat() {
    isRepeatEnabled = !isRepeatEnabled;
}

function shuffleSongs() {
    for (let i = audioFiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [audioFiles[i], audioFiles[j]] = [audioFiles[j], audioFiles[i]];
    }
}

function renderPlayerSongList() {
    playerSongList.innerHTML = ''; // Clear the existing content
    audioFiles.forEach((file) => {
        const playerSongContainer = document.createElement('div');
        playerSongContainer.classList.add('next_song_container');

        const playerPlayBtn = document.createElement('button');
        playerPlayBtn.classList.add('music_player_music-menu_next_song-img', 'player_button_normalize');
        playerPlayBtn.innerHTML = `<img src="${file.image}" alt="Baka" class="music_player_music-menu_next_song_button-img">`;

        const playerPlayInfo = document.createElement("div");
        playerPlayInfo.classList.add('music_player_music-menu_information_text');

        const playerNameBtn = document.createElement('button');
        playerNameBtn.classList.add('music_player_music-menu_information_text_name', 'player_button_normalize');
        playerNameBtn.textContent = file.title;

        const playerAutorBtn = document.createElement('p');
        playerAutorBtn.textContent = file.author;

        playerPlayInfo.append(playerNameBtn, playerAutorBtn);

        playerSongContainer.append(playerPlayBtn, playerPlayInfo);
        playerSongList.appendChild(playerSongContainer);
        playerNameBtn.addEventListener('click', () => playAudioFromList(file));
        playerPlayBtn.addEventListener('click', () => playAudioFromList(file));
    });
}

randomButton.addEventListener('click', () => {
    isShuffleEnabled = !isShuffleEnabled;
    randomButton.classList.toggle('clicked', isShuffleEnabled);
    if (isShuffleEnabled) {
        shuffleSongs();
        playAudio(audioFiles[0]);
    } else {
        audioFiles.sort((a, b) => a.index - b.index);
        playAudio(audioFiles[currentIndex]);
    }
    renderPlayerSongList();
});

function togglePlayPause() {
    if (currentAudio.paused) {
        currentAudio.play();
        stopBtnImg.src = stopBtnImg.src.replace('images/music_menu/play_button.png', 'images/music_menu/pause_buttons.png');
    } else {
        currentAudio.pause();
        stopBtnImg.src = stopBtnImg.src.replace('images/music_menu/pause_buttons.png', 'images/music_menu/play_button.png');
    }
}
stopBtn.addEventListener('click', togglePlayPause);

playerSongImg.addEventListener('click', () => {
    togglePlayPause();
});

repeatButton.addEventListener('click', toggleRepeat);

fetch('audio/audioFiles.json')
    .then((response) => response.json())
    .then((data) => {
        audioFiles = data;
        const playAudioFromList = (song) => {
            player.classList.remove("hide");
            updateSongInfo(song);
            playAudio(song);
        };

        audioFiles.forEach((file) => {
            const songContainer = document.createElement('div');
            songContainer.classList.add('song_container');

            const playBtn = document.createElement('button');
            playBtn.classList.add('song_list_music_button_img');
            playBtn.innerHTML = `<img src="${file.image}" class="song_img" alt="Baka">`;

            const nameBtn = document.createElement('button');
            nameBtn.classList.add('song_list_music_button', 'link_normalize', 'song_name');
            nameBtn.textContent = file.title;

            const autorBtn = document.createElement('button');
            autorBtn.classList.add('song_list_music_button', 'link_normalize', 'song_autor');
            autorBtn.textContent = file.author;

            songContainer.append(playBtn, nameBtn, autorBtn);
            songList.appendChild(songContainer);

            nameBtn.addEventListener('click', () => playAudioFromList(file));
            playBtn.addEventListener('click', () => playAudioFromList(file));

            const playerSongContainer = document.createElement('div');
            playerSongContainer.classList.add('next_song_container');

            const playerPlayBtn = document.createElement('button');
            playerPlayBtn.classList.add('music_player_music-menu_next_song-img', 'player_button_normalize');
            playerPlayBtn.innerHTML = `<img src="${file.image}" alt="Baka" class="music_player_music-menu_next_song_button-img">`;

            const playerPlayInfo = document.createElement("div");
            playerPlayInfo.classList.add('music_player_music-menu_information_text');

            const playerNameBtn = document.createElement('button');
            playerNameBtn.classList.add('music_player_music-menu_information_text_name', 'player_button_normalize');
            playerNameBtn.textContent = file.title;

            const playerAutorBtn = document.createElement('p');
            playerAutorBtn.textContent = file.author;


            playerPlayInfo.append(playerNameBtn,playerAutorBtn);

            playerSongContainer.append(playerPlayBtn, playerPlayInfo);
            playerSongList.appendChild(playerSongContainer);
            playerNameBtn.addEventListener('click', () => playAudioFromList(file));
            playerPlayBtn.addEventListener('click', () => playAudioFromList(file));

        });

        previousBtn.addEventListener('click', playPreviousAudio);
        nextBtn.addEventListener('click', playNextAudio);

    });
