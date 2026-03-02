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