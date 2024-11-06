// Check if the user has already given consent using localStorage
function getCookieConsent() {
    return localStorage.getItem('cookieConsent') === 'true';
}

// Show the cookie consent banner if user hasn't consented yet
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    banner.style.display = 'block';
}

// Hide the cookie consent banner
function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    banner.style.display = 'none';
}

// Save the user's consent choice to localStorage
function saveConsent(choice) {
    localStorage.setItem('cookieConsent', choice);  // 'true' or 'false'
    hideCookieBanner();
}

// Set up event listeners for accept and decline buttons
function setupEventListeners() {
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');

    acceptButton.addEventListener('click', () => {
        saveConsent('true');
        // Optionally, enable services like analytics if needed
    });

    declineButton.addEventListener('click', () => {
        saveConsent('false');
        // Optionally, disable services like tracking
    });
}

// Initialize the cookie consent check on page load
function initCookieConsent() {
    if (!getCookieConsent()) {
        showCookieBanner();
    }
    setupEventListeners();
}

// Run cookie consent initialization after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCookieConsent);
