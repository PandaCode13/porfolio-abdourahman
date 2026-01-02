// ============================================
// VARIABLES GLOBALES ET INITIALISATION
// ============================================

const nom_user = document.querySelector('#nom_user');
const prenom_user = document.querySelector('#prenom_user');
const email_user = document.querySelector('#email_user');
const message_user = document.querySelector('#message_user');
const form = document.querySelector('#contact-form');

const emailGeneral = "saidmedabdo13@gmail.com";

// Traductions par défaut
const translations = {
    fr: {},
    en: {},
    es: {},
    ar: {},
    zh: {}
};

let currentLanguage = 'fr';

// ============================================
// CHARGEMENT DES TRADUCTIONS
// ============================================

async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) throw new Error('Fichier non trouvé');
        
        const data = await response.json();
        
        // Fusionner avec les traductions par défaut
        Object.keys(data).forEach(lang => {
            if (translations[lang]) {
                Object.assign(translations[lang], data[lang]);
            } else {
                translations[lang] = data[lang];
            }
        });
        
        console.log('✅ Traductions chargées avec succès');
        
        // Initialiser la langue après chargement
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
        if (translations[savedLanguage]) {
            currentLanguage = savedLanguage;
            const languageSelector = document.getElementById('language-select');
            if (languageSelector) {
                languageSelector.value = savedLanguage;
            }
        }
        
        applyLanguage(currentLanguage);
    } catch (error) {
        console.warn('⚠️ Fichier translations.json non trouvé, chargement des traductions par défaut');
        loadDefaultTranslations();
    }
}

function loadDefaultTranslations() {
    // Traductions minimales pour éviter l'erreur
    translations.fr = {
        header: {
            nav: {
                home: "Accueil",
                about: "À propos",
                skills: "Compétences",
                experiences: "Expériences",
                education: "Formation",
                volunteering: "Bénévolat",
                contact: "Contact"
            },
            buttons: {
                downloadCV: "Télécharger CV",
                contactMe: "Me contacter",
                cv1: "CV Professionnel 1",
                cv2: "CV Professionnel 2"
            }
        }
    };
    
    // Pour les autres langues, copier le français temporairement
    ['en', 'es', 'ar', 'zh'].forEach(lang => {
        translations[lang] = JSON.parse(JSON.stringify(translations.fr));
    });
}

// ============================================
// INITIALISATION DE LA PAGE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, initialisation en cours...');
    
    // Initialiser le formulaire de contact
    if (form) {
        form.addEventListener('submit', sendEmail);
    }
    
    // Initialiser le sélecteur de langue
    initializeLanguageSelector();
    
    // Charger les traductions
    loadTranslations();
    
    // Initialiser la navigation fluide
    initSmoothScrolling();
    
    // Initialiser le menu déroulant du CV
    initCVDownloadMenu();
});

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

// ============================================
// GESTION DES LANGUES
// ============================================

function initializeLanguageSelector() {
    const languageSelector = document.getElementById('language-select');
    
    if (!languageSelector) {
        console.error('❌ Sélecteur de langue non trouvé');
        return;
    }
    
    // Restaurer la langue sauvegardée
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        languageSelector.value = savedLanguage;
        currentLanguage = savedLanguage;
    }
    
    // Écouter les changements
    languageSelector.addEventListener('change', function(e) {
        changeLanguage(e.target.value);
    });
}

