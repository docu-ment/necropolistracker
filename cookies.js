// cookies.js

// Check if cookies preference is already set
function checkCookies() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const cookiesType = localStorage.getItem('cookiesType'); // 'all' or 'essential'
    
    // If cookies have already been accepted, check if user accepted notifications
    if (cookiesAccepted) {
        if (cookiesType === 'all') {
            // Allow sound volume and notifications
            setNotificationSound(true);
        } else if (cookiesType === 'essential') {
            // Set volume to 0% or limit non-essential functionality
            setNotificationSound(false);
        }
    } else {
        // Display cookies banner if not accepted yet
        showCookiesBanner();
    }
}

// Show the cookies banner and prompt user
function showCookiesBanner() {
    const banner = document.getElementById('cookies-banner');
    banner.style.display = 'block';

    document.getElementById('accept-all-cookies').addEventListener('click', function() {
        acceptCookies('all');
    });
    document.getElementById('accept-essential-cookies').addEventListener('click', function() {
        acceptCookies('essential');
    });
}

// Accept cookies and store preference
function acceptCookies(type) {
    localStorage.setItem('cookiesAccepted', true);
    localStorage.setItem('cookiesType', type);

    // Hide the cookies banner
    const banner = document.getElementById('cookies-banner');
    banner.style.display = 'none';

    // Set functionality based on the cookie type
    if (type === 'all') {
        // Enable sound notifications and volume
        setNotificationSound(true);
    } else {
        // Disable sound notifications or set volume to 0%
        setNotificationSound(false);
    }

    // Prompt for notification permission only if all cookies are accepted
    if (type === 'all') {
        requestNotificationPermission();
    }
}

// Set the notification sound based on the cookie type
function setNotificationSound(enabled) {
    const notificationSound = document.getElementById('notification-sound');
    if (enabled) {
        notificationSound.volume = 1; // Set to full volume
    } else {
        notificationSound.volume = 0; // Set to 0% volume (mute)
    }
}

// Request notification permission
function requestNotificationPermission() {
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
