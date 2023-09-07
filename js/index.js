const replaceBtn = document.querySelector("#sound_btn_replace");
const player = document.querySelector("#music_player");
const soundImg = document.querySelector("#sound");
const musicMenu = document.querySelector("#music_menu");
const likeButton = document.getElementById("like_btn");
const dislikeButton = document.getElementById("dislike_btn");
const likeImage = document.getElementById("like_picture");
const dislikeImage = document.getElementById("dislike_picture");
const volumeSliderContainer = document.querySelector(".volume-slider-container");
const volumeSlider = document.getElementById("volumeSlider");
const repeatButton = document.getElementById("repeat_button");
const repeatImg = document.getElementById("repeat_image");
const openedButton = document.querySelector('#opened_button');
const openedButtonAnimation = document.querySelector('.opened_button_anim');

let inputChanged = false;

openedButton.addEventListener('click', () => {
    openedButtonAnimation.classList.toggle('opened');
});
likeButton.addEventListener("click", (event) => {
    if (likeImage.src.includes("images/music_menu/like_unclicked.png")) {
        likeImage.src = likeImage.src.replace("images/music_menu/like_unclicked.png", "images/music_menu/like_clicked.png");
    } else {
        likeImage.src = likeImage.src.replace("images/music_menu/like_clicked.png", "images/music_menu/like_unclicked.png");
    }
    dislikeImage.src = "images/music_menu/dislike_unclicked.png";
});

dislikeButton.addEventListener("click", (event) => {
    if (dislikeImage.src.includes("images/music_menu/dislike_clicked.png")) {
        return;
    }
    if (dislikeImage.src.includes("images/music_menu/dislike_unclicked.png")) {
        dislikeImage.src = dislikeImage.src.replace("images/music_menu/dislike_unclicked.png", "images/music_menu/dislike_clicked.png");
    } else {
        dislikeImage.src = dislikeImage.src.replace("images/music_menu/dislike_clicked.png", "images/music_menu/dislike_unclicked.png");
    }
    likeImage.src = "images/music_menu/like_unclicked.png";
});

openedButton.addEventListener("click", () => {
    player.classList.toggle("hide");
});

replaceBtn.addEventListener("click", () => {
    if (soundImg.src.includes("images/music_menu/sound_button_unclicked.png")) {
        soundImg.src = soundImg.src.replace("images/music_menu/sound_button_unclicked.png", "images/music_menu/sound_button_clicked.png");
        currentAudio.muted = true;
    } else {
        soundImg.src = soundImg.src.replace("images/music_menu/sound_button_clicked.png", "images/music_menu/sound_button_unclicked.png");
        currentAudio.muted = false;
    }
});
volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value;
    currentAudio.volume = volume;
    inputChanged = true;
});
replaceBtn.addEventListener("mouseenter", () => {
    volumeSlider.classList.remove("hide"); // Show the volume slider container on hover
});

volumeSliderContainer.addEventListener("mouseleave", () => {
    const isInsideVolumeSlider = volumeSliderContainer.contains(document.activeElement);
    if (!isInsideVolumeSlider){
        volumeSlider.classList.add("hide");
    }
    if (inputChanged){
        volumeSlider.classList.add("hide");
        inputChanged = false;
    }
});

volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value;
    currentAudio.volume = volume;

    if (volume > 0) {
        soundImg.src = 'images/music_menu/sound_button_unclicked.png';
    } else {
        soundImg.src = 'images/music_menu/sound_button_clicked.png';
    }
});
repeatButton.addEventListener("click", () => {
   if (repeatImg.src.includes("images/music_menu/repeat_button_unclicked.png")){
       repeatImg.src = repeatImg.src.replace("images/music_menu/repeat_button_unclicked.png","images/music_menu/repeat_button_clicked.png");
   }
   else {
       repeatImg.src = repeatImg.src.replace("images/music_menu/repeat_button_clicked.png", "images/music_menu/repeat_button_unclicked.png");
   }
});
