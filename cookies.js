// cookies.js

// Check if cookies preference is already set
function checkCookies() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const cookiesType = localStorage.getItem('cookiesType'); // 'all' or 'essential'
    const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')); // Saved settings for notifications
    const notificationPermission = localStorage.getItem('notificationPermission'); // Saved notification permission

    if (cookiesAccepted === 'true') {
        if (cookiesType === 'all') {
            // Allow full functionality with sound
            setNotificationSound(true);
            // Load saved notification settings if available
            if (notificationSettings) {
                loadNotificationSettings(notificationSettings);
            }
            if (notificationPermission !== 'granted') {
                requestNotificationPermission();
            }
        } else {
            // For essential cookies, disable sound and set basic functionality
            setNotificationSound(false);
        }
    } else {
        showCookiesBanner();
    }
}

// Display the cookie banner if the user has not accepted cookies
function showCookiesBanner() {
    const banner = document.getElementById('cookies-banner');
    if (banner) {
        banner.style.display = 'block';
    }
}

// Accept cookies and set preferences in localStorage
function acceptCookies(type) {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiesType', type);

    if (type === 'all') {
        setNotificationSound(true);
        localStorage.setItem('notificationSettings', JSON.stringify({
            soundEnabled: true,
            volume: 1 // You can set the volume based on the user's prior choice
        }));
        requestNotificationPermission();
    } else {
        setNotificationSound(false);
        localStorage.setItem('notificationSettings', JSON.stringify({
            soundEnabled: false,
            volume: 0
        }));
    }

    const banner = document.getElementById('cookies-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Set the notification sound based on the cookie type
function setNotificationSound(enabled) {
    const notificationSound = document.getElementById('notification-sound');
    if (notificationSound) {
        if (enabled) {
            notificationSound.volume = 1;
        } else {
            notificationSound.volume = 0;
        }
    }
}

// Request browser notification permission if not yet granted
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                localStorage.setItem('notificationPermission', 'granted');
            } else {
                console.log('Notification permission denied.');
                localStorage.setItem('notificationPermission', 'denied');
            }
        }).catch(err => {
            console.log('Notification permission request failed', err);
        });
    }
}

// Load saved notification settings (sound volume, etc.)
function loadNotificationSettings(settings) {
    // Here, you can apply the settings (like sound volume) based on what was saved
    if (settings && settings.soundEnabled !== undefined) {
        setNotificationSound(settings.soundEnabled);
    }
}

// Check cookies when the page is loaded
window.onload = function() {
    checkCookies();
};

// Event listeners for accepting cookies
document.addEventListener('DOMContentLoaded', function() {
    const acceptAllButton = document.getElementById('accept-all-cookies');
    const acceptEssentialButton = document.getElementById('accept-essential-cookies');

    if (acceptAllButton) {
        acceptAllButton.addEventListener('click', function() {
            acceptCookies('all');
        });
    }

    if (acceptEssentialButton) {
        acceptEssentialButton.addEventListener('click', function() {
            acceptCookies('essential');
        });
    }
});
