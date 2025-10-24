# Utilisez une image Node.js officielle comme base
FROM node:22-alpine

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez le reste du code de l'application
COPY . .

# Exposez le port sur lequel votre application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]