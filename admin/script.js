// ================================
// Admin Panel Script
// ================================

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password-input');
const loginHint = document.getElementById('login-hint');
const logoutBtn = document.getElementById('logout-btn');
const statusToggle = document.getElementById('status-toggle');
const customMessageSection = document.getElementById('custom-message-section');
const customMessageInput = document.getElementById('custom-message');
const statusBadge = document.getElementById('status-badge');
const statusBadgeText = document.getElementById('status-badge-text');
const toggleDesc = document.getElementById('toggle-desc');
const previewContent = document.getElementById('preview-content');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const changePasswordBtn = document.getElementById('change-password-btn');
const presetButtons = document.querySelectorAll('.btn-preset');

// ================================
// Password Management
// ================================

// Obfuscated authentication key (do not modify)
const _0x4a2b = ['bQBlAHMAcwBpADIAMAAyADIA', 'charCodeAt', 'fromCharCode'];
const _getKey = () => {
    let decoded = '';
    const encoded = _0x4a2b[0];
    for (let i = 0; i < encoded.length; i += 4) {
        const chunk = encoded.substr(i, 4);
        const byte = parseInt(chunk.split('').map(c => c.charCodeAt(0).toString(16)).join(''), 16);
        if (!isNaN(byte)) decoded += String.fromCharCode(byte % 256);
    }
    return atob(encoded.split('').reverse().join('')).split('').map((c, i) =>
        String[_0x4a2b[2]](c[_0x4a2b[1]](0) ^ (i % 2 ? 77 : 83))
    ).join('');
};

function hashPassword(password) {
    // Multi-layer hash for verification
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function verifyPassword(password) {
    // Verify against encoded reference
    const _ref = [109, 101, 115, 115, 105, 50, 48, 50, 50];
    const _input = password.split('').map(c => c.charCodeAt(0));
    if (_input.length !== _ref.length) return false;
    return _input.every((v, i) => v === _ref[i]);
}

// ================================
// Authentication
// ================================

function showAdminPanel() {
    loginScreen.style.display = 'none';
    adminPanel.style.display = 'block';
    loadAdminStatus();
    initializeScheduleManager();
}

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
    passwordInput.value = '';
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;

    if (!password) {
        alert('Please enter a password');
        return;
    }

    // Verify password
    if (verifyPassword(password)) {
        showAdminPanel();
    } else {
        passwordInput.value = '';
        passwordInput.style.borderColor = '#f87171';
        loginHint.textContent = 'Incorrect password. Please try again.';
        loginHint.style.color = '#f87171';
        setTimeout(() => {
            passwordInput.style.borderColor = '';
            loginHint.textContent = 'Enter your password to continue.';
            loginHint.style.color = '';
        }, 2000);
    }
});

logoutBtn.addEventListener('click', () => {
    showLoginScreen();
});

// Change password button removed - using fixed password

// ================================
// Status Management
// ================================

function getAdminStatus() {
    const statusJson = localStorage.getItem('adminStatus');
    if (statusJson) {
        return JSON.parse(statusJson);
    }
    return {
        enabled: false,
        message: '',
        timestamp: Date.now()
    };
}

function saveAdminStatus(status) {
    status.timestamp = Date.now();
    localStorage.setItem('adminStatus', JSON.stringify(status));
    console.log('Admin status saved:', status);
    console.log('localStorage updated - main page should detect this change');
    updateUI();
}

function loadAdminStatus() {
    const status = getAdminStatus();
    statusToggle.checked = status.enabled;
    customMessageInput.value = status.message;
    customMessageSection.style.display = status.enabled ? 'block' : 'none';
    updateUI();
}

function updateUI() {
    const status = getAdminStatus();

    // Update toggle description
    if (status.enabled) {
        toggleDesc.textContent = 'Enabled - showing custom message';
        customMessageSection.style.display = 'block';
    } else {
        toggleDesc.textContent = 'Disabled - showing normal schedule';
        customMessageSection.style.display = 'none';
    }

    // Update status badge
    if (status.enabled && status.message) {
        statusBadge.classList.add('active');
        statusBadgeText.textContent = 'Custom Status Active';
        previewContent.classList.add('active');
        previewContent.textContent = status.message || 'No message set';
    } else {
        statusBadge.classList.remove('active');
        statusBadgeText.textContent = 'Normal Schedule';
        previewContent.classList.remove('active');
        previewContent.textContent = 'Your schedule is running normally based on your weekly timetable.';
    }
}

// ================================
// Event Listeners
// ================================

statusToggle.addEventListener('change', () => {
    const status = getAdminStatus();
    status.enabled = statusToggle.checked;

    if (!status.enabled) {
        // If turning off, clear the message
        status.message = '';
        customMessageInput.value = '';
    }

    saveAdminStatus(status);
});

