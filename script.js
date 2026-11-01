// ============================================
// VARIABLES GLOBALES ET INITIALISATION
// ============================================

const nom_user = document.querySelector('#nom_user');
const prenom_user = document.querySelector('#prenom_user');
const email_user = document.querySelector('#email_user');
const message_user = document.querySelector('#message_user');
const form = document.querySelector('#contact-form');

const emailGeneral = "saidmedabdo13@gmail.com";

// ============================================
// GESTION DU FORMULAIRE DE CONTACT
// ============================================

function sendEmail(e) {
    e.preventDefault();

    // Validation
    if (!nom_user || !prenom_user || !email_user || !message_user) {
        alert("Erreur : formulaire non trouvé");
        return;
    }

    if (
        nom_user.value.trim() === "" ||
        prenom_user.value.trim() === "" ||
        email_user.value.trim() === "" ||
        message_user.value.trim() === ""
    ) {
        alert("Veuillez remplir tous les champs du formulaire.");
        return;
    }

    const subject = `Message de ${prenom_user.value} ${nom_user.value} - Portfolio`;
    const body = `
Nom : ${nom_user.value}
Prénom : ${prenom_user.value}
Email : ${email_user.value}

Message :
${message_user.value}
    `;

    window.location.href =
        `mailto:${emailGeneral}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    form.reset();
    alert("Votre message a été préparé. Votre client de messagerie va s'ouvrir.");
}

form.addEventListener('submit', sendEmail);

// ============================================
// NAVIGATION MOBILE ET MENU CV
// ============================================

const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('#menu-toggle');
const headerPanel = document.querySelector('#primary-navigation');
const cvToggle = document.querySelector('#cv-toggle');
const cvDropdown = document.querySelector('#cv-dropdown');
const desktopQuery = window.matchMedia('(min-width: 1024px)');

function setMenuState(isOpen, returnFocus) {
    if (!menuToggle || !headerPanel) return;

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'
    );
    headerPanel.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen && !desktopQuery.matches);

    if (!isOpen) {
        setCvState(false);
        if (returnFocus) menuToggle.focus();
    }
}

function setCvState(isOpen) {
    if (!cvToggle || !cvDropdown) return;

    cvToggle.setAttribute('aria-expanded', String(isOpen));
    cvDropdown.classList.toggle('is-open', isOpen);
}

if (menuToggle && headerPanel) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
        setMenuState(isOpen, false);
    });

    headerPanel.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', () => setMenuState(false, false));
    });

    document.querySelector('.brand')?.addEventListener('click', () => {
        setMenuState(false, false);
    });
}

if (cvToggle && cvDropdown) {
    cvToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = cvToggle.getAttribute('aria-expanded') !== 'true';
        setCvState(isOpen);
    });

    cvDropdown.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setCvState(false));
    });
}

document.addEventListener('click', (event) => {
    if (headerPanel && headerPanel.classList.contains('is-open')) {
        if (!siteHeader.contains(event.target)) {
            setMenuState(false, false);
        }
    }

    if (cvDropdown && cvDropdown.classList.contains('is-open')) {
        if (!event.target.closest('.sup')) {
            setCvState(false);
        }
    }
});

document.addEventListener('keydown', (event) => {
    const menuIsOpen = headerPanel && headerPanel.classList.contains('is-open');

    if (event.key === 'Escape') {
        if (menuIsOpen) {
            setMenuState(false, true);
        }
        setCvState(false);
        return;
    }

    if (event.key !== 'Tab' || !menuIsOpen || desktopQuery.matches) return;

    const focusableElements = [
        menuToggle,
        ...headerPanel.querySelectorAll('a[href], button:not([disabled])')
    ].filter((element) => element && element.offsetParent !== null);

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});

desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
        setMenuState(false, false);
        document.body.classList.remove('menu-open');
    }
});

let translations = {};
let currentLang = localStorage.getItem("lang") || "fr";

/* Charger le JSON */
async function loadTranslations() {
    const response = await fetch("assets/lang/traductions.json");
    translations = await response.json();
    applyTranslations(currentLang);
}

/* Récupérer valeur dans objet profond */
function getValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/* Appliquer traduction */
function applyTranslations(lang) {

    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        const value = getValue(translations[lang], key);

        if (!value) return;

        // Si input placeholder
        if (el.placeholder !== undefined)
            el.placeholder = value;

        // Si bouton input value
        if (el.tagName === "INPUT" && el.type === "button")
            el.value = value;
        else
            el.textContent = value;
    });

    /* RTL pour arabe */
    if (lang === "ar") {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
    } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = lang;
    }

    localStorage.setItem("lang", lang);
}

/* Changer langue */
function setLanguage(lang) {
    currentLang = lang;
    applyTranslations(lang);
}

/* Init */
document.addEventListener("DOMContentLoaded", loadTranslations);