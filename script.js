// DOM Elements
const changeImageBtn = document.querySelector('.back-img');
const settingsBtn = document.querySelector('.settings');
const closeBtn = document.querySelector('.close');
const breakBtn = document.querySelector('.break-btn');
const modalSubmitBtn = document.querySelector('.modal-submit');
const timeDisplay = document.getElementById('timerValue');
const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
const inputs = document.querySelectorAll('input[type="number"]');

// Timer Variables
let focusTime = { h: 0, m: 25, s: 0 };
let breakTime = { h: 0, m: 5, s: 0 };
let currentTime = { ...focusTime };
let timerInterval, isFocusTime = true, currentIndex = 0;

// Quotes and Video Data
let quotes = [];
let videos = [];

// Fetch Quotes and Videos
async function fetchData() {
    const quotesResponse = await fetch('json/quotes.json');
    quotes = await quotesResponse.json();

    const videoResponse = await fetch('json/videos.json');
    videos = await videoResponse.json();
}

// Functions
const formatTime = ({ h, m, s }) => {
    const hours = h ? `${h.toString().padStart(2, '0')}:` : '';
    return `${hours}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const updateDisplay = () => timeDisplay.textContent = formatTime(currentTime);

const toggleModal = () => document.querySelector('.bg-modal').classList.toggle('show-modal');

const parseInputValues = () => {
    focusTime = { h: +inputs[0].value || 0, m: +inputs[1].value || 25, s: +inputs[2].value || 0 };
    breakTime = { h: +inputs[3].value || 0, m: +inputs[4].value || 5, s: +inputs[5].value || 0 };
    currentTime = { ...focusTime };
    updateDisplay();
    toggleModal();
};

const switchMode = () => {
    isFocusTime = !isFocusTime;
    currentTime = isFocusTime ? { ...focusTime } : { ...breakTime };
    breakBtn.textContent = isFocusTime ? "Break" : "Focus";
    updateDisplay();
};

const changeBackgroundImage = () => {
    currentIndex = (currentIndex + 1) % videos.length;
    document.getElementById('backgroundVideo').src = `videos/${videos[currentIndex]}`;
};

const tick = () => {
    if (--currentTime.s < 0) { currentTime.s = 59; if (--currentTime.m < 0) { currentTime.m = 59; currentTime.h--; } }
    if (currentTime.h < 0) { clearInterval(timerInterval); return; }
    updateDisplay();
};

const toggleTimer = () => {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; startBtn.textContent = 'Start'; }
    else { timerInterval = setInterval(tick, 1000); startBtn.textContent = 'Pause'; }
};

const resetTimer = () => {
    clearInterval(timerInterval); timerInterval = null; startBtn.textContent = 'Start';
    currentTime = isFocusTime ? { ...focusTime } : { ...breakTime };
    updateDisplay();
};

// Event Listeners
changeImageBtn.addEventListener("click", changeBackgroundImage);
settingsBtn.addEventListener("click", toggleModal);
closeBtn.addEventListener("click", toggleModal);
modalSubmitBtn.addEventListener("click", parseInputValues);
startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
breakBtn.addEventListener('click', switchMode);

// Quote Rotation
setInterval(() => {
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        document.querySelector('.quote').textContent = quotes[randomIndex];
    }
}, 300000); // Change quote every 5 minutes

// Input Validation
inputs.forEach(input => {
    input.addEventListener('input', () => {
        const maxValue = input.classList.contains('hourInput') ? 24 : 59;
        if (+input.value > maxValue) input.value = maxValue;
    });
});

// Initial Display
updateDisplay();
fetchData();
