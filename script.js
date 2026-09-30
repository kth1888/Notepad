const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const setTimeBtn = document.getElementById('set-time-btn')
const timeInput = document.getElementById('time-input')

let timeLeft = 1500;
let timerInterval = null;

function updateDisPlay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
}

function startTimer() {
    if (timerInterval !== null) return;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisPlay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert('타이머 종료! 휴식시간입니다.');
        }
    }, 1000);
}

function pauseTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    pauseTimer();
    setTimer();
    updateDisPlay();
}

function setTimer() {
    pauseTimer();
    const timeValue = parseInt(timeInput.value)
    if (isNaN(timeValue) || timeValue <= 0) {
        alert('올바른 입력값을 입력하세요! (1~60)')
    } else {
        timeLeft = timeValue * 60;
        updateDisPlay();
    }
}


startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
setTimeBtn.addEventListener('click', setTimer);

updateDisPlay();