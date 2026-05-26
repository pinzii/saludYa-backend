# Capa 1: Compilación de NestJS (TypeScript -> JavaScript)
FROM node:22-alpine AS build
WORKDIR /app

# Copiamos los archivos de dependencias de Node
COPY package*.json ./
RUN npm install

# Copiamos el resto del código del backend y compilamos
COPY . .
RUN npm run build

# Capa 2: Entorno de ejecución ligero para producción
FROM node:22-alpine
WORKDIR /app

# Copiamos solo lo necesario para que no pese el contenedor
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist

EXPOSE 8080

# Comando para encender el servidor de NestJS
CMD ["node", "dist/main"]