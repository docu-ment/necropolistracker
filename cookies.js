// Function to set cookies
function setCookie(name, value, days) {
    const d = new Date();
    let expires = '';
    if (days) {
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "expires=" + d.toUTCString();
    }
    const isSecure = window.location.protocol === 'https:';
    let cookieString = name + "=" + value + ";" + expires + ";path=/;";

    if (isSecure) {
        cookieString += "SameSite=None; Secure";
    } else {
        cookieString += "SameSite=Lax";
    }

    document.cookie = cookieString;
}

// Function to get cookies by name
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim(); 
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length); 
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
    if (settings && settings.mods) {
        // Set checkbox values based on the saved mods
        settings.mods.forEach(mod => {
            const checkbox = document.querySelector(`#${mod.replace(/\s+/g, '')}Checkbox`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        // Set upvote threshold and volume based on the saved values
        document.getElementById('upvoteThreshold').value = settings.upvoteThreshold || 1;
        document.getElementById('volumeControl').value = settings.volume || 50;

        // Update the notification status text to reflect the saved settings
        document.getElementById('notificationStatus').textContent = `Notifications set for mods: ${settings.mods.join(', ')} with threshold: ${settings.upvoteThreshold} at volume: ${settings.volume}%`;
    } else {
        document.getElementById('notificationStatus').textContent = "Currently no notification saved.";
    }
}

// Function to set notification settings
function setNotifications() {
    // Get the selected mods from the checkboxes
    const selectedMods = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
    
    // Get the upvote threshold and volume settings
    const upvoteThreshold = document.getElementById('upvoteThreshold').value;
    const volume = document.getElementById('volumeControl').value;
    
    // Store the settings in notificationSettings cookie
    const notificationSettings = {
        mods: selectedMods,
        upvoteThreshold: upvoteThreshold,
        volume: volume
    };
    
    // Set the cookie for 365 days
    setCookie('notificationSettings', JSON.stringify(notificationSettings), 365);

    // Display notification settings status
    document.getElementById('notificationStatus').textContent = `Notifications set for mods: ${selectedMods.join(', ')} with threshold: ${upvoteThreshold} at volume: ${volume}%`;
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

    // Check if cookies are accepted when the page is loaded
    checkCookies();

    if (acceptCookiesButton) {
        acceptCookiesButton.addEventListener('click', function() {
            console.log("Accepting cookies...");
            acceptCookies(); // Accept cookies and apply settings
        });
    }
});
