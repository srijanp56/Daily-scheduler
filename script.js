// Motivational quotes
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

// Default and custom fixed schedules
const defaultFixedSchedule = [
    { time: '06:00', duration: 1, activity: '🏃‍♂️ Gym', type: 'fixed' },
    { time: '09:00', duration: 8, activity: '📚 College', type: 'fixed' },
    { time: '23:00', duration: 7, activity: '😴 Sleep', type: 'fixed' }
];

let fixedSchedule = [...defaultFixedSchedule];
let dailyTasks = [];
let generatedSchedule = [];
// Use localStorage for basic data persistence
let scheduleData = JSON.parse(localStorage.getItem('dailySchedulePlanner')) || {}; 

// Event Listener for date change
document.getElementById('selectedDate').addEventListener('change', loadScheduleForDate);

// Helper function to convert "HH:MM" to minutes from midnight
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// Helper function to convert minutes from midnight to "HH:MM"
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60) % 24; // Use modulo 24 for overflow (e.g., 25:00 becomes 01:00)
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
    const notes = document.getElementById('dailyNotes').value;
    
    if (!scheduleData[selectedDate]) {
        scheduleData[selectedDate] = {};
    }
    scheduleData[selectedDate].notes = notes;
    localStorage.setItem('dailySchedulePlanner', JSON.stringify(scheduleData));
}

function loadNotes() {
    const selectedDate = document.getElementById('selectedDate').value;
    const notes = scheduleData[selectedDate]?.notes || '';
    document.getElementById('dailyNotes').value = notes;
}

