# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app

# Install git (required by build-indexes to clone pokemon-showdown and showdex)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy everything
COPY . .

# Create caches directory (build-indexes uses it as cwd for git clone; it's gitignored so won't exist)
RUN mkdir -p caches

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
