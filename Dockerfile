# Imagen base
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias primero
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

RUN npx prisma generate
RUN npm run build

# Aplicar migraciones y arrancar en modo producción
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
