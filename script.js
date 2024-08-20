/*Color scheme*/
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const themeContainer = document.getElementById('themeContainer');

// Set document color scheme and store preference in localStorage
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeContainer.setAttribute('aria-label', 'Esquema de color oscuro');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeContainer.setAttribute('aria-label', 'Esquema de color claro');
    }  
}

// Add  switch changes event listener
toggleSwitch.addEventListener('change', switchTheme, false);

// Check system preferences and then check if exist preference saved in localStorage
function initThemePreference() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        toggleSwitch.checked = (storedTheme === 'dark');
        themeContainer.setAttribute('aria-label', storedTheme === 'dark' ? 'Esquema de color oscuro' : 'Esquema de color claro');
    } else {
        if (prefersDarkScheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleSwitch.checked = true;
            themeContainer.setAttribute('aria-label', 'Esquema de color oscuro');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            toggleSwitch.checked = false;
            themeContainer.setAttribute('aria-label', 'Esquema de color claro');
        }
    }
}

// Run system preference checking on load
initThemePreference();

// Make label actionable using Enter o Espace
document.querySelector('.theme-switch').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();  // Avoid page scrolling when using the space
        this.click();  // Emulate clik on the label
    }
});


/*Copy to clipboard*/
// Add event listeners
document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", function() {
        const url = this.previousElementSibling.href || this.previousElementSibling.textContent.trim();
        const cleanUrl = cleanUrlText(url);
        copy(this, cleanUrl);
    });
});

// Copy to clipboard function
async function copy(button, url) {
    try {
        // Use Clipboard API to copy to clipboard
        await navigator.clipboard.writeText(url);
        // Success confirmation
        success(button);
        console.log("Enlace copiado al portapapeles: " + url);
    } catch (err) {
        // Something went wrong message
        console.error("Error al copiar al portapapeles: ", err);
    }
}

// Clean copied url
function cleanUrlText(url) {
    if (url.startsWith("mailto:")) {
        return url.replace("mailto:", "");
    } else if (url.startsWith("tel:")) {
        return url.replace("tel:", "");
    }
    return url;  // Return cleanned url
}

// Success state
function success(button) {
    toggleButtonClass(button);
    updateText(button, '<span class="icon" aria-hidden="true">✔ </span>¡Copiado!</span>');

    // Disable button
    button.setAttribute('aria-disabled', 'true');

    // Disable keyboard interaction
    const handleKeydown = function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
        }
    };

    // Add event listener to keyboard interaction
    button.addEventListener('keydown', handleKeydown);

    // Return to default state after 2 seconds
    setTimeout(() => {
        toggleButtonClass(button);
        updateText(button, '<span class="icon" aria-hidden="true">❏ </span>Copiar</span>');

        // Enable button
        button.removeAttribute('aria-disabled');

        // Enable keyboard interaction
        button.removeEventListener('keydown', handleKeydown);
    }, 2000);
}

// Add success class to the button
function toggleButtonClass(button) {
    button.classList.toggle("copy-button-success");
}

// Update button text
function updateText(button, htmlContent) {
    const buttonText = button.querySelector(".copy-button-text");
    buttonText.innerHTML = htmlContent;
}

/* Privacy dialog */
var openDialog = document.getElementById("openDialog");
var closeDialog = document.getElementById("closeDialog");
var dialog = document.getElementById("dialog");

// Function to open the dialog
openDialog.addEventListener("click", () => {
    dialog.showModal();
    document.body.classList.add("scroll-fixed");
    setTimeout(() => closeDialog.focus(), 100);
    });
    
function closeModal() {
    dialog.blur();
    setTimeout(() => 
        dialog.close(),
        document.body.classList.remove("scroll-fixed"), 100);
}

// Function to close the dialog
closeDialog.addEventListener("click", () => {
    closeModal();
});

// Close dialog on button click or Escape key press
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.open) {
        closeModal();
    }
});

// Close dialog on overlay click
dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
    );

    if (!isInDialog) {
        closeModal();
    }
});
