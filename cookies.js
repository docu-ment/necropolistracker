// cookies.js

// Check if cookies preference is already set
function checkCookies() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const cookiesType = localStorage.getItem('cookiesType'); // 'all' or 'essential'
    const notificationPermission = localStorage.getItem('notificationPermission'); // Saved notification permission

    if (cookiesAccepted === 'true') {
        if (cookiesType === 'all') {
            // Allow full functionality
            if (notificationPermission !== 'granted') {
                requestNotificationPermission();
            }
        } else {
            // For essential cookies, limit functionality as needed
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
        localStorage.setItem('notificationSettings', JSON.stringify({
            notificationsEnabled: true
        }));
        requestNotificationPermission();
    } else {
        localStorage.setItem('notificationSettings', JSON.stringify({
            notificationsEnabled: false
        }));
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
