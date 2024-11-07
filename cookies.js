// Function to set cookies with Secure and SameSite attributes
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value || ""}; expires=${expires.toUTCString()}; path=/; SameSite=None; Secure`;
}


// Function to get cookies by name
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to erase cookies
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';  // Expire cookie
}

// Function to check cookies and load notification settings
function checkCookies() {
    const cookiesAccepted = getCookie('cookiesAccepted');
    const notificationSettings = getCookie('notificationSettings');

    if (cookiesAccepted === 'true') {
        if (notificationSettings) {
            // Parse and load saved notification settings
            const settings = JSON.parse(notificationSettings);
            loadNotificationSettings(settings);
        } else {
            // Display default notification status if no settings exist
            document.getElementById('notificationStatus').textContent = "Currently no notification saved.";
        }
    } else {
        // If cookies are not accepted, show the cookie banner
        showCookiesBanner();
    }
}

// Function to display the cookie consent banner
function showCookiesBanner() {
    const banner = document.getElementById('cookies-banner');
    console.log("Attempting to show the banner...");

    if (banner) {
        banner.style.display = 'block';  // Show the banner
        console.log("Banner is now displayed.");
    } else {
        console.error("Cookie banner element not found.");
    }
}

// Accept all cookies and set preferences
function acceptCookies() {
    setCookie('cookiesAccepted', 'true', 365); // Set the cookie for 365 days
    setCookie('cookiesType', 'all', 365);

    // Define notification settings
    const notificationSettings = {
        items: ['divine orbs'], // Example list of selected items
        voteThreshold: 1,  // Example threshold for votes required
        volume: 50 // Default volume setting (50%)
    };
    setCookie('notificationSettings', JSON.stringify(notificationSettings), 365);
    requestNotificationPermission(); // Request notification permission

    // Set the Divine Orbs checkbox to checked automatically
    const divineOrbsCheckbox = document.getElementById('divineOrbsCheckbox');
    if (divineOrbsCheckbox) {
        divineOrbsCheckbox.checked = true;
    }

    // Hide the cookie banner
    const banner = document.getElementById('cookies-banner');
    if (banner) banner.style.display = 'none';

    location.reload(); // Force a reload to ensure the page reflects the new cookies
}

// Function to request browser notification permission if not yet granted
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
        }).catch(err => console.error('Notification permission request failed', err));
    }
}

// Function to load saved notification settings (mod preferences, vote threshold, etc.)
function loadNotificationSettings(settings) {
    // Extract active mods (those checked in the settings)
    const activeMods = settings.items || [];

    // Display the active mods in the notification status
    let notificationText = "Currently no notification saved.";

    if (activeMods.length > 0 || settings.voteThreshold || settings.volume !== 50) {
        notificationText = "Active filters: " + activeMods.join(", ");
        notificationText += (activeMods.length > 0 && (settings.voteThreshold || settings.volume !== 50)) ? ", " : "";
        notificationText += settings.voteThreshold ? "Upvotes required: " + settings.voteThreshold : "";
        notificationText += (settings.volume !== 50 && settings.voteThreshold) ? ", Volume: " + settings.volume + "%" : "";
        notificationText += (settings.volume !== 50 && !settings.voteThreshold) ? "Volume: " + settings.volume + "%" : "";
    }

    // Update the notification status text
    document.getElementById("notificationStatus").textContent = notificationText;
}

// Function to set notification settings
function setNotifications() {
    const selectedMods = [];
    const mods = {};

    // Loop through all checkbox elements to get the selected ones
    document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        selectedMods.push(checkbox.value);
        mods[checkbox.value] = true;  // Mark this mod as selected
    });

    // Collect additional settings like vote threshold and volume
    const voteThreshold = document.getElementById('upvoteThreshold').value;
    const volume = document.getElementById('volumeControl').value;

    // Store all settings in the cookie
    const settings = {
        items: selectedMods,          // Stores active items
        voteThreshold: voteThreshold,  // Store the vote threshold value
        volume: volume       // Store volume level
    };

    setCookie("notificationSettings", JSON.stringify(settings), 365); // Set cookie for 365 days

    // Update the notification status text after setting the notifications
    loadNotificationSettings(settings);
}

// Function to check and trigger notifications for a map
function checkNotifications(mapName) {
    const mapVotes = votedMaps[mapName];
    const upvotes = mapVotes?.votes || 0;
    const selectedModifiers = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);

    // Check if the map matches the selected modifiers and upvote threshold
    const modifierMatch = selectedModifiers.every(mod => mapVotes.modifiers.includes(mod));

    if (upvotes >= notificationSettings.upvoteThreshold && modifierMatch) {
        // Trigger notification sound
        const sound = document.getElementById('notificationSound');
        sound.volume = notificationSettings.volume / 100;  // Adjust volume
        sound.play();

        // Update the browser tab title with the number of votes for this map
        updateTabTitle(mapName, upvotes);
    }
}

// Function to update the browser tab title with the number of votes for a map
function updateTabTitle(mapName, upvotes) {
    document.title = `${mapName} - ${upvotes} votes`;
}

// Run the cookie check when the page is loaded
window.onload = function() {
    console.log("Page loaded. Running checkCookies...");
    checkCookies();
};


// Event listener for the "Accept Cookies" button
document.addEventListener('DOMContentLoaded', function() {
    const acceptCookiesButton = document.getElementById('accept-cookies');
    const cookieBanner = document.getElementById("cookies-banner");

    
    
    // Check if cookies are already accepted when the page is loaded
    checkCookies();

    if (acceptCookiesButton) {
        acceptCookiesButton.addEventListener('click', function() {
            console.log("Accepting cookies...");
            acceptCookies(); // Accept cookies and apply settings
        });
    }
});