function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`❌ Langue non supportée: ${lang}`);
        alert(`Langue ${lang} non supportée`);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t || !t.header) {
        console.error(`❌ Traductions non disponibles pour: ${lang}`);
        return;
    }
    
    console.log(`🌐 Application de la langue: ${lang}`);
    
    // 1. Header Navigation
    if (t.header.nav) {
        const navLinks = document.querySelectorAll('header nav a');
        const navOrder = ['home', 'about', 'skills', 'experiences', 'education', 'volunteering', 'contact'];
        
        navLinks.forEach((link, index) => {
            if (index < navOrder.length && t.header.nav[navOrder[index]]) {
                const icon = link.querySelector('i');
                if (icon && icon.outerHTML) {
                    link.innerHTML = icon.outerHTML + ' ' + t.header.nav[navOrder[index]];
                } else {
                    link.textContent = t.header.nav[navOrder[index]];
                }
            }
        });
    }
    
    // 2. Boutons du header
    if (t.header.buttons) {
        // Bouton télécharger CV
        const downloadBtn = document.querySelector('.download-link');
        if (downloadBtn) {
            const icon = downloadBtn.querySelector('i');
            if (icon && icon.outerHTML) {
                downloadBtn.innerHTML = icon.outerHTML + ' ' + t.header.buttons.downloadCV;
            } else {
                downloadBtn.textContent = t.header.buttons.downloadCV;
            }
        }
        
        // Bouton contact
        const contactBtn = document.querySelector('.sup a:last-child');
        if (contactBtn) {
            const icon = contactBtn.querySelector('i');
            if (icon && icon.outerHTML) {
                contactBtn.innerHTML = icon.outerHTML + ' ' + t.header.buttons.contactMe;
            } else {
                contactBtn.textContent = t.header.buttons.contactMe;
            }
        }
        
        // Liens CV dans dropdown
        const cvLinks = document.querySelectorAll('.dropmenu a');
        if (cvLinks.length >= 2) {
            cvLinks[0].textContent = t.header.buttons.cv1 || "CV 1";
            cvLinks[1].textContent = t.header.buttons.cv2 || "CV 2";
        }
    }
    
    // 3. Section Home
    if (t.home) {
        // Titre statique
        const staticText = document.querySelector('.static-text');
        if (staticText) {
            staticText.textContent = t.home.title || "Je suis";
        }
        
        // Description
        const description = document.querySelector('.description');
        if (description && t.home.description) {
            description.textContent = t.home.description;
        }
        
        // Boutons CTA
        const discoverBtn = document.querySelector('.btn-primary');
        if (discoverBtn && t.home.buttons && t.home.buttons.discoverSkills) {
            const icon = discoverBtn.querySelector('i');
            if (icon && icon.outerHTML) {
                discoverBtn.innerHTML = icon.outerHTML + ' ' + t.home.buttons.discoverSkills;
            }
        }
        
        const discussBtn = document.querySelector('.btn-secondary');
        if (discussBtn && t.home.buttons && t.home.buttons.discussProject) {
            const icon = discussBtn.querySelector('i');
            if (icon && icon.outerHTML) {
                discussBtn.innerHTML = icon.outerHTML + ' ' + t.home.buttons.discussProject;
            }
        }
        
        // Statistiques
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels.length >= 3 && t.home.stats) {
            statLabels[0].textContent = t.home.stats.projects;
            statLabels[1].textContent = t.home.stats.experience;
            statLabels[2].textContent = t.home.stats.satisfaction;
        }
    }
    
    // 4. Section About
    if (t.about) {
        // Titre et sous-titre
        updateSectionTitle('#about', t.about.title);
        updateSectionSubtitle('#about', t.about.subtitle);
        
        // Cartes About
        const aboutCards = document.querySelectorAll('.about-left .about-card');
        if (aboutCards.length >= 3 && t.about.sections) {
            aboutCards[0].querySelector('.card-title').textContent = t.about.sections.career;
            aboutCards[1].querySelector('.card-title').textContent = t.about.sections.personalInfo;
            aboutCards[2].querySelector('.card-title').textContent = t.about.sections.personalGoal;
            
            // Contenu des cartes
            if (t.about.content) {
                aboutCards[0].querySelector('p').innerHTML = t.about.content.careerText;
                aboutCards[2].querySelector('p').innerHTML = t.about.content.personalGoalText;
                
                // Informations personnelles
                const infoItems = aboutCards[1].querySelectorAll('.info-item');
                if (infoItems.length >= 3 && t.about.info) {
                    infoItems[0].querySelector('strong').textContent = t.about.info.location + ':';
                    infoItems[1].querySelector('strong').textContent = t.about.info.nationality + ':';
                    infoItems[2].querySelector('strong').textContent = t.about.info.languages + ':';
                    
                    infoItems[0].querySelector('span').textContent = t.about.content.locationValue;
                    infoItems[1].querySelector('span').textContent = t.about.content.nationalityValue;
                    infoItems[2].querySelector('span').textContent = t.about.content.languagesValue;
                }
            }
        }
        
        // Cartes right
        const aboutRightCards = document.querySelectorAll('.about-right .about-card');
        if (aboutRightCards.length >= 2) {
            aboutRightCards[0].querySelector('.card-title').textContent = t.about.sections.values;
            aboutRightCards[1].querySelector('.card-title').textContent = t.about.sections.professionalGoal;
            
            // Valeurs professionnelles
            const valueItems = aboutRightCards[0].querySelectorAll('.value-item');
            if (valueItems.length >= 4 && t.about.values && t.about.content) {
                valueItems[0].querySelector('h4').textContent = t.about.values.technical;
                valueItems[1].querySelector('h4').textContent = t.about.values.leadership;
                valueItems[2].querySelector('h4').textContent = t.about.values.innovation;
                valueItems[3].querySelector('h4').textContent = t.about.values.social;
                
                valueItems[0].querySelector('p').textContent = t.about.content.technicalDesc;
                valueItems[1].querySelector('p').textContent = t.about.content.leadershipDesc;
                valueItems[2].querySelector('p').textContent = t.about.content.innovationDesc;
                valueItems[3].querySelector('p').textContent = t.about.content.socialDesc;
            }
            
            // Objectif professionnel
            if (t.about.content) {
                aboutRightCards[1].querySelector('p').innerHTML = t.about.content.professionalGoalText;
            }
        }
    }
    
    // 5. Section Skills
    if (t.skills) {
        // Titre et sous-titre
        updateSectionTitle('#competences', t.skills.title);
        updateSectionSubtitle('#competences', t.skills.subtitle);
        
        // Résumé
        const summaryItems = document.querySelectorAll('.summary-item .summary-label');
        if (summaryItems.length >= 3 && t.skills.summary) {
            summaryItems[0].textContent = t.skills.summary.categories;
            summaryItems[1].textContent = t.skills.summary.skills;
            summaryItems[2].textContent = t.skills.summary.domains;
        }
        
        // Catégories de compétences
        const skillCategories = document.querySelectorAll('.skill-category');
        if (skillCategories.length >= 7 && t.skills.categories) {
            skillCategories[0].querySelector('h3').textContent = t.skills.categories.cloud;
            skillCategories[1].querySelector('h3').textContent = t.skills.categories.containerization;
            skillCategories[2].querySelector('h3').textContent = t.skills.categories.devops;
            skillCategories[3].querySelector('h3').textContent = t.skills.categories.monitoring;
            skillCategories[4].querySelector('h3').textContent = t.skills.categories.powerPlatform;
            skillCategories[5].querySelector('h3').textContent = t.skills.categories.development;
            skillCategories[6].querySelector('h3').textContent = t.skills.categories.infrastructure;
            
            // Compétences détaillées
            if (t.skills.cloudSkills) {
                updateSkillsList(skillCategories[0], t.skills.cloudSkills);
            }
            if (t.skills.containerSkills) {
                updateSkillsList(skillCategories[1], t.skills.containerSkills);
            }
            if (t.skills.devopsSkills) {
                updateSkillsList(skillCategories[2], t.skills.devopsSkills);
            }
            if (t.skills.monitoringSkills) {
                updateSkillsList(skillCategories[3], t.skills.monitoringSkills);
            }
            if (t.skills.powerPlatformSkills) {
                updateSkillsList(skillCategories[4], t.skills.powerPlatformSkills);
            }
            if (t.skills.developmentSkills) {
                updateSkillsList(skillCategories[5], t.skills.developmentSkills);
            }
            if (t.skills.infrastructureSkills) {
                updateSkillsList(skillCategories[6], t.skills.infrastructureSkills);
            }
        }
    }
    
    // 6. Section Experiences
    if (t.experiences) {
        updateSectionTitle('#experiences', t.experiences.title);
        updateSectionSubtitle('#experiences', t.experiences.subtitle);
        
        // Cartes d'expérience
        const experienceCards = document.querySelectorAll('.experience-card');
        if (experienceCards.length >= 3) {
            // Teknosure
            if (t.experiences.teknosure) {
                experienceCards[0].querySelector('.job-title').textContent = t.experiences.teknosure.title;
                experienceCards[0].querySelector('.job-description').textContent = t.experiences.teknosure.description;
                
                const achievementsTitle = experienceCards[0].querySelector('.achievements h5');
                if (achievementsTitle) achievementsTitle.textContent = t.experiences.achievements;
                
                // Mettre à jour les réalisations
                const achievementsList = experienceCards[0].querySelectorAll('.achievements li');
                if (achievementsList.length >= 10 && t.experiences.teknosure.achievements) {
                    achievementsList.forEach((item, index) => {
                        if (index < t.experiences.teknosure.achievements.length) {
                            const icon = item.querySelector('i');
                            if (icon && icon.outerHTML) {
                                item.innerHTML = icon.outerHTML + ' ' + t.experiences.teknosure.achievements[index];
                            }
                        }
                    });
                }
                
                const technologiesTitle = experienceCards[0].querySelector('.technologies h5');
                if (technologiesTitle) technologiesTitle.textContent = t.experiences.technologies;
            }
            
            // M2i
            if (t.experiences.m2i) {
                experienceCards[1].querySelector('.job-title').textContent = t.experiences.m2i.title;
                experienceCards[1].querySelector('.job-description').textContent = t.experiences.m2i.description;
            }
            
            // Talan
            if (t.experiences.talan) {
                experienceCards[2].querySelector('.job-title').textContent = t.experiences.talan.title;
                
                const projectDetails = experienceCards[2].querySelector('.project-details');
                if (projectDetails) {
                    const objectiveTitle = projectDetails.querySelector('h5:nth-child(1)');
                    if (objectiveTitle) objectiveTitle.textContent = t.experiences.project.objective;
                    
                    const objectiveText = projectDetails.querySelector('p');
                    if (objectiveText && t.experiences.talan.objective) {
                        objectiveText.textContent = t.experiences.talan.objective;
                    }
                    
                    const activitiesTitle = projectDetails.querySelector('h5:nth-child(3)');
                    if (activitiesTitle) activitiesTitle.textContent = t.experiences.project.activities;
                    
                    const activitiesList = projectDetails.querySelectorAll('ul li');
                    if (activitiesList.length >= 5 && t.experiences.talan.activities) {
                        activitiesList.forEach((item, index) => {
                            if (index < t.experiences.talan.activities.length) {
                                item.textContent = t.experiences.talan.activities[index];
                            }
                        });
                    }
                }
            }
        }
    }
    
    // 7. Section Education
    if (t.education) {
        updateSectionTitle('#formations', t.education.title);
        updateSectionSubtitle('#formations', t.education.subtitle);
        
        // Résumé
        const formationsSummary = document.querySelectorAll('.formations-summary .summary-label');
        if (formationsSummary.length >= 3 && t.education.summary) {
            formationsSummary[0].textContent = t.education.summary.formations;
            formationsSummary[1].textContent = t.education.summary.skills;
            formationsSummary[2].textContent = t.education.summary.institutions;
        }
        
        // Cartes de formation
        const formationCards = document.querySelectorAll('.formation-card');
        if (formationCards.length >= 3) {
            // M2i DevOps
            const skillsTitle1 = formationCards[0].querySelector('.formation-skills h4');
            if (skillsTitle1) skillsTitle1.textContent = t.education.skills;
            
            // M2i Programming
            const skillsTitle2 = formationCards[1].querySelector('.formation-skills h4');
            if (skillsTitle2) skillsTitle2.textContent = t.education.skills;
            
            // Sikkim
            const skillsTitle3 = formationCards[2].querySelector('.formation-skills h4');
            if (skillsTitle3) skillsTitle3.textContent = t.education.skills;
        }
    }
    
    // 8. Section Volunteering
    if (t.volunteering) {
        updateSectionTitle('#benevolat', t.volunteering.title);
        updateSectionSubtitle('#benevolat', t.volunteering.subtitle);
        
        // Cartes de bénévolat
        const benevolatCards = document.querySelectorAll('.benevolat-card');
        if (benevolatCards.length >= 4) {
            // Diaspora
            if (t.volunteering.diaspora) {
                benevolatCards[0].querySelector('h3').textContent = t.volunteering.diaspora.title;
                benevolatCards[0].querySelector('.benevolat-description').textContent = t.volunteering.diaspora.description;
            }
            
            // Community
            if (t.volunteering.community) {
                benevolatCards[1].querySelector('h3').textContent = t.volunteering.community.title;
                benevolatCards[1].querySelector('.benevolat-description').textContent = t.volunteering.community.description;
            }
            
            // French Teacher
            if (t.volunteering.frenchTeacher) {
                benevolatCards[2].querySelector('h3').textContent = t.volunteering.frenchTeacher.title;
                benevolatCards[2].querySelector('.benevolat-description').textContent = t.volunteering.frenchTeacher.description;
            }
            
            // FAFA
            if (t.volunteering.fafa) {
                benevolatCards[3].querySelector('h3').textContent = t.volunteering.fafa.title;
                benevolatCards[3].querySelector('.benevolat-description').textContent = t.volunteering.fafa.description;
            }
            
            // Labels de durée
            const durationLabels = document.querySelectorAll('.duration-label');
            durationLabels.forEach(label => {
                label.textContent = t.volunteering.duration + ' :';
            });
        }
    }
    
    // 9. Section Contact
    if (t.contact) {
        updateSectionTitle('#contact', t.contact.title);
        updateSectionSubtitle('#contact', t.contact.subtitle);
        
        // Formulaire
        const formLabels = document.querySelectorAll('.form-group label');
        if (formLabels.length >= 4 && t.contact.form) {
            formLabels[0].textContent = t.contact.form.name;
            formLabels[1].textContent = t.contact.form.firstName;
            formLabels[2].textContent = t.contact.form.email;
            formLabels[3].textContent = t.contact.form.message;
        }
        
        // Bouton d'envoi
        const submitButton = document.querySelector('#contact-form button[type="submit"]');
        if (submitButton && t.contact.form) {
            submitButton.textContent = t.contact.form.send;
        }
        
        // Informations de contact
        const contactItems = document.querySelectorAll('.contact-item span');
        if (contactItems.length >= 3 && t.contact) {
            // Email
            if (contactItems[0].querySelector('a')) {
                contactItems[0].querySelector('a').textContent = t.contact.email;
            }
            
            // Téléphone
            if (contactItems[1].querySelector('a')) {
                contactItems[1].querySelector('a').textContent = t.contact.phone;
            }
            
            // Localisation
            contactItems[2].textContent = t.contact.location;
        }
    }
    
    // 10. Footer
    if (t.footer) {
        // Description
        const footerDescription = document.querySelector('.footer-description');
        if (footerDescription) {
            footerDescription.textContent = t.footer.description;
        }
        
        // Titres
        const footerTitles = document.querySelectorAll('.footer-section h3');
        footerTitles.forEach((title, index) => {
            if (index === 0) title.textContent = t.footer.contact;
            else if (index === 1) title.textContent = t.footer.navigation;
            else if (index === 2) title.textContent = t.footer.professionalLinks;
        });
        
        // Navigation footer
        const footerNavLinks = document.querySelectorAll('.footer-nav-links a');
        if (footerNavLinks.length >= 7 && t.header && t.header.nav) {
            const footerNavOrder = ['home', 'about', 'skills', 'experiences', 'education', 'volunteering', 'contact'];
            
            footerNavLinks.forEach((link, index) => {
                if (index < footerNavOrder.length && t.header.nav[footerNavOrder[index]]) {
                    const icon = link.querySelector('i');
                    if (icon && icon.outerHTML) {
                        link.innerHTML = icon.outerHTML + ' ' + t.header.nav[footerNavOrder[index]];
                    }
                }
            });
        }
        
        // Boutons CV footer
        const footerButtons = document.querySelectorAll('.footer-btn');
        if (footerButtons.length >= 2 && t.footer) {
            footerButtons[0].innerHTML = '<i class="fas fa-download"></i> ' + (t.footer.cv1 || t.header.buttons.cv1);
            footerButtons[1].innerHTML = '<i class="fas fa-download"></i> ' + (t.footer.cv2 || t.header.buttons.cv2);
        }
        
        // Disponibilité
        const availableText = document.querySelector('.footer-contact p strong');
        if (availableText) {
            availableText.textContent = t.footer.available;
        }
        
        // Copyright
        const copyrightText = document.querySelector('.footer-bottom p:first-child');
        if (copyrightText) {
            copyrightText.textContent = t.footer.copyright;
        }
        
        // Développé avec
        const developedText = document.querySelector('.footer-bottom p:last-child');
        if (developedText) {
            developedText.textContent = t.footer.developed;
        }
    }
}

