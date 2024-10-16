// Agregamos un event listener para el evento 'scroll'
window.addEventListener('scroll', function() {
    // Calcular la cantidad de scroll
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolledPercentage = (scrollTop / scrollHeight) * 100;

    // Actualizar el ancho de la barra de progreso
    document.getElementById('bar').style.width = scrolledPercentage + '%';

    // Actualizar el aria-valuenow y aria-valuetext
    let progressBarContainer = document.getElementById('progressBar');
    progressBarContainer.setAttribute('aria-valuenow', Math.round(scrolledPercentage));
    progressBarContainer.setAttribute('aria-valuetext', Math.round(scrolledPercentage) + '%');
});

let languageData = {}; // Variable global para almacenar los textos del JSON

// Función para cargar el JSON según el idioma
async function loadLanguage(lang) {
    const response = await fetch(`/lang/${lang}/content.json`);
    const data = await response.json();
    languageData = data; // Almacena el JSON en la variable global
    updateDOM(data);
    updateLangAttribute(lang);
}

// Actualiza el DOM con los textos del JSON
function updateDOM(data) {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach((element) => {
        const key = element.getAttribute('data-key');
        const value = getValueFromKey(data, key); // Obtiene el valor usando la clave
        // Si el valor de texto está disponible, actualiza el contenido
        if (value && typeof value === 'object') {
            if (value.text) {
                element.innerHTML = value.text; // Asignar HTML directamente
            }

            // Actualiza el atributo aria-label si está disponible
            if (value.ariaLabel !== undefined) {
                element.setAttribute('aria-label', value.ariaLabel);
            }
            
            // Actualiza el atributo title si está disponible
            if (value.title !== undefined) {
                element.setAttribute('title', value.title);
            }

            // Actualiza el atributo content si está disponible
            if (value.content !== undefined) {
                element.setAttribute('content', value.content);
            }

            // Actualiza el atributo alt si está disponible
            if (value.alt !== undefined) {
                element.setAttribute('alt', value.alt);
            }

        } else if (value) {
            // Si no es un objeto, puede ser un texto directo (por ejemplo, "Volver arriba")
            element.innerHTML = value; // Asignar HTML directamente
        }
    });
}

// Obtiene el valor del objeto JSON a partir de la clave
function getValueFromKey(data, key) {
    return key.split('.').reduce((obj, keyPart) => {
        return obj && obj[keyPart];
    }, data);
}

// Cambia el atributo lang de la etiqueta html
function updateLangAttribute(lang) {
    document.documentElement.setAttribute('lang', lang);
}

// Función para establecer el idioma por defecto
function setDefaultLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    const defaultLang = userLang.startsWith('es') ? 'es' : 'en';
    return defaultLang;
}

// Cargar el idioma preferido o el idioma por defecto
const preferredLanguage = localStorage.getItem('preferredLanguage') || setDefaultLanguage();
loadLanguage(preferredLanguage);

// Desplegable de selección de idioma
const languageButton = document.getElementById('languageButton');
const languageList = document.getElementById('languageList');
const languageSelector = document.getElementById('languageSelector');

// Función para manejar animaciones de entrada y salida
function toggleVisibility(element, shouldShow) {
    if (shouldShow) {
        
        // Añadir la clase para la animación de entrada
        setTimeout(() => {
            element.classList.add('show');
        }, 10); // Retraso corto para asegurar que la animación se reproduzca
    } else {
        // Animación de salida
        element.classList.remove('show');
    }
}
/*
// Alternar el desplegable
languageButton.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';       
    this.setAttribute('aria-expanded', !isExpanded);
    languageList.hidden = isExpanded;

   toggleVisibility(languageList, !isExpanded);

   if (!isExpanded) {
       languageSelector.focus(); // Enfocar el selector si el menú se abre
   }
});
*/
languageButton.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        closeDropdown();
    } else {
        openDropdown();
    }
});

// Función para abrir el desplegable
function openDropdown() {
    languageButton.setAttribute('aria-expanded', true);
    languageList.hidden = false;
    toggleVisibility(languageList, true);
    languageSelector.focus(); // Enfocar el selector al abrir el menú
}

