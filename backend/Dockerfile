FROM node:20-alpine

WORKDIR /app/backend

# Copia package.json e installa le dipendenze
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copia il codice del backend e i file statici del frontend
COPY backend/ ./
COPY frontend/ ../frontend/

EXPOSE 3000

CMD ["node", "index.js"]