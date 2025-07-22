const motivationalQuotes = [
    { text: "The future depends on what you do today!", author: "Mahatma Gandhi" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Dream bigger. Do bigger.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { text: "Little things make big days.", author: "Unknown" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
    { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
    { text: "Dream it. Believe it. Build it.", author: "Unknown" }
];


const defaultFixedSchedule = [
    { time: '06:00', duration: 1, activity: '🏃‍♂️ Gym', type: 'fixed' },
    { time: '09:00', duration: 8, activity: '📚 College', type: 'fixed' },
    { time: '23:00', duration: 7, activity: '😴 Sleep', type: 'fixed' }
];

let fixedSchedule = [...defaultFixedSchedule];
let dailyTasks = [];


let scheduleData = JSON.parse(localStorage.getItem('dailySchedulePlanner')) || {}; 


document.getElementById('selectedDate').addEventListener('change', loadScheduleForDate);


function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60) % 24; 
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function getNewQuote() {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationalQuote').textContent = randomQuote.text;
    document.getElementById('quoteAuthor').textContent = `- ${randomQuote.author}`;
}

function saveNotes() {
    const selectedDate = document.getElementById('selectedDate').value;
    if (!selectedDate) return; 

    if (!scheduleData[selectedDate]) {
        scheduleData[selectedDate] = {};
    }
    scheduleData[selectedDate].notes = document.getElementById('dailyNotes').value;
    localStorage.setItem('dailySchedulePlanner', JSON.stringify(scheduleData));
}

function loadNotes() {
    const selectedDate = document.getElementById('selectedDate').value;
    if (!selectedDate) return; 

    const notes = scheduleData[selectedDate]?.notes || '';
    document.getElementById('dailyNotes').value = notes;
}

function setMood(mood) {
    const selectedDate = document.getElementById('selectedDate').value;
    if (!selectedDate) return; 
    
    document.querySelectorAll('.mood-emoji').forEach(emoji => {
        emoji.classList.remove('selected');
    });
    
    const selectedEmoji = document.querySelector(`[data-mood="${mood}"]`);
    if (selectedEmoji) {
        selectedEmoji.classList.add('selected');
    }
    
    if (!scheduleData[selectedDate]) {
        scheduleData[selectedDate] = {};
    }
    scheduleData[selectedDate].mood = mood;
    localStorage.setItem('dailySchedulePlanner', JSON.stringify(scheduleData));
    
    const moodMessages = {
        excited: "Amazing energy! Channel it into your tasks! 🚀",
        happy: "Great mood! Perfect for tackling your schedule! 😊",
        neutral: "Balanced day ahead. Stay focused! 💪",
        tired: "Take breaks when needed. You've got this! 😴",
        stressed: "Breathe deep. Break tasks into smaller steps! 🧘‍♂️"
    };
    
    document.getElementById('moodMessage').textContent = moodMessages[mood];
}

function loadMood() {
    const selectedDate = document.getElementById('selectedDate').value;
    if (!selectedDate) return; 

    const mood = scheduleData[selectedDate]?.mood;
    
    document.querySelectorAll('.mood-emoji').forEach(emoji => {
        emoji.classList.remove('selected');
    });
    
    if (mood) {
        const selectedEmoji = document.querySelector(`[data-mood="${mood}"]`);
        if (selectedEmoji) { 
            selectedEmoji.classList.add('selected');
        }
        const moodMessages = {
            excited: "Amazing energy! Channel it into your tasks! 🚀",
            happy: "Great mood! Perfect for tackling your schedule! 😊",
            neutral: "Balanced day ahead. Stay focused! 💪",
            tired: "Take breaks when needed. You've got this! 😴",
            stressed: "Breathe deep. Break tasks into smaller steps! 🧘‍♂️"
        };
        document.getElementById('moodMessage').textContent = moodMessages[mood];
    } else {
        document.getElementById('moodMessage').textContent = '';
    }
}

function updateStats() {
    const tasksCount = dailyTasks.length;
    const totalTime = dailyTasks.reduce((sum, task) => sum + task.duration, 0);
    const highPriorityCount = dailyTasks.filter(task => task.priority === 'high').length;
    
    const fixedTime = fixedSchedule.reduce((sum, item) => item.time === '23:00' && item.duration === 7 ? sum + 7 : sum + item.duration, 0); 
    const freeTime = Math.max(0, 24 - fixedTime - totalTime);
    
    const availableTime = 24 - fixedTime;
    const productivity = availableTime > 0 ? Math.round((totalTime / availableTime) * 100) : 0;
    
    document.getElementById('tasksCount').textContent = tasksCount;
    document.getElementById('totalTime').textContent = totalTime.toFixed(1) + 'h';
    document.getElementById('highPriorityCount').textContent = highPriorityCount;
    document.getElementById('freeTime').textContent = freeTime.toFixed(1) + 'h';
    document.getElementById('productivityPercent').textContent = productivity + '%';
    document.getElementById('productivityFill').style.width = productivity + '%';
}

function initializeCalendar() {
    const today = new Date();
    const dateInput = document.getElementById('selectedDate');
    const currentDay = document.getElementById('currentDay');
    
    const todayISO = today.toISOString().split('T')[0];
    dateInput.value = todayISO;
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    currentDay.textContent = dayNames[today.getDay()];
    
    loadScheduleForDate();
}

function loadScheduleForDate() {
    const selectedDateValue = document.getElementById('selectedDate').value;
    const date = new Date(selectedDateValue);
    
    if (isNaN(date.getTime())) { 
        console.error("Invalid date selected:", selectedDateValue);
        document.getElementById('currentDay').textContent = 'Invalid Date';
        return; 
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    document.getElementById('currentDay').textContent = dayNames[date.getDay()];
    
    if (scheduleData[selectedDateValue]) {
        fixedSchedule = scheduleData[selectedDateValue].fixed ? [...scheduleData[selectedDateValue].fixed] : [...defaultFixedSchedule];
        dailyTasks = scheduleData[selectedDateValue].tasks ? [...scheduleData[selectedDateValue].tasks] : [];
    } else {
        fixedSchedule = [...defaultFixedSchedule];
        dailyTasks = [];
    }
    
    updateFixedScheduleDisplay();
    updateTaskList();
    loadNotes();
    loadMood();
    updateStats();
    generateSchedule();
}

function saveScheduleForDate() {
    const selectedDate = document.getElementById('selectedDate').value;
    if (!selectedDate) return; 

    scheduleData[selectedDate] = {
        fixed: [...fixedSchedule],
        tasks: [...dailyTasks],
        notes: document.getElementById('dailyNotes').value,
        mood: document.querySelector('.mood-emoji.selected')?.dataset.mood || ''
    };
    localStorage.setItem('dailySchedulePlanner', JSON.stringify(scheduleData));
}

function updateFixedScheduleDisplay() {
    const fixedScheduleDisplay = document.getElementById('fixedScheduleDisplay');
    fixedScheduleDisplay.innerHTML = '';
    
    fixedSchedule.forEach((item, index) => {
        const fixedItem = document.createElement('div');
        fixedItem.className = 'fixed-item';
        
        let endTimeMinutes = timeToMinutes(item.time) + (item.duration * 60);
        let timeDisplay = `${item.time} - ${minutesToTime(endTimeMinutes)}`;

        if (endTimeMinutes >= 24 * 60) {
            timeDisplay = `${item.time} - ${minutesToTime(endTimeMinutes % (24 * 60))} (Next day)`;
        }
        
        fixedItem.innerHTML = `
            <span class="time">${timeDisplay}</span>
            <span class="activity">${item.activity}</span>
            <button class="delete-fixed" onclick="deleteFixedActivity(${index})">Delete</button>
        `;
        
        fixedScheduleDisplay.appendChild(fixedItem);
    });
}

function addFixedActivity() {
    const time = document.getElementById('fixedTime').value;
    const duration = parseFloat(document.getElementById('fixedDuration').value);
    const activity = document.getElementById('fixedActivity').value.trim();

    if (!time || isNaN(duration) || duration <= 0 || !activity) {
        alert('Please provide a valid time, duration, and activity for the fixed schedule.');
        return;
    }

    const activityWithEmoji = activity.match(/[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u) ? activity : `⭐ ${activity}`;

    fixedSchedule.push({
        time: time,
        duration: duration,
        activity: activityWithEmoji,
        type: 'fixed'
    });

    fixedSchedule.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    document.getElementById('fixedTime').value = '';
    document.getElementById('fixedDuration').value = '';
    document.getElementById('fixedActivity').value = '';

    updateFixedScheduleDisplay();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); 
}

function deleteFixedActivity(index) {
    fixedSchedule.splice(index, 1);
    updateFixedScheduleDisplay();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); 
}

function resetToDefault() {
    fixedSchedule = [...defaultFixedSchedule];
    updateFixedScheduleDisplay();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); 
}

function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; 

    dailyTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = `fixed-item task-list-item priority-${task.priority}`; 
        taskItem.innerHTML = `
            <span class="activity">${task.name} <span class="task-priority-badge priority-${task.priority}-badge">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span></span>
            <span class="time">${task.duration}h</span>
            <button class="delete-fixed" onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const taskDuration = parseFloat(document.getElementById('taskDuration').value);
    const taskPriority = document.getElementById('taskPriority').value;

    if (!taskName || isNaN(taskDuration) || taskDuration <= 0) {
        alert('Please enter a valid task name and duration.');
        return;
    }

    dailyTasks.push({
        name: taskName,
        duration: taskDuration,
        priority: taskPriority,
        type: 'task'
    });

    document.getElementById('taskName').value = '';
    document.getElementById('taskDuration').value = '';
    document.getElementById('taskPriority').value = 'medium'; 

    updateTaskList();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); 
}

function deleteTask(index) {
    dailyTasks.splice(index, 1); 
    updateTaskList(); 
    updateStats();
    saveScheduleForDate();
    generateSchedule(); 
}

function generateSchedule() {
    let availableTimeSlots = Array(24 * 60).fill(true); 
    let scheduleItemsForDisplay = []; 

    fixedSchedule.forEach(item => {
        let startMinutes = timeToMinutes(item.time);
        let durationMinutes = item.duration * 60;
        let endMinutesAbsolute = startMinutes + durationMinutes;

        if (endMinutesAbsolute > 24 * 60) { 
            let part1EndMinutes = 24 * 60;
            for (let i = startMinutes; i < part1EndMinutes; i++) {
                availableTimeSlots[i] = false;
            }
            scheduleItemsForDisplay.push({ 
                ...item, 
                start: startMinutes, 
                end: part1EndMinutes, 
                isOvernightStart: true 
            });

            let part2EndMinutes = endMinutesAbsolute % (24 * 60); 
            for (let i = 0; i < part2EndMinutes; i++) {
                availableTimeSlots[i] = false;
            }
            scheduleItemsForDisplay.push({ 
                ...item, 
                start: 0, 
                end: part2EndMinutes,
                isOvernightEnd: true 
            });

        } else { 
            for (let i = startMinutes; i < endMinutesAbsolute; i++) {
                availableTimeSlots[i] = false;
            }
            scheduleItemsForDisplay.push({ ...item, start: startMinutes, end: endMinutesAbsolute });
        }
    });

    const sortedTasks = [...dailyTasks].sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.duration - a.duration; 
    });

    sortedTasks.forEach(originalTask => {
        let taskRemainingMinutes = originalTask.duration * 60;
        
        while (taskRemainingMinutes > 0) {
            let foundSlotInThisPass = false;
            let currentFreeSlotStart = -1;
            
            for (let i = 0; i < 24 * 60; i++) {
                if (availableTimeSlots[i]) {
                    if (currentFreeSlotStart === -1) { 
                        currentFreeSlotStart = i;
                    }
                } else {
                    if (currentFreeSlotStart !== -1) { 
                        let currentFreeSlotLength = i - currentFreeSlotStart;
                        if (currentFreeSlotLength > 0) {
                            let minutesToPlace = Math.min(taskRemainingMinutes, currentFreeSlotLength);
                            
                            for (let j = 0; j < minutesToPlace; j++) {
                                availableTimeSlots[currentFreeSlotStart + j] = false;
                            }

                            scheduleItemsForDisplay.push({
                                ...originalTask, 
                                start: currentFreeSlotStart,
                                end: currentFreeSlotStart + minutesToPlace,
                                type: 'task', 
                            });

                            taskRemainingMinutes -= minutesToPlace;
                            foundSlotInThisPass = true;
                            break; 
                        }
                    }
                    currentFreeSlotStart = -1; 
                }
            }
            if (!foundSlotInThisPass && currentFreeSlotStart !== -1 && taskRemainingMinutes > 0) {
                let currentFreeSlotLength = (24 * 60) - currentFreeSlotStart;
                let minutesToPlace = Math.min(taskRemainingMinutes, currentFreeSlotLength);

                for (let j = 0; j < minutesToPlace; j++) {
                    availableTimeSlots[currentFreeSlotStart + j] = false;
                }

                scheduleItemsForDisplay.push({
                    ...originalTask,
                    start: currentFreeSlotStart,
                    end: currentFreeSlotStart + minutesToPlace,
                    type: 'task',
                });

                taskRemainingMinutes -= minutesToPlace;
                foundSlotInThisPass = true;
            }

            if (!foundSlotInThisPass && taskRemainingMinutes > 0) {
                console.warn(`Task "${originalTask.name}" could not be fully placed. Remaining: ${taskRemainingMinutes / 60}h`);
                break; 
            }
             if (taskRemainingMinutes <= 0) { 
                break;
            }
        }
    });

    scheduleItemsForDisplay.sort((a, b) => a.start - b.start);

    let currentTime = 0;
    const finalSchedule = [];

    scheduleItemsForDisplay.forEach(item => {
        if (item.start > currentTime && !(item.start === 0 && item.isOvernightEnd && currentTime === 0)) {
            finalSchedule.push({
                type: 'free',
                activity: '🛋️ Free Time',
                start: currentTime,
                end: item.start
            });
        }
        finalSchedule.push(item);
        currentTime = item.end;
    });

    if (currentTime < 24 * 60) { 
        finalSchedule.push({
            type: 'free',
            activity: '🛋️ Free Time',
            start: currentTime,
            end: 24 * 60 
        });
    }

    displaySchedule(finalSchedule);
}

function displaySchedule(scheduleToDisplay) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = ''; 

    let previousEndTime = 0;
    scheduleToDisplay.forEach(item => {
        const itemStartMinutes = item.start;
        const itemEndMinutes = item.end;

        if (itemStartMinutes > previousEndTime) {
            timeline.appendChild(createTimelineItem({
                type: 'free',
                activity: '🛋️ Free Time',
                start: previousEndTime,
                end: itemStartMinutes
            }));
        }

        timeline.appendChild(createTimelineItem(item));
        previousEndTime = itemEndMinutes;
    });

    if (previousEndTime < 24 * 60) { 
        timeline.appendChild(createTimelineItem({
            type: 'free',
            activity: '🛋️ Free Time',
            start: previousEndTime,
            end: 24 * 60 
        }));
    }
}


function createTimelineItem(item) {
    const timelineItem = document.createElement('div');
    const itemClasses = ['timeline-item', item.type];
    
    let contentHTML = '';
    let timeRange = '';

    if (item.type === 'fixed') {
        let displayStartTime = minutesToTime(item.start);
        let displayEndTime = minutesToTime(item.end);

        if (item.isOvernightStart) { 
            timeRange = `${item.time} - 00:00 (Midnight)`; 
        } else if (item.isOvernightEnd) { 
            timeRange = `00:00 - ${displayEndTime} (Next day)`; 
        } else { 
            timeRange = `${displayStartTime} - ${displayEndTime}`;
        }
        contentHTML = `<span class="activity-name">${item.activity}</span>`;
    } else { 
        timeRange = `${minutesToTime(item.start)} - ${minutesToTime(item.end)}`;
        
        if (item.type === 'task') {
            contentHTML = `<span class="activity-name">${item.name}</span>`; 
            itemClasses.push(`priority-${item.priority}-task`);
            contentHTML += `<span class="task-priority-badge priority-${item.priority}-badge">${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}</span>`;
            

            contentHTML += `<button class="delete-btn" onclick="deleteTaskFromTimeline('${item.name}', ${item.duration}, '${item.priority}')">Remove</button>`;
        } else if (item.type === 'free') {
            contentHTML = `<span class="activity-name">${item.activity}</span>`; 
        }
    }

    timelineItem.classList.add(...itemClasses);
    timelineItem.innerHTML = `
        <div class="time-slot">${timeRange}</div>
        ${contentHTML}
    `;
    return timelineItem;
}


function deleteTaskFromTimeline(name, duration, priority) {
   
    const indexToDelete = dailyTasks.findIndex(task => 
        task.name === name && 
        task.duration === duration && 
        task.priority === priority
    );

    if (indexToDelete !== -1) {
        dailyTasks.splice(indexToDelete, 1); 
        updateTaskList(); 
        updateStats(); 
        saveScheduleForDate(); 
        generateSchedule(); 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    getNewQuote(); 
});
