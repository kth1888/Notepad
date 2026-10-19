const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const setTimeBtn = document.getElementById('set-time-btn')
const timeInput = document.getElementById('time-input')

const historyDisplay = document.getElementById('history-list');
let historyData = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];
const clearHistoryBtn = document.getElementById('clear-history-btn');

const tabTimerBtn = document.getElementById('tab-timer-btn');
const tabStatsBtn = document.getElementById('tab-stats-btn');
const timerSection = document.getElementById('timer-section');
const statsSection = document.getElementById('stats-section');
const todoSection = document.getElementById('todo-section');


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

            addHistory('완료');
            setTimer();
        }
    }, 1000);

    resetBtn.textContent = '중단';
}

function pauseTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    const timeValue = parseInt(timeInput.value)
    if (timeLeft < (timeValue * 60)) {
        alert('중도 종료');
        addHistory('중단');
    }

    pauseTimer();
    setTimer();
    updateDisPlay();

    resetBtn.textContent = '리셋';
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

function addHistory(status) {
    const now = new Date();
    const initialSeconds = (parseInt(timeInput.value) || 25) * 60;
    const elapsedSeconds = initialSeconds - timeLeft;
    const totalMinutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    const record = {
        id: Date.now(),
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        elapsedSeconds: elapsedSeconds,
        status: status
    };

    historyData.unshift(record);
    localStorage.setItem('pomodoroHistory', JSON.stringify(historyData));
    renderHistory();

    renderStats();
}

function renderHistory() {
    historyDisplay.innerHTML = '';

    historyData.forEach(item => {
        const minutes = Math.floor(item.elapsedSeconds / 60);
        const seconds = item.elapsedSeconds % 60;

        const li = document.createElement('li');
        li.textContent = `${item.date} ${item.time} - ${minutes}분 ${seconds}초 세션 (${item.status})`;
        historyDisplay.appendChild(li);
    });


}

function clearHistory() {
    localStorage.removeItem('pomodoroHistory');
    historyData = [];
    renderHistory();
    renderStats();
}

function calculateDailyStats() {
    const dailyTotals = {};

    historyData.forEach(item => {
        if (dailyTotals[item.date]) {
            dailyTotals[item.date] += item.elapsedSeconds;
        } else {
            dailyTotals[item.date] = item.elapsedSeconds;
        }
    });

    return dailyTotals;
}

function renderStats() {
    const statsDisplay = document.getElementById('stats-display');
    const stats = calculateDailyStats();

    statsDisplay.innerHTML = '';

    Object.keys(stats).forEach(date => {
        const totalSeconds = stats[date];
        const minutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const seconds = totalSeconds % 60;

        const div = document.createElement('div');
        div.textContent = `${date} : ${hours}시간 ${minutes}분 ${seconds}초`;
        statsDisplay.appendChild(div);
    })
}

const historySection = document.getElementById('history-section');
const showHistoryBtn = document.getElementById('show-history-btn');
showHistoryBtn.addEventListener('click', () => {
    if (historySection.style.display === 'none') {
        historySection.style.display = 'block';
        showHistoryBtn.textContent = '전체 기록 닫기';
    } else {
        historySection.style.display = 'none';
        showHistoryBtn.textContent = '전체 기록 보기';
    }
})


let currentCalendarDate = new Date();

function renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const stats = calculateDailyStats();

    for (let i = 0; i < lastDate + firstDayIndex; i++) {
        const cell = document.createElement('div');
        if (i < firstDayIndex) {
            cell.classList.add('empty-cell');
        } else {
            const day = i - firstDayIndex + 1;
            const date = new Date(year, month, day).toLocaleDateString();

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('day-name');
            dateDiv.textContent = day;
            cell.appendChild(dateDiv);

            if (stats[date]) {
                cell.classList.add('day-cell');
                const timeDiv = document.createElement('div');
                timeDiv.classList.add('focus-time');
                timeDiv.textContent = `${secToDate(stats[date])}`;
                cell.appendChild(timeDiv);
            } else {
                cell.classList.add('day-cell', 'empty');
            }
        }
        calendarDays.appendChild(cell);
    }
}

function secToDate(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
        const seconds = totalSeconds - hours * 3600 - minutes * 60;

        const text = `${hours}시간 ${minutes}분 ${seconds}초`;
        return text;
}


startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
setTimeBtn.addEventListener('click', setTimer);
clearHistoryBtn.addEventListener('click', clearHistory);

