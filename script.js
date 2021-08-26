const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const mute = player.querySelector('.mute');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen');
const currentTimeElement = player.querySelector('.current');
const durationTimeElement = player.querySelector('.duration');

function togglePlay() {
  const action = video.paused ? 'play' : 'pause';
  video[action]();
}

function updatePlayIcon() {
  toggle.classList.toggle('playing');
  player.classList.toggle('paused');
  if (toggle.classList.contains('playing')) {
    toggle.setAttribute('title', 'Pause (Space)');
  } else {
    toggle.setAttribute('title', 'Play (Space)');
  }
}

const currentTime = () => {
  let currentMinutes = Math.floor(video.currentTime / 60);
  let currentSeconds = Math.floor(video.currentTime - currentMinutes * 60);
  let durationMinutes = Math.floor(video.duration / 60);
  let durationSeconds = Math.floor(video.duration - durationMinutes * 60);

  currentTimeElement.innerHTML = `${currentMinutes}:${currentSeconds}`;
  durationTimeElement.innerHTML = `${durationMinutes}:${durationSeconds}`;
}

video.addEventListener('timeupdate', currentTime)

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = percent + '%';
}

function scrub(e) {
  const seconds = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = seconds;
}

let isFullScreen = false;

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
}

function toggleFullScreenClasses() {
  player.classList.toggle('fullscreen');
  isFullScreen = !isFullScreen;
}

video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('timeupdate', handleProgress);


mute.addEventListener('click', ()=> {
  video.muted = !video.muted;
  mute.classList.toggle('muted');
  console.log('here muted');
})


skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullscreen.addEventListener('click', toggleFullScreen);

document.addEventListener('fullscreenchange', toggleFullScreenClasses);

document.addEventListener("keypress", function(e) {
    if (e.code === 'KeyF') {
      toggleFullScreen();
    }
}, false);

window.onkeydown = vidCtrl;

function vidCtrl(e) {    
  const vid = document.querySelector('video');
  const key = e.code;

    if (key === 'ArrowLeft') {
        vid.currentTime -= 5;
        if (vid.currentTime < 0) {
        vid.pause();
        vid.currentTime = 0;
        }
    } else if (key === 'ArrowRight') {
        vid.currentTime += 5;
        if (vid.currentTime > vid.duration) {
        vid.pause();
        vid.currentTime = 0;
        }
    } else if (key === 'Space') {
        if (vid.paused || vid.ended) {
        vid.play();
        } else {
        vid.pause();
        }
    }
    else if (key === 'ESC') {
        if (isFullScreen) {
            isFullScreen = !isFullScreen;
        }
    }
    else if (key === 'KeyM') {
        if (!vid.muted) {
            vid.muted = true;
        } else {
            vid.muted = false;
        }
    }
    else if (key === 'Period') {
      vid.playbackRate += 0.1;      
    } 
    else if (key === 'Comma'){
      vid.playbackRate -= 0.1;
    }

    else if (key === 'ArrowUp') {
      vid.volume += 0.05;     
    } 
    else if (key === 'ArrowDown'){
      vid.volume -= 0.05;
    }

  console.log(key);
}

