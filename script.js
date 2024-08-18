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
var copyButtonLinkedin = document.getElementById("copy-button-email");

async function copy(url) {
    try {
        // Use Clipboard API to copy to clipboard
        await navigator.clipboard.writeText(url);

        success();

        // Success confirmation
        console.log("Enlace copiado al portapapeles: " + url);

    } catch (err) {
        // Something went wrong message
        console.error("Error al copiar al portapapeles: ", err);
    }
}

function success() {
    copyButtonLinkedin.classList.remove("copy-button");
    copyButtonLinkedin.classList.add("copy-button-success");

    successText();

    setTimeout(() => {
        copyButtonLinkedin.classList.add("copy-button");
        copyButtonLinkedin.classList.remove("copy-button-success");
        defaultText();
    }, 2000)
}

function successText() {
    var emailText = document.getElementById("copy-button-email-text");

    emailText.innerHTML = '<span class="emojis" aria-hidden="true">✔ </span>¡Copiado!</span>';
  }

  function defaultText() {
    var emailText = document.getElementById("copy-button-email-text");

    emailText.innerHTML = '<span class="emojis" aria-hidden="true">❏ </span>Copiar</span>';
  }