# Stage 1: Build Showdex standalone
FROM node:18 AS showdex-builder

WORKDIR /showdex

# Install git and yarn
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/* \
    && npm install -g yarn

# Clone Showdex and install dependencies
RUN git clone https://github.com/TheTrainerCorner/showdex.git .
RUN yarn install --frozen-lockfile

# Build standalone bundle (skip bundle analysis to speed up build)
ENV PROD_ANALYZE_BUNDLES=false
RUN npm run build:standalone

# Stage 2: Build pokemon-showdown-client
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

# Copy Showdex standalone bundle into the client web root
COPY --from=showdex-builder /showdex/dist/standalone /app/play.pokemonshowdown.com/showdex

# Stage 3: Serve with nginx
FROM nginx:alpine

# Copy built client files (including showdex/) to nginx web root
COPY --from=builder /app/play.pokemonshowdown.com /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