function setMood(mood) {
    const selectedDate = document.getElementById('selectedDate').value;
    
    // Remove previous selection
    document.querySelectorAll('.mood-emoji').forEach(emoji => {
        emoji.classList.remove('selected');
    });
    
    // Add selection to clicked mood
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
    
    // Save mood
    if (!scheduleData[selectedDate]) {
        scheduleData[selectedDate] = {};
    }
    scheduleData[selectedDate].mood = mood;
    localStorage.setItem('dailySchedulePlanner', JSON.stringify(scheduleData));
    
    // Show mood message
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
    const mood = scheduleData[selectedDate]?.mood;
    
    // Clear previous selection
    document.querySelectorAll('.mood-emoji').forEach(emoji => {
        emoji.classList.remove('selected');
    });
    
    if (mood) {
        const selectedEmoji = document.querySelector(`[data-mood="${mood}"]`);
        if (selectedEmoji) { // Check if emoji exists before adding class
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
    
    // Calculate free time (24 hours minus fixed schedule and tasks)
    const fixedTime = fixedSchedule.reduce((sum, item) => item.time === '23:00' && item.duration === 7 ? sum + 7 : sum + item.duration, 0); // Special handling for sleep
    const freeTime = Math.max(0, 24 - fixedTime - totalTime);
    
    // Calculate productivity (tasks time / available time * 100)
    const availableTime = 24 - fixedTime;
    const productivity = availableTime > 0 ? Math.round((totalTime / availableTime) * 100) : 0;
    
    document.getElementById('tasksCount').textContent = tasksCount;
    document.getElementById('totalTime').textContent = totalTime.toFixed(1) + 'h';
    document.getElementById('highPriorityCount').textContent = highPriorityCount;
    document.getElementById('freeTime').textContent = freeTime.toFixed(1) + 'h';
    document.getElementById('productivityPercent').textContent = productivity + '%';
    document.getElementById('productivityFill').style.width = productivity + '%';
}

// Initialize calendar
function initializeCalendar() {
    const today = new Date();
    const dateInput = document.getElementById('selectedDate');
    const currentDay = document.getElementById('currentDay');
    
    // Set today's date
    dateInput.value = today.toISOString().split('T')[0];
    
    // Update day display
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    currentDay.textContent = dayNames[today.getDay()];
    
    // Load schedule for today
    loadScheduleForDate();
}

function loadScheduleForDate() {
    const selectedDate = document.getElementById('selectedDate').value;
    const date = new Date(selectedDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    document.getElementById('currentDay').textContent = dayNames[date.getDay()];
    
    // Load data for this date
    if (scheduleData[selectedDate]) {
        fixedSchedule = scheduleData[selectedDate].fixed ? [...scheduleData[selectedDate].fixed] : [...defaultFixedSchedule];
        dailyTasks = scheduleData[selectedDate].tasks ? [...scheduleData[selectedDate].tasks] : [];
    } else {
        fixedSchedule = [...defaultFixedSchedule]; // Reset to default fixed schedule for new dates
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
        
        // Handle overnight fixed activities (like sleep)
        let endTimeMinutes = timeToMinutes(item.time) + (item.duration * 60);
        let endTimeDisplay = minutesToTime(endTimeMinutes);

        // If end time goes past midnight (24:00), display it as the next day's time
        if (endTimeMinutes >= 24 * 60) {
            endTimeDisplay = minutesToTime(endTimeMinutes % (24 * 60)); // Wrap around for next day
             // Optional: Add a visual indicator like "+1 day" if needed
        }

        const timeDisplay = `${item.time} - ${endTimeDisplay}`;
        
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

    // Add emoji if not present (simple check for common emoji range or existing emoji)
    const activityWithEmoji = activity.match(/[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u) ? activity : `⭐ ${activity}`;

    fixedSchedule.push({
        time: time,
        duration: duration,
        activity: activityWithEmoji,
        type: 'fixed'
    });

    // Sort by time
    fixedSchedule.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    document.getElementById('fixedTime').value = '';
    document.getElementById('fixedDuration').value = '';
    document.getElementById('fixedActivity').value = '';

    updateFixedScheduleDisplay();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); // Regenerate full schedule after adding fixed activity
}

function deleteFixedActivity(index) {
    fixedSchedule.splice(index, 1);
    updateFixedScheduleDisplay();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); // Regenerate full schedule after deleting fixed activity
}

function resetToDefault() {
    fixedSchedule = [...defaultFixedSchedule];
    updateFixedScheduleDisplay();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); // Regenerate full schedule after resetting
}

function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear current tasks

    dailyTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = `fixed-item task-list-item priority-${task.priority}`; // Reusing fixed-item for styling consistency
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

    // Clear input fields
    document.getElementById('taskName').value = '';
    document.getElementById('taskDuration').value = '';
    document.getElementById('taskPriority').value = 'medium'; // Reset to default priority

    updateTaskList();
    updateStats();
    saveScheduleForDate();
    generateSchedule(); // Regenerate full schedule
}

function deleteTask(index) {
    dailyTasks.splice(index, 1); // Remove task from array
    updateTaskList(); // Update display
    updateStats();
    saveScheduleForDate();
    generateSchedule(); // Regenerate full schedule
}

function generateSchedule() {
    let availableTimeSlots = Array(24 * 60).fill(true); // Representing minutes in a day
    generatedSchedule = [];

    // Mark fixed schedule times as unavailable
    fixedSchedule.forEach(item => {
        let startMinutes = timeToMinutes(item.time);
        let endMinutes = startMinutes + (item.duration * 60);

        if (endMinutes > 24 * 60) { // Handle overnight fixed activities
            for (let i = startMinutes; i < 24 * 60; i++) {
                availableTimeSlots[i] = false;
            }
            for (let i = 0; i < endMinutes - (24 * 60); i++) {
                availableTimeSlots[i] = false;
            }
        } else {
            for (let i = startMinutes; i < endMinutes; i++) {
                availableTimeSlots[i] = false;
            }
        }
        generatedSchedule.push({ ...item, start: startMinutes, end: endMinutes, originalOrder: generatedSchedule.length });
    });

    // Sort tasks by priority (high to low) and then by duration (longest first)
    const sortedTasks = [...dailyTasks].sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.duration - a.duration; // Longest duration first for same priority
    });

    // Place tasks into available slots
    sortedTasks.forEach(task => {
        let taskDurationMinutes = task.duration * 60;
        let placed = false;

        // Find the earliest available continuous slot for the task
        for (let i = 0; i <= (24 * 60) - taskDurationMinutes; i++) {
            let isSlotAvailable = true;
            for (let j = 0; j < taskDurationMinutes; j++) {
                if (!availableTimeSlots[i + j]) {
                    isSlotAvailable = false;
                    i = i + j; // Jump ahead to avoid checking already occupied slots
                    break;
                }
            }
            if (isSlotAvailable) {
                // Mark slot as unavailable
                for (let j = 0; j < taskDurationMinutes; j++) {
                    availableTimeSlots[i + j] = false;
                }
                generatedSchedule.push({
                    ...task,
                    start: i,
                    end: i + taskDurationMinutes
                });
                placed = true;
                break;
            }
        }

        if (!placed) {
            // If a task can't be placed continuously, try breaking it up (optional, more complex)
            // For now, if it can't be placed, it's just not added to the generated schedule
            console.warn(`Task "${task.name}" could not be fully placed.`);
        }
    });

    // Sort the entire schedule by start time
    generatedSchedule.sort((a, b) => a.start - b.start);

    // Fill in free time gaps
    let currentTime = 0;
    const finalSchedule = [];

    generatedSchedule.forEach(item => {
        if (item.start > currentTime) {
            // Add free time
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

    // Add remaining free time until end of day (or wrap around if fixed activity ends beyond midnight)
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
    timeline.innerHTML = ''; // Clear current timeline

    // Remove any items that are fixed activities going beyond midnight (e.g., sleep from 23:00 to 06:00)
    // These are already handled by the start/end calculations and don't need a duplicate entry for the 'next day' portion
    const filteredSchedule = scheduleToDisplay.filter(item => !(item.type === 'fixed' && timeToMinutes(item.time) + (item.duration * 60) > 24 * 60 && item.start < item.end));


    let previousEndTime = 0;
    filteredSchedule.forEach(item => {
        const itemStartMinutes = item.start;
        const itemEndMinutes = item.end;

        // If there's a gap between the previous item and this one, it's free time
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

    // Handle any remaining free time until midnight
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
        // Fixed items get their time directly from 'time' and 'duration' for consistent display
        let fixedEndTimeMinutes = timeToMinutes(item.time) + (item.duration * 60);
        let fixedEndTimeDisplay = minutesToTime(fixedEndTimeMinutes);
        if (fixedEndTimeMinutes >= 24 * 60) { // If it spans into the next day
            fixedEndTimeDisplay = minutesToTime(fixedEndTimeMinutes % (24 * 60)); // Wrap around
            timeRange = `${item.time} - ${fixedEndTimeDisplay} (Next day)`;
        } else {
            timeRange = `${item.time} - ${fixedEndTimeDisplay}`;
        }
        contentHTML = `<span class="activity-name">${item.activity}</span>`;
    } else { // 'task' or 'free'
        timeRange = `${minutesToTime(item.start)} - ${minutesToTime(item.end)}`;
        contentHTML = `<span class="activity-name">${item.activity}</span>`;
        if (item.type === 'task') {
            itemClasses.push(`priority-${item.priority}-task`);
            contentHTML += `<span class="task-priority-badge priority-${item.priority}-badge">${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}</span>`;
            contentHTML += `<button class="delete-btn" onclick="deleteTaskFromTimeline('${item.name}', ${item.duration}, '${item.priority}')">Remove</button>`;
        }
    }

    timelineItem.classList.add(...itemClasses);
    timelineItem.innerHTML = `
        <div class="time-slot">${timeRange}</div>
        ${contentHTML}
    `;
    return timelineItem;
}

// Function to delete a task specifically from the timeline display and underlying dailyTasks array
// This is necessary because tasks in the timeline are copies, not directly linked to original indices.
function deleteTaskFromTimeline(name, duration, priority) {
    // Find the index of the task in the dailyTasks array
    const indexToDelete = dailyTasks.findIndex(task => 
        task.name === name && 
        task.duration === duration && 
        task.priority === priority
    );

    if (indexToDelete !== -1) {
        dailyTasks.splice(indexToDelete, 1); // Remove task
        updateTaskList(); // Update the task list display on the sidebar
        updateStats(); // Update statistics
        saveScheduleForDate(); // Save the updated daily tasks
        generateSchedule(); // Regenerate and display the full schedule
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    getNewQuote(); // Display a random quote on load
});
