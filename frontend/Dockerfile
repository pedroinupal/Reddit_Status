# Usa la imagen oficial de Node.js para crear el contenedor
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

RUN apk add --no-cache curl
# Instala las dependencias de la app
RUN npm install

# Copia el resto de la aplicación frontend
COPY . .

# Construye la aplicación React para producción
RUN npm run build

# Expone el puerto en el que se ejecutará el frontend
EXPOSE 3000

# Inicia el servidor de desarrollo
CMD ["npm", "start"]
