// Helper functions to set, get, and delete cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration date
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Store the cookie
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Remove leading spaces
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // Return cookie value
    }
    return null; // Return null if cookie not found
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';  // Expire the cookie immediately
}

// Check if cookies preference is already set
function checkCookies() {
    const cookiesAccepted = getCookie('cookiesAccepted');
    const cookiesType = getCookie('cookiesType'); // 'all' or 'essential'
    const notificationSettings = JSON.parse(getCookie('notificationSettings')); // Saved settings for notifications
    const notificationPermission = getCookie('notificationPermission'); // Saved notification permission

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

// Accept cookies and set preferences in cookies
function acceptCookies(type) {
    setCookie('cookiesAccepted', 'true', 365); // Set the cookie for 365 days
    setCookie('cookiesType', type, 365);

    if (type === 'all') {
        setNotificationSound(true);
        setCookie('notificationSettings', JSON.stringify({
            soundEnabled: true,
            volume: 1 // You can set the volume based on the user's prior choice
        }), 365);
        requestNotificationPermission();
    } else {
        setNotificationSound(false);
        setCookie('notificationSettings', JSON.stringify({
            soundEnabled: false,
            volume: 0
        }), 365);
    }

    const banner = document.getElementById('cookies-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Request browser notification permission if not yet granted
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                setCookie('notificationPermission', 'granted', 365);
            } else {
                console.log('Notification permission denied.');
                setCookie('notificationPermission', 'denied', 365);
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