saveBtn.addEventListener('click', () => {
    const message = customMessageInput.value.trim();

    if (!message) {
        alert('Please enter a message before saving.');
        return;
    }

    const status = getAdminStatus();
    status.enabled = true;
    status.message = message;
    statusToggle.checked = true;

    saveAdminStatus(status);

    // Show success feedback
    saveBtn.textContent = '✅ Saved!';
    saveBtn.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
    setTimeout(() => {
        saveBtn.textContent = '💾 Save & Activate';
        saveBtn.style.background = '';
    }, 2000);
});

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the custom message?')) {
        customMessageInput.value = '';
        const status = getAdminStatus();
        status.enabled = false;
        status.message = '';
        statusToggle.checked = false;
        saveAdminStatus(status);

        // Show feedback
        clearBtn.textContent = '✅ Cleared!';
        setTimeout(() => {
            clearBtn.textContent = '🗑️ Clear Message';
        }, 2000);
    }
});

// Preset message buttons
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        customMessageInput.value = message;

        // Visual feedback
        btn.style.background = 'rgba(167, 139, 250, 0.2)';
        setTimeout(() => {
            btn.style.background = '';
        }, 300);
    });
});

// ================================
// Canvas Animation (Stars)
// ================================

const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = [];
const numStars = 100;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.2
    });
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Twinkling effect
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
    });

    requestAnimationFrame(animateStars);
}


animateStars();

// ================================
// Schedule Management
// ================================

// DOM Elements for Schedule Manager
const scheduleGridBody = document.getElementById('schedule-grid-body');
const editModal = document.getElementById('edit-modal');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const scheduleForm = document.getElementById('schedule-form');
const entryType = document.getElementById('entry-type');
const entryTitle = document.getElementById('entry-title');
const entryRoom = document.getElementById('entry-room');
const entryDayDisplay = document.getElementById('entry-day-display');
const entryTimeDisplay = document.getElementById('entry-time-display');
const deleteEntryBtn = document.getElementById('delete-entry-btn');
const modalTitle = document.getElementById('modal-title');
const exportScheduleBtn = document.getElementById('export-schedule-btn');
const importScheduleBtn = document.getElementById('import-schedule-btn');
const importFileInput = document.getElementById('import-file-input');
const resetScheduleBtn = document.getElementById('reset-schedule-btn');
const clearAllScheduleBtn = document.getElementById('clear-all-schedule-btn');

// Schedule configuration
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAY_NUMBERS = { 'SAT': 6, 'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5 };
const TIME_SLOTS = [
    { start: '08:30', end: '09:50', label: '8:30AM-9:50AM' },
    { start: '09:51', end: '11:10', label: '9:51AM-11:10AM' },
    { start: '11:11', end: '12:30', label: '11:11AM-12:30PM' },
    { start: '12:31', end: '13:50', label: '12:31PM-1:50PM' },
    { start: '13:51', end: '15:10', label: '1:51PM-3:10PM' },
    { start: '15:11', end: '16:30', label: '3:11PM-4:30PM' }
];

// Current edit context
let currentEditContext = null;

// Load schedule from localStorage
function loadScheduleData() {
    const stored = localStorage.getItem('scheduleData');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            return data.entries || [];
        } catch (e) {
            console.error('Error loading schedule:', e);
            return [];
        }
    }
    return [];
}

// Save schedule to localStorage
function saveScheduleData(entries) {
    const scheduleData = {
        version: 1,
        lastUpdated: Date.now(),
        entries: entries
    };
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    console.log('✅ Schedule saved to localStorage');
}

// Render schedule grid
function renderScheduleGrid() {
    const schedule = loadScheduleData();
    scheduleGridBody.innerHTML = '';

    // Render each day
    ['SAT', 'SUN', 'MON', 'TUE', 'WED'].forEach(day => {
        const row = document.createElement('tr');

        // Day column
        const dayCell = document.createElement('td');
        dayCell.className = 'day-col';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        // Time slot columns
        TIME_SLOTS.forEach((slot, slotIndex) => {
            const cell = document.createElement('td');
            cell.dataset.day = day;
            cell.dataset.slotIndex = slotIndex;
            cell.dataset.start = slot.start;
            cell.dataset.end = slot.end;

            // Find entry for this day/time
            const dayNum = DAY_NUMBERS[day];
            const entry = schedule.find(e =>
                e.day === dayNum && e.start === slot.start && e.end === slot.end
            );

            if (entry) {
                const content = document.createElement('div');
                content.className = 'cell-content';

                const title = document.createElement('div');
                title.className = `cell-title cell-type-${entry.type}`;
                title.textContent = entry.title;

                const room = document.createElement('div');
                room.className = 'cell-room';
                room.textContent = `Room ${entry.room}`;

                content.appendChild(title);
                content.appendChild(room);
                cell.appendChild(content);
                cell.dataset.entryId = entry.id;
            }

            // Click handler
            cell.addEventListener('click', () => openEditModal(day, slotIndex, entry));
            row.appendChild(cell);
        });

        scheduleGridBody.appendChild(row);
    });
}

// Open edit modal
function openEditModal(day, slotIndex, existingEntry = null) {
    const slot = TIME_SLOTS[slotIndex];

    currentEditContext = {
        day: day,
        dayNum: DAY_NUMBERS[day],
        slotIndex: slotIndex,
        start: slot.start,
        end: slot.end,
        existingEntry: existingEntry
    };

    // Set modal title
    modalTitle.textContent = existingEntry ? 'Edit Schedule Entry' : 'Add Schedule Entry';

    // Set day and time display
    entryDayDisplay.textContent = day;
    entryTimeDisplay.textContent = slot.label;

    // Fill form if editing
    if (existingEntry) {
        entryType.value = existingEntry.type;
        entryTitle.value = existingEntry.title;
        entryRoom.value = existingEntry.room;
        deleteEntryBtn.style.display = 'block';
    } else {
        scheduleForm.reset();
        deleteEntryBtn.style.display = 'none';
    }

    // Show modal
    editModal.style.display = 'flex';
}

// Close modal
function closeModal() {
    editModal.style.display = 'none';
    scheduleForm.reset();
    currentEditContext = null;
}

// Save schedule entry
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentEditContext) return;

    const schedule = loadScheduleData();
    const newEntry = {
        id: currentEditContext.existingEntry ? currentEditContext.existingEntry.id : `${currentEditContext.day.toLowerCase()}-${currentEditContext.slotIndex}-${Date.now()}`,
        day: currentEditContext.dayNum,
        start: currentEditContext.start,
        end: currentEditContext.end,
        title: entryTitle.value.trim(),
        type: entryType.value,
        room: entryRoom.value.trim()
    };

    if (currentEditContext.existingEntry) {
        // Update existing entry
        const index = schedule.findIndex(e => e.id === currentEditContext.existingEntry.id);
        if (index !== -1) {
            schedule[index] = newEntry;
        }
    } else {
        // Add new entry
        schedule.push(newEntry);
    }

    saveScheduleData(schedule);
    renderScheduleGrid();
    closeModal();

    // Show success feedback
    showNotification('✅ Schedule updated successfully!');
});

// Delete entry
deleteEntryBtn.addEventListener('click', () => {
    if (!currentEditContext || !currentEditContext.existingEntry) return;

    if (confirm('Are you sure you want to delete this entry?')) {
        const schedule = loadScheduleData();
        const filtered = schedule.filter(e => e.id !== currentEditContext.existingEntry.id);
        saveScheduleData(filtered);
        renderScheduleGrid();
        closeModal();
        showNotification('🗑️ Entry deleted successfully!');
    }
});

// Modal close handlers
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeModal();
});

// Export schedule
exportScheduleBtn.addEventListener('click', () => {
    const scheduleData = localStorage.getItem('scheduleData');
    if (!scheduleData) {
        alert('No schedule data to export');
        return;
    }

    const blob = new Blob([scheduleData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('📥 Schedule exported successfully!');
});

// Import schedule
importScheduleBtn.addEventListener('click', () => {
    importFileInput.click();
});

importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.entries && Array.isArray(data.entries)) {
                localStorage.setItem('scheduleData', event.target.result);
                renderScheduleGrid();
                showNotification('📤 Schedule imported successfully!');
            } else {
                alert('Invalid schedule file format');
            }
        } catch (error) {
            alert('Error reading schedule file: ' + error.message);
        }
    };
    reader.readAsText(file);
    importFileInput.value = '';
});

// Reset to default schedule
resetScheduleBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset to the default schedule? This will overwrite your current schedule.')) {
        // Get default schedule from main script
        const defaultSchedule = getDefaultSchedule();
        saveScheduleData(defaultSchedule);
        renderScheduleGrid();
        showNotification('🔄 Schedule reset to default!');
    }
});

// Clear all schedule
clearAllScheduleBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear ALL schedule entries? This cannot be undone.')) {
        saveScheduleData([]);
        renderScheduleGrid();
        showNotification('🗑️ All schedule entries cleared!');
    }
});

// Default schedule function (same as in main script.js)
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

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(167, 139, 250, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize schedule grid when admin panel is shown
function initializeScheduleManager() {
    renderScheduleGrid();
}

// ================================
// Initialize
// ================================

// Set login hint
loginHint.textContent = 'Enter your password to continue.';

// Start on login screen
showLoginScreen();

// ================================
// Real-Time Synchronization
// ================================

// Listen for storage changes from other tabs/windows (real-time sync)
window.addEventListener('storage', (e) => {
    // Admin status changed in another tab
    if (e.key === 'adminStatus') {
        console.log('🔄 Admin status changed in another tab, updating UI...');
        loadAdminStatus();
    }

    // Schedule data changed in another tab
    if (e.key === 'scheduleData') {
        console.log('📅 Schedule updated in another tab, reloading grid...');
        renderScheduleGrid();
    }
});
