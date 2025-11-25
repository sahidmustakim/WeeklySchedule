dayjs.extend(window.dayjs_plugin_isBetween);
dayjs.extend(window.dayjs_plugin_customParseFormat);

// --- CONFIGURATION ---

// Default Schedule Data (fallback if localStorage is empty)
// Days: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// Types: 'class', 'cnh' (Counseling Hour), 'oh' (Office Hour)

function getDefaultSchedule() {
    return [
        // SATURDAY (6)
        { id: 'sat-1', day: 6, start: '08:30', end: '09:50', title: 'CSE 2216 (E)', type: 'class', room: '427' },
        { id: 'sat-2', day: 6, start: '09:51', end: '11:10', title: 'CSE 2216 (E)', type: 'class', room: '427' },
        { id: 'sat-3', day: 6, start: '11:11', end: '12:30', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'sat-4', day: 6, start: '12:31', end: '13:50', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'sat-5', day: 6, start: '13:51', end: '15:10', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'sat-6', day: 6, start: '15:11', end: '16:30', title: 'Counseling Hour', type: 'cnh', room: '935-A' },

        // SUNDAY (0)
        { id: 'sun-1', day: 0, start: '08:30', end: '09:50', title: 'CSE 1112 (M)', type: 'class', room: '423' },
        { id: 'sun-2', day: 0, start: '09:51', end: '11:10', title: 'CSE 1112 (M)', type: 'class', room: '423' },
        { id: 'sun-3', day: 0, start: '11:11', end: '12:30', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'sun-4', day: 0, start: '12:31', end: '13:50', title: 'Office Hour', type: 'oh', room: '935-A' },
        { id: 'sun-5', day: 0, start: '13:51', end: '15:10', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'sun-6', day: 0, start: '15:11', end: '16:30', title: 'CSE 1111 (U)', type: 'class', room: '308' },

        // MONDAY (1)
        { id: 'mon-1', day: 1, start: '08:30', end: '09:50', title: 'Office Hour', type: 'oh', room: '935-A' },
        { id: 'mon-2', day: 1, start: '09:51', end: '11:10', title: 'Office Hour', type: 'oh', room: '935-A' },
        { id: 'mon-3', day: 1, start: '11:11', end: '12:30', title: 'Office Hour', type: 'oh', room: '935-A' },

        // TUESDAY (2)
        { id: 'tue-1', day: 2, start: '08:30', end: '09:50', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'tue-2', day: 2, start: '09:51', end: '11:10', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'tue-3', day: 2, start: '11:11', end: '12:30', title: 'CSE 1110 (G)', type: 'class', room: '326' },
        { id: 'tue-4', day: 2, start: '12:31', end: '13:50', title: 'CSE 1110 (G)', type: 'class', room: '326' },

        // WEDNESDAY (3)
        { id: 'wed-1', day: 3, start: '08:30', end: '09:50', title: 'CSE 1112 (Q)', type: 'class', room: '422' },
        { id: 'wed-2', day: 3, start: '09:51', end: '11:10', title: 'CSE 1112 (Q)', type: 'class', room: '422' },
        { id: 'wed-3', day: 3, start: '11:11', end: '12:30', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'wed-4', day: 3, start: '12:31', end: '13:50', title: 'Office Hour', type: 'oh', room: '935-A' },
        { id: 'wed-5', day: 3, start: '13:51', end: '15:10', title: 'Counseling Hour', type: 'cnh', room: '935-A' },
        { id: 'wed-6', day: 3, start: '15:11', end: '16:30', title: 'CSE 1111 (U)', type: 'class', room: '308' },
    ];
}

// Load schedule from localStorage or use default
function loadSchedule() {
    const stored = localStorage.getItem('scheduleData');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            console.log('✅ Loaded schedule from localStorage:', data.entries.length, 'entries');
            return data.entries || getDefaultSchedule();
        } catch (e) {
            console.warn('⚠️ Failed to parse schedule from localStorage, using default');
            return getDefaultSchedule();
        }
    }

    // First time - initialize localStorage with default schedule
    console.log('📦 Initializing schedule in localStorage');
    const defaultSchedule = getDefaultSchedule();
    const scheduleData = {
        version: 1,
        lastUpdated: Date.now(),
        entries: defaultSchedule
    };
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    return defaultSchedule;
}

// Dynamic schedule (loaded from localStorage)
let schedule = loadSchedule();

