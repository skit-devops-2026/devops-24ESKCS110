# Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

COPY react-frontend/package*.json ./
RUN npm ci

COPY react-frontend/ ./

ARG VITE_API_URL=https://devvault-api-hsp3.onrender.com/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Serve the production build
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
