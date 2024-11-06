// cookies.js

// Check if cookies preference is already set
function checkCookies() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const cookiesType = localStorage.getItem('cookiesType'); // 'all' or 'essential'
    
    if (cookiesAccepted) {
        if (cookiesType === 'all') {
            setNotificationSound(true);
        } else if (cookiesType === 'essential') {
            setNotificationSound(false);
        }
    } else {
        showCookiesBanner();
    }
}

function showCookiesBanner() {
    const banner = document.getElementById('cookies-banner');
    banner.style.display = 'block';
}


function acceptCookies(type) {
    localStorage.setItem('cookiesAccepted', true);
    localStorage.setItem('cookiesType', type);
    const banner = document.getElementById('cookies-banner');
    banner.style.display = 'none';
    if (type === 'all') {
        setNotificationSound(true);
        requestNotificationPermission();
    } else {
        setNotificationSound(false);
    }
}
// Set the notification sound based on the cookie type
function setNotificationSound(enabled) {
    const notificationSound = document.getElementById('notification-sound');
    if (enabled) {
        notificationSound.volume = 1;
    } else {
        notificationSound.volume = 0;
    }
}

function requestNotificationPermission() {
    // Request notifications only on a user event (e.g., after clicking "Accept All")
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        }).catch(err => {
            console.log('Notification permission request failed', err);
        });
    }
}

// Call checkCookies on page load to determine if cookies are accepted or need to be prompted
window.onload = function() {
    checkCookies();
};


document.addEventListener('DOMContentLoaded', function() {
    // Check if cookies preference is already set
    checkCookies();

    // Event listener setup after the page is ready
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
