const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const nextBtn = document.getElementById('next-btn');
const seekBar = document.getElementById('seek-bar');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const playlistEl = document.getElementById('playlist');

// Dummy Playlist Data (Replace with your own local files later)
const playlist = [
    { title: "Midnight Drive", artist: "Synthwave Artist", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Neon Lights", artist: "Retro Beat", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Glass Window", artist: "Chillhop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

let currentTrackIndex = 0;

// Load a track
function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // Update active state in playlist UI
    const items = playlistEl.querySelectorAll('li');
    items.forEach((item, i) => {
        if (i === index) item.classList.add('active');
        else item.classList.remove('active');
    });
    
    // Reset seek bar
    seekBar.value = 0;
}

// Populate Playlist UI
playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${track.title} - ${track.artist}`;
    li.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.textContent = '⏸';
    });
    playlistEl.appendChild(li);
});

// Play / Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶';
    }
});

// Stop
stopBtn.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    playBtn.textContent = '▶';
});

// Next Track
nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audio.play();
    playBtn.textContent = '⏸';
});

// Auto-play next track when current ends
audio.addEventListener('ended', () => {
    nextBtn.click();
});

// Seek Bar Updates
audio.addEventListener('timeupdate', () => {
    const { currentTime, duration } = audio;
    if (duration) {
        const progress = (currentTime / duration) * 100;
        seekBar.value = progress;
        
        // Format Time
        const formatTime = (time) => {
            const min = Math.floor(time / 60);
            const sec = Math.floor(time % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        };
        
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
    }
});

// Seek Bar Drag
seekBar.addEventListener('input', () => {
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

// Volume Control
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

// Initialize first track
loadTrack(currentTrackIndex);
