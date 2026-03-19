# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies and run full build
RUN npm install && npm run build-full

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built client files to nginx web root
COPY --from=builder /app/play.pokemonshowdown.com /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
