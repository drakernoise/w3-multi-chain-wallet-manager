FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --production

# Copy application source
COPY . .

# Environment variables with defaults
ENV PORT=3030
ENV DB_PATH=/app/data

# Create data directory for persistence
RUN mkdir -p /app/data

EXPOSE 3030

CMD ["node", "index.js"]
