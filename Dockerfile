# Étape 1: Définir l'image de base
FROM node:20 as builder
RUN apt-get update && apt-get install -y libreoffice-common

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN yarn 

# Copier le reste des fichiers sources
COPY . .

# Compiler l'application TypeScript en JavaScript
RUN yarn build

# Étape 2: Préparer l'image de runtime
FROM node:20

WORKDIR /app

RUN mkdir -p /app/dist/secrets/
COPY ./data-extraction-zana.json /app/dist/secrets/service-account.json
COPY ./firebase-service-account.json /app/dist/secrets/firebase-account.json

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port sur lequel votre app sera accessible dans le conteneur
EXPOSE 8000

# Commande pour exécuter l'application
CMD ["node", "dist/index.js"]