// Fonction utilitaire pour mettre à jour les titres de section
function updateSectionTitle(selector, title) {
    if (!title) return;
    
    const sectionTitle = document.querySelector(`${selector} .section-header h2`);
    if (sectionTitle) {
        sectionTitle.textContent = title;
    }
}

// Fonction utilitaire pour mettre à jour les sous-titres de section
function updateSectionSubtitle(selector, subtitle) {
    if (!subtitle) return;
    
    const sectionSubtitle = document.querySelector(`${selector} .section-header .subtitle`);
    if (sectionSubtitle) {
        sectionSubtitle.textContent = subtitle;
    }
}

// Fonction pour mettre à jour les listes de compétences
function updateSkillsList(categoryElement, skillsArray) {
    const skillsList = categoryElement.querySelectorAll('.skills-list li');
    skillsList.forEach((item, index) => {
        if (index < skillsArray.length) {
            const icon = item.querySelector('i');
            if (icon && icon.outerHTML) {
                item.innerHTML = icon.outerHTML + ' ' + skillsArray[index];
            } else {
                item.textContent = skillsArray[index];
            }
        }
    });
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initCVDownloadMenu() {
    const downloadLink = document.querySelector('.download-link');
    const dropmenu = document.querySelector('.dropmenu');
    
    if (!downloadLink || !dropmenu) return;
    
    dropmenu.style.display = 'none';
    
    downloadLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropmenu.style.display = dropmenu.style.display === 'block' ? 'none' : 'block';
    });
    
    document.addEventListener('click', function(e) {
        if (!downloadLink.contains(e.target) && !dropmenu.contains(e.target)) {
            dropmenu.style.display = 'none';
        }
    });
    
    dropmenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// ============================================
// DÉTECTION DE LA LANGUE DU NAVIGATEUR
// ============================================

function detectBrowserLanguage() {
    const browserLang = (navigator.language || navigator.userLanguage || 'fr').split('-')[0];
    
    // Si la langue est supportée et différente du français
    if (translations[browserLang] && browserLang !== 'fr') {
        const confirmChange = confirm(`Détecté: ${browserLang.toUpperCase()}. Voulez-vous changer la langue?`);
        if (confirmChange) {
            changeLanguage(browserLang);
        }
    }
}

// Appeler après le chargement
setTimeout(detectBrowserLanguage, 1000);