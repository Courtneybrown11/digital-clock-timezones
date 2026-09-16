// DOM Elements
const timezoneSelect = document.getElementById('timezoneSelect');
const addBtn = document.getElementById('addBtn');
const clocksContainer = document.getElementById('clocksContainer');
const defaultClocks = document.getElementById('defaultClocks');
const clearAllBtn = document.getElementById('clearAllBtn');

// State
let addedClocks = [];
const defaultTimezones = [
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderDefaultClocks();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
});

// Event listeners
addBtn.addEventListener('click', addClock);
timezoneSelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addClock();
});
clearAllBtn.addEventListener('click', clearAllClocks);

// Add a new clock
function addClock() {
    const timezone = timezoneSelect.value.trim();

    if (timezone === '') {
        alert('Please select a timezone!');
        return;
    }

    // Check for duplicates
    if (addedClocks.includes(timezone)) {
        alert('This timezone is already added!');
        return;
    }

    addedClocks.push(timezone);
    renderClocks();
    timezoneSelect.value = '';
    updateAllClocks();
}

// Remove a clock
function removeClock(timezone) {
    addedClocks = addedClocks.filter(tz => tz !== timezone);
    renderClocks();
}

// Clear all added clocks
function clearAllClocks() {
    if (addedClocks.length === 0) {
        alert('No clocks to clear!');
        return;
    }
    if (confirm('Are you sure you want to clear all added clocks?')) {
        addedClocks = [];
        renderClocks();
    }
}

// Render added clocks
function renderClocks() {
    clocksContainer.innerHTML = '';

    if (addedClocks.length === 0) {
        clocksContainer.innerHTML = '<div class="empty-state">No clocks added. Select a timezone above to add one!</div>';
        return;
    }

    addedClocks.forEach(timezone => {
        const widget = createClockWidget(timezone, false);
        clocksContainer.appendChild(widget);
    });
}

// Render default clocks
function renderDefaultClocks() {
    defaultClocks.innerHTML = '';
    defaultTimezones.forEach(timezone => {
        const widget = createClockWidget(timezone, true);
        defaultClocks.appendChild(widget);
    });
}

// Create a clock widget
function createClockWidget(timezone, isDefault) {
    const widget = document.createElement('div');
    widget.className = 'clock-widget';
    widget.id = `clock-${timezone}`;

    const tzName = getTimezoneName(timezone);
    const offset = getTimezoneOffset(timezone);

    let html = `
        <div class="clock-header">
            <div>
                <div class="timezone-name">${tzName}</div>
                <div class="timezone-offset">${offset}</div>
            </div>
    `;

    if (!isDefault) {
        html += `<button class="remove-btn" onclick="removeClock('${timezone}')">Remove</button>`;
    }

    html += `
        </div>
        <div class="digital-time" data-timezone="${timezone}">--:--:--</div>
        <div class="time-details">
            <div class="detail-item">
                <span class="detail-label">DATE</span>
                <span class="detail-value" data-date="${timezone}">--</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">DAY</span>
                <span class="detail-value" data-day="${timezone}">--</span>
            </div>
        </div>
    `;

    widget.innerHTML = html;
    return widget;
}

// Update all clocks
function updateAllClocks() {
    const allTimezones = [...addedClocks, ...defaultTimezones];
    
    allTimezones.forEach(timezone => {
        updateClock(timezone);
    });
}

// Update a single clock
function updateClock(timezone) {
    const time = getTimeInTimezone(timezone);

    // Update time
    const timeElement = document.querySelector(`[data-timezone="${timezone}"]`);
    if (timeElement) {
        timeElement.textContent = time.formatted;
    }

    // Update date
    const dateElement = document.querySelector(`[data-date="${timezone}"]`);
    if (dateElement) {
        dateElement.textContent = time.date;
    }

    // Update day
    const dayElement = document.querySelector(`[data-day="${timezone}"]`);
    if (dayElement) {
        dayElement.textContent = time.day;
    }
}

// Get current time in a specific timezone
function getTimeInTimezone(timezone) {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
            hour12: false
        });

        const now = new Date();
        const parts = formatter.formatToParts(now);

        let hour = '', minute = '', second = '';
        let year = '', month = '', day = '';
        let weekday = '';

        parts.forEach(part => {
            if (part.type === 'hour') hour = part.value;
            if (part.type === 'minute') minute = part.value;
            if (part.type === 'second') second = part.value;
            if (part.type === 'year') year = part.value;
            if (part.type === 'month') month = part.value;
            if (part.type === 'day') day = part.value;
            if (part.type === 'weekday') weekday = part.value;
        });

        const formatted = `${hour}:${minute}:${second}`;
        const date = `${month}/${day}/${year}`;

        return {
            formatted,
            date,
            day: weekday
        };
    } catch (e) {
        console.error('Error getting time for timezone:', timezone, e);
        return {
            formatted: '--:--:--',
            date: '--',
            day: '--'
        };
    }
}

// Get timezone name from identifier
function getTimezoneName(timezone) {
    const names = {
        'UTC': 'UTC / GMT',
        'America/New_York': 'New York',
        'America/Chicago': 'Chicago',
        'America/Denver': 'Denver',
        'America/Los_Angeles': 'Los Angeles',
        'America/Anchorage': 'Anchorage',
        'Pacific/Honolulu': 'Honolulu',
        'America/Toronto': 'Toronto',
        'America/Mexico_City': 'Mexico City',
        'America/Argentina/Buenos_Aires': 'Buenos Aires',
        'America/Sao_Paulo': 'São Paulo',
        'Europe/London': 'London',
        'Europe/Paris': 'Paris',
        'Europe/Berlin': 'Berlin',
        'Europe/Madrid': 'Madrid',
        'Europe/Rome': 'Rome',
        'Europe/Amsterdam': 'Amsterdam',
        'Europe/Brussels': 'Brussels',
        'Europe/Vienna': 'Vienna',
        'Europe/Prague': 'Prague',
        'Europe/Moscow': 'Moscow',
        'Europe/Istanbul': 'Istanbul',
        'Africa/Cairo': 'Cairo',
        'Africa/Johannesburg': 'Johannesburg',
        'Africa/Lagos': 'Lagos',
        'Asia/Dubai': 'Dubai',
        'Asia/Jerusalem': 'Jerusalem',
        'Asia/Kolkata': 'India - Kolkata',
        'Asia/Bangkok': 'Bangkok',
        'Asia/Singapore': 'Singapore',
        'Asia/Hong_Kong': 'Hong Kong',
        'Asia/Shanghai': 'Shanghai',
        'Asia/Tokyo': 'Tokyo',
        'Asia/Seoul': 'Seoul',
        'Asia/Manila': 'Manila',
        'Australia/Sydney': 'Sydney',
        'Australia/Melbourne': 'Melbourne',
        'Pacific/Auckland': 'Auckland'
    };

    return names[timezone] || timezone;
}

// Get timezone offset
function getTimezoneOffset(timezone) {
    try {
        const now = new Date();
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        
        const offset = (tzDate - utcDate) / 60000; // Convert to minutes
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        
        const sign = offset >= 0 ? '+' : '-';
        const offsetStr = `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        return `UTC ${offsetStr}`;
    } catch (e) {
        return 'UTC';
    }
}