function closeDropdown() {
    languageButton.setAttribute('aria-expanded', false);
    
    // Ejecutar toggleVisibility antes de ocultar el desplegable
    toggleVisibility(languageList, false);
    setTimeout(() => {
        languageList.hidden = true;
    }, 100);

}

// Cerrar el menú cuando se hace clic fuera
document.addEventListener('click', function(event) {
    if (!languageButton.contains(event.target) && !languageList.contains(event.target)) {
        closeDropdown();
    }
});

// Cerrar el menú al pulsar Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDropdown();
    }
});

// Cerrar el menú al hacer Scroll
window.addEventListener('scroll', () => {
    if (languageButton.getAttribute('aria-expanded') === 'true') {
        languageButton.focus();
        closeDropdown();
    }
});

// Cerrar el menú al hacer blur de ambos elementos (languageButton y languageSelector)
function handleBlur(event) {
    setTimeout(() => {
        // Verificar si ninguno de los dos elementos tiene el foco
        if (!languageButton.contains(document.activeElement) && !languageSelector.contains(document.activeElement)) {
            closeDropdown(); // Cerrar el menú
        }
    }, 10); // Pequeño retraso para dar tiempo al evento focus en otros elementos
}

// Añadir los listeners de blur
languageButton.addEventListener('blur', handleBlur);
languageSelector.addEventListener('blur', handleBlur);

// Añadir eventos a los botones de idioma dentro del desplegable
document.getElementById('languageSelector').addEventListener('click', () => {
    const currentLang = localStorage.getItem('preferredLanguage') || setDefaultLanguage();
    if (currentLang  === 'es') {
        localStorage.setItem('preferredLanguage', 'en');
        loadLanguage('en');
    } else if (currentLang  === 'en') {
        localStorage.setItem('preferredLanguage', 'es');
        loadLanguage('es');
    }
    languageButton.focus();
    closeDropdown();
});

/*Color scheme*/
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const themeContainer = document.getElementById('themeContainer');

// Set document color scheme and store preference in localStorage
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeContainer.setAttribute('data-key', 'header.switch.dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeContainer.setAttribute('data-key', 'header.switch.light');
    }
    updateDOM(languageData);
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
        themeContainer.setAttribute('data-key', storedTheme === 'dark' ? 'header.switch.dark' :  'header.switch.light');
    } else {
        if (prefersDarkScheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleSwitch.checked = true;
            themeContainer.setAttribute('data-key', 'header.switch.dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            toggleSwitch.checked = false;
            themeContainer.setAttribute('data-key',  'header.switch.light');
        }
    }
    updateDOM(languageData);
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

    // Cambia el data-key al valor correspondiente al texto de "¡Copiado!"
    button.setAttribute('data-key', 'contact.button.copied');
    renderText(button);  // Actualiza el texto del botón según el nuevo data-key

    updateDOM(languageData);

    // Desactiva el botón
    button.setAttribute('aria-disabled', 'true');

    // Desactivar la interacción del teclado
    const handleKeydown = function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
        }
    };

    // Añadir el listener para desactivar la interacción
    button.addEventListener('keydown', handleKeydown);

    // Volver al estado original después de 2 segundos
    setTimeout(() => {
        toggleButtonClass(button);

        // Cambia el data-key de vuelta al valor original
        button.setAttribute('data-key', 'contact.button.default');
        renderText(button);  // Actualiza el texto del botón nuevamente

        updateDOM(languageData);

        // Rehabilitar el botón
        button.removeAttribute('aria-disabled');

        // Habilitar la interacción del teclado
        button.removeEventListener('keydown', handleKeydown);
    }, 2000);
}

// Función para renderizar el texto del botón basado en su data-key
function renderText(button) {
    const key = button.getAttribute('data-key');
    const text = getValueFromKey(languageData, key); // Usar languageData
    if (text) {
        button.innerHTML = text; // Actualiza el contenido del botón
    }
}

// Add success class to the button
function toggleButtonClass(button) {
    button.classList.toggle("copy-button");
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