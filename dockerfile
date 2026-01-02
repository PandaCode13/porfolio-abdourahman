# Utiliser une image légère avec Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Créer le répertoire pour les fichiers du portfolio
WORKDIR /usr/share/nginx/html

# Supprimer les fichiers par défaut de nginx
RUN rm -rf *

# Copier tous les fichiers du portfolio
COPY . .

# Configurer Nginx pour bien servir les fichiers
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    \
    # Page d\'accueil \
    index index.html; \
    \
    # Gestion des routes SPA (Single Page Application) \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
    \
    # Configuration pour les fichiers PDF \
    location ~* \.pdf$ { \
        add_header Content-Disposition "inline"; \
        add_header Content-Type "application/pdf"; \
    } \
    \
    # Configuration pour les fichiers JSON \
    location ~* \.json$ { \
        add_header Content-Type "application/json"; \
    } \
    \
    # Configuration pour JavaScript \
    location ~* \.js$ { \
        add_header Content-Type "application/javascript"; \
        expires 6h; \
        add_header Cache-Control "public, must-revalidate"; \
    } \
    \
    # Configuration pour les images \
    location ~* \.(png|jpg|jpeg|gif|ico)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Configuration pour les fichiers CSS \
    location ~* \.css$ { \
        expires 6h; \
        add_header Cache-Control "public, must-revalidate"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer nginx
CMD ["nginx", "-g", "daemon off;"]