// --- DOM ELEMENTS ---
const currentDayTimeEl = document.getElementById('current-day-time');
const statusTitleEl = document.getElementById('status-title');
const statusDescEl = document.getElementById('status-desc');
const statusIconEl = document.getElementById('status-icon');
const nextItemEl = document.getElementById('next-item');
const progressBarEl = document.querySelector('.progress-bar');
const progressContainerEl = document.getElementById('progress-container');
const timeRemainingEl = document.getElementById('time-remaining');
const formalMessageEl = document.getElementById('formal-message');
const formalTextEl = document.getElementById('formal-text');

// --- LOGIC ---

// Check for admin status override
function checkAdminStatus() {
    const statusJson = localStorage.getItem('adminStatus');
    if (statusJson) {
        try {
            const status = JSON.parse(statusJson);
            return status;
        } catch (e) {
            return null;
        }
    }
    return null;
}

function updateTime() {
    const now = dayjs();
    currentDayTimeEl.textContent = now.format('dddd, h:mm A');

    // Check for admin override first
    const adminStatus = checkAdminStatus();
    if (adminStatus && adminStatus.enabled && adminStatus.message) {
        displayAdminStatus(adminStatus);
        return; // Don't check normal schedule
    }

    checkSchedule(now);
}

function displayAdminStatus(status) {
    // Update status card with admin message
    statusTitleEl.textContent = "⚠️ Special Notice";
    statusDescEl.textContent = status.message;
    statusIconEl.textContent = "📢";
    progressContainerEl.style.display = 'none';
    document.documentElement.style.setProperty('--accent-3', '#fbbf24'); // Yellow

    // Show formal message
    if (formalMessageEl) {
        formalMessageEl.style.display = 'block';
        formalTextEl.innerHTML = `<strong>Admin Update:</strong> ${status.message}`;
    }

    // Still show next scheduled activity
    const now = dayjs();
    const currentDay = now.day();

    let nextActivity = schedule.find(item => {
        if (item.day !== currentDay) return false;
        const start = dayjs(`${now.format('YYYY-MM-DD')} ${item.start}`);
        return start.isAfter(now);
    });

    if (!nextActivity) {
        for (let i = 1; i <= 7; i++) {
            let nextDay = (currentDay + i) % 7;
            let found = schedule.filter(item => item.day === nextDay).sort((a, b) => a.start.localeCompare(b.start))[0];
            if (found) {
                nextActivity = found;
                nextActivity.isFutureDay = true;
                nextActivity.dayName = dayjs().day(nextDay).format('dddd');
                break;
            }
        }
    }

    if (nextActivity) {
        let timeDisplay = dayjs(nextActivity.start, 'HH:mm').format('h:mm A');
        if (nextActivity.isFutureDay) {
            timeDisplay = `${nextActivity.dayName}, ${timeDisplay}`;
        }

        nextItemEl.innerHTML = `
            <span class="next-time">${timeDisplay}</span>
            <span class="next-activity">${nextActivity.title} <small>(${nextActivity.room})</small></span>
        `;
    } else {
        nextItemEl.innerHTML = `<span>No upcoming classes found.</span>`;
    }
}

function checkSchedule(now) {
    const currentDay = now.day();

    // Find current activity
    const currentActivity = schedule.find(item => {
        if (item.day !== currentDay) return false;
        const start = dayjs(`${now.format('YYYY-MM-DD')} ${item.start}`);
        const end = dayjs(`${now.format('YYYY-MM-DD')} ${item.end}`);
        return now.isBetween(start, end, null, '[]');
    });

    // Update Status Card
    if (currentActivity) {
        updateStatusCard(currentActivity, now);
    } else {
        // Free time
        statusTitleEl.textContent = "Free Time";
        statusDescEl.textContent = "I'm probably relaxing or preparing for the next class.";
        statusIconEl.textContent = "🚀";
        progressContainerEl.style.display = 'none';
        if (formalMessageEl) formalMessageEl.style.display = 'none';
        document.documentElement.style.setProperty('--accent-3', '#10b981'); // Green
    }

    // Find Next Activity
    let nextActivity = schedule.find(item => {
        if (item.day !== currentDay) return false;
        const start = dayjs(`${now.format('YYYY-MM-DD')} ${item.start}`);
        return start.isAfter(now);
    });

    if (!nextActivity) {
        for (let i = 1; i <= 7; i++) {
            let nextDay = (currentDay + i) % 7;
            let found = schedule.filter(item => item.day === nextDay).sort((a, b) => a.start.localeCompare(b.start))[0];
            if (found) {
                nextActivity = found;
                nextActivity.isFutureDay = true;
                nextActivity.dayName = dayjs().day(nextDay).format('dddd');
                break;
            }
        }
    }

    if (nextActivity) {
        let timeDisplay = dayjs(nextActivity.start, 'HH:mm').format('h:mm A');
        if (nextActivity.isFutureDay) {
            timeDisplay = `${nextActivity.dayName}, ${timeDisplay}`;
        }

        nextItemEl.innerHTML = `
            <span class="next-time">${timeDisplay}</span>
            <span class="next-activity">${nextActivity.title} <small>(${nextActivity.room})</small></span>
        `;
    } else {
        nextItemEl.innerHTML = `<span>No upcoming classes found.</span>`;
    }
}

function updateStatusCard(activity, now) {
    statusTitleEl.textContent = activity.title;

    let icon = "📚";
    let desc = `Class in Room ${activity.room}`;
    let color = "#3b82f6"; // Blue

    if (activity.type === 'cnh') {
        icon = "🤝";
        desc = "Counseling Hour";
        color = "#8b5cf6"; // Violet
    } else if (activity.type === 'oh') {
        icon = "💼";
        desc = "Office Hour";
        color = "#ec4899"; // Pink
    }

    statusIconEl.textContent = icon;
    statusDescEl.textContent = desc;
    document.documentElement.style.setProperty('--accent-3', color);

    // Progress Bar
    progressContainerEl.style.display = 'block';
    const start = dayjs(`${now.format('YYYY-MM-DD')} ${activity.start}`);
    const end = dayjs(`${now.format('YYYY-MM-DD')} ${activity.end}`);
    const totalDuration = end.diff(start);
    const elapsed = now.diff(start);
    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    progressBarEl.style.setProperty('--progress', `${percentage}%`);

    const minutesLeft = end.diff(now, 'minute');
    timeRemainingEl.textContent = `${minutesLeft} min remaining`;

    // Formal Message
    if (formalMessageEl) {
        formalMessageEl.style.display = 'block';
        let formalMsg = `I am currently taking a class in <strong>Room ${activity.room}</strong>.`;
        if (activity.type === 'cnh') formalMsg = `I am available for counseling in <strong>Room ${activity.room}</strong>.`;
        if (activity.type === 'oh') formalMsg = `I am in my office <strong>Room ${activity.room}</strong>.`;

        formalTextEl.innerHTML = `<strong>Formal Notice:</strong> ${formalMsg} Ends at ${dayjs(activity.end, 'HH:mm').format('h:mm A')}.`;
    }
}

// --- PLAYFUL UNIVERSE FLOATING EMOJIS (CANVAS) ---
const canvas = document.getElementById('universe-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let emojis = [];

    // Universe-themed emoji collection (stars + academic)
    const emojiList = ['⭐', '🌟', '✨', '💫', '🌠', '📚', '🎓', '💡', '📖', '✏️', '🔬', '🧮'];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Emoji class with space-like physics
    class FloatingEmoji {
        constructor(x, y, emoji = null, isMini = false) {
            this.x = x || Math.random() * width;
            this.y = y || -50; // Start from top for gentle falling
            this.emoji = emoji || emojiList[Math.floor(Math.random() * emojiList.length)];
            this.size = isMini ? Math.random() * 10 + 15 : Math.random() * 15 + 30; // 30-45px or 15-25px for mini
            this.speedX = (Math.random() - 0.5) * 0.5; // Gentle horizontal drift
            this.speedY = Math.random() * 0.3 + 0.2; // Gentle downward fall
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02; // Slow rotation
            this.opacity = Math.random() * 0.3 + 0.6; // 0.6-0.9
            this.twinkle = Math.random() * Math.PI * 2; // For twinkling effect
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            // Gentle falling movement (space-like)
            this.y += this.speedY;
            this.x += this.speedX;

            // Slow rotation for floating effect
            this.rotation += this.rotationSpeed;

            // Twinkling effect for stars
            this.twinkle += this.twinkleSpeed;

            // Wrap around horizontally (drift across the universe)
            if (this.x < -this.size) this.x = width + this.size;
            if (this.x > width + this.size) this.x = -this.size;

            // Respawn at top when it falls off bottom
            if (this.y > height + this.size) {
                this.y = -this.size;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();

            // Twinkling opacity for stars
            let drawOpacity = this.opacity;
            if (this.emoji.includes('⭐') || this.emoji.includes('🌟') || this.emoji.includes('✨') || this.emoji.includes('💫') || this.emoji.includes('🌠')) {
                drawOpacity = this.opacity * (0.7 + Math.sin(this.twinkle) * 0.3);
            }

            ctx.globalAlpha = drawOpacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, 0, 0);
            ctx.restore();
        }

        // Check if clicked
        isClicked(mouseX, mouseY) {
            const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
            return distance < this.size;
        }

        // Apply gentle push force (space-like)
        applyForce(x, y, strength) {
            const dx = this.x - x;
            const dy = this.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120 && distance > 0) {
                const force = (120 - distance) / 120 * strength;
                this.speedX += (dx / distance) * force * 0.3;
                this.speedY += (dy / distance) * force * 0.3;
            }
        }
    }

    // Initialize emojis
    function init() {
        emojis = [];
        const numberOfEmojis = Math.min(Math.floor((width * height) / 12000), 35);
        for (let i = 0; i < numberOfEmojis; i++) {
            const emoji = new FloatingEmoji();
            // Spread them across the screen initially
            emoji.y = Math.random() * height;
            emojis.push(emoji);
        }
    }
    init();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < emojis.length; i++) {
            emojis[i].update();
            emojis[i].draw();
        }

        requestAnimationFrame(animate);
    }
    animate();

    // Mouse interaction - gentle push away
    window.addEventListener('mousemove', (e) => {
        emojis.forEach(emoji => {
            emoji.applyForce(e.clientX, e.clientY, 0.3);
        });
    });

    // Click to split into 5 smaller versions
    window.addEventListener('click', (e) => {
        const clickedEmoji = emojis.find(emoji => emoji.isClicked(e.clientX, e.clientY));

        if (clickedEmoji) {
            // Create 5 smaller versions in a circular pattern
            for (let i = 0; i < 5; i++) {
                const newEmoji = new FloatingEmoji(clickedEmoji.x, clickedEmoji.y, clickedEmoji.emoji, true);
                const angle = (Math.PI * 2 / 5) * i;
                newEmoji.speedX = Math.cos(angle) * 3;
                newEmoji.speedY = Math.sin(angle) * 3;
                emojis.push(newEmoji);
            }

            // Remove the clicked emoji
            const index = emojis.indexOf(clickedEmoji);
            if (index > -1) {
                emojis.splice(index, 1);
            }
        }

        // Remove excess emojis if too many
        if (emojis.length > 60) {
            emojis.splice(0, emojis.length - 60);
        }
    });

    // Recreate emojis on window resize
    window.addEventListener('resize', () => {
        resize();
        init();
    });
}

// --- DYNAMIC SCHEDULE TABLE RENDERING ---

// Schedule configuration (same as admin panel)
const DAYS_ORDER = ['SAT', 'SUN', 'MON', 'TUE', 'WED'];
const DAY_NUMBERS = { 'SAT': 6, 'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3 };
const TIME_SLOTS = [
    { start: '08:30', end: '09:50' },
    { start: '09:51', end: '11:10' },
    { start: '11:11', end: '12:30' },
    { start: '12:31', end: '13:50' },
    { start: '13:51', end: '15:10' },
    { start: '15:11', end: '16:30' }
];

// Render the weekly schedule table dynamically
function renderWeeklySchedule() {
    const scheduleGridBody = document.getElementById('schedule-grid-body');
    if (!scheduleGridBody) return; // Exit if element doesn't exist

    scheduleGridBody.innerHTML = ''; // Clear existing content

    DAYS_ORDER.forEach(day => {
        const row = document.createElement('tr');

        // Day column
        const dayCell = document.createElement('td');
        dayCell.className = 'day-col';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        // Time slot columns
        const dayNum = DAY_NUMBERS[day];
        TIME_SLOTS.forEach(slot => {
            const cell = document.createElement('td');

            // Find entry for this day/time from the loaded schedule
            const entry = schedule.find(e =>
                e.day === dayNum && e.start === slot.start && e.end === slot.end
            );

            if (entry) {
                // For counseling/office hours, use abbreviated text
                if (entry.type === 'cnh') {
                    cell.textContent = 'CnH';
                    cell.className = 'cnh';
                } else if (entry.type === 'oh') {
                    cell.textContent = 'OH';
                    cell.className = 'oh';
                } else {
                    // For classes, show the title
                    cell.textContent = entry.title;
                }
            }

            row.appendChild(cell);
        });

        scheduleGridBody.appendChild(row);
    });

    console.log('📅 Weekly schedule table rendered');
}

// Initial rendering when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    renderWeeklySchedule(); // Render schedule table on page load  
    setInterval(updateTime, 1000); // Update every second for real-time admin status
});

// Listen for storage changes from admin panel (real-time sync across tabs)
window.addEventListener('storage', (e) => {
    // Admin status changed
    if (e.key === 'adminStatus') {
        console.log('Admin status changed by admin panel, updating display...');
        updateTime();
    }

    // Schedule data changed
    if (e.key === 'scheduleData') {
        console.log('📅 Schedule updated by admin panel, reloading...');
        schedule = loadSchedule();
        updateTime(); // Refresh display with new schedule
        renderWeeklySchedule(); // Re-render the schedule table
    }
});