tabTimerBtn.addEventListener('click', () => {
    timerSection.style.display = 'block';
    todoSection.style.display = 'block';
    statsSection.style.display = 'none';
    tabTimerBtn.classList.add('active-tab');
    tabStatsBtn.classList.remove('active-tab');
  });

  tabStatsBtn.addEventListener('click', () => {
    timerSection.style.display = 'none';
    todoSection.style.display = 'none';
    statsSection.style.display = 'block';
    tabStatsBtn.classList.add('active-tab');
    tabTimerBtn.classList.remove('active-tab');
    renderCalendar(); // 통계 탭 열 때 달력 갱신
  });

// To-do list
let todoData = JSON.parse(localStorage.getItem('todoHistory')) || [];
const todoDisplay = document.getElementById('todo-list');
const addTodoBtn = document.getElementById('add-todo-btn');
const finTodoBtn = document.getElementById('fin-todo-btn');
const todoInput = document.getElementById('todo-input');
const contextMenu = document.getElementById('custom-context-menu');
let targetTodoId = null;
let selectedTodoIds = [];

function renderTodo() {
    todoDisplay.innerHTML = '';

    todoData.forEach(item => {
    const newList = document.createElement('li');
    const listDescription = document.createElement('span');
    listDescription.textContent = item.desc;
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';

    checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
            listDescription.style.textDecoration = 'line-through';
            listDescription.style.color = '#aaa';

            selectedTodoIds.push(item.id);
        } else {
            listDescription.style.textDecoration = 'none';
            listDescription.style.color = '#000';

            selectedTodoIds.filter(arr => arr !== item.id);
        }
    });

    newList.appendChild(listDescription);
    newList.appendChild(checkBox);

    // 우클릭 시 직접 만든 메뉴 나오는 이벤트 부착
    newList.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        targetTodoId = item.id;

        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    });

    todoDisplay.appendChild(newList);
    });
}

function addTodo() {
    if (todoInput.value) {
        const now = new Date();
        const record = {
            id: Date.now(),
            date: now.toLocaleDateString(),
            desc: todoInput.value,
        };

        todoData.push(record);
        localStorage.setItem('todoHistory', JSON.stringify(todoData));
        todoInput.value = '';
        renderTodo();
    } else {
        alert('올바른 내용을 입력하세요!');
    }
};

addTodoBtn.addEventListener('click', () => {
    addTodo();
})

window.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

// 투두 삭제 이벤트
document.getElementById('menu-delete').addEventListener('click', () => {
    if (targetTodoId) {
        todoData = todoData.filter(item => item.id !== targetTodoId);

        localStorage.setItem('todoHistory', JSON.stringify(todoData));
        renderTodo();

        targetTodoId = null;
    }
});

// 투두 수정 이벤트
document.getElementById('menu-edit').addEventListener('click', ()=> {
    if (targetTodoId) {
        const targetItem = todoData.find(item => item.id === targetTodoId);
        if (targetItem) {
            const newText = prompt('내용을 수정하세요:', targetItem.desc);
            if (newText) {
                targetItem.desc = newText;
                localStorage.setItem('todoHistory', JSON.stringify(todoData));
                renderTodo();
            }
        }
        targetTodoId = null;
    }
});

// 완료된 투두 정리
function finishTodo() {
    const now = new Date().toLocaleDateString();
    const cnt = selectedTodoIds.length;

    console.log(selectedTodoIds);
    let dailyHistory = JSON.parse(localStorage.getItem(now)) || { finishedTodos: [] };

    selectedTodoIds.forEach(id => {
        // 새 위치에 별도 저장
        const targetItem = todoData.find(item => item.id === id);
        if (targetItem) {
            dailyHistory.finishedTodos.push(targetItem.desc);
        }

        // 기존 데이터에서 삭제
        todoData = todoData.filter(item => item.id !== id);
    });

    // localstorage에 반영하기
    localStorage.setItem(now, JSON.stringify(dailyHistory));
    localStorage.setItem('todoHistory', JSON.stringify(todoData));

    alert(`${cnt}개가 완료되었습니다!`);
    selectedTodoIds = [];
    renderTodo();
}

finTodoBtn.addEventListener('click', () => {
    finishTodo();
})

function initTodo() {
    // 투두 리스트 로딩
    renderTodo();
    // 엔터로 투두 입력하기
    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTodo();
            todoInput.value = '';
        }
    });
};



// 메인 코드 실행
updateDisPlay();
renderHistory();
renderStats();
initTodo();
