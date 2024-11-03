FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo el contenido de book-app
COPY book-app/package*.json ./
RUN npm install

# Copia el resto de la aplicación
COPY book-app/ .

# Exponer el puerto de la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "server.js"

