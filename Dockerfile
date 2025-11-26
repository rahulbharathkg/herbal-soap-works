FROM node:18-alpine
WORKDIR /usr/src/app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
