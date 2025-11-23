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
// Initialize
// ================================

// Set login hint
loginHint.textContent = 'Enter your password to continue.';

// Start on login screen
showLoginScreen();
