# Stage 1: Build pokemon-showdown-client
FROM node:18 AS builder

WORKDIR /app

# Install git (required by build-indexes to clone pokemon-showdown)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy everything
COPY . .

# Create caches and data directories (both gitignored so won't exist on a clean clone)
RUN mkdir -p caches play.pokemonshowdown.com/data

# Pre-seed caches/pokemon-showdown so build-indexes can build it successfully:
#   - build-indexes skips cloning if the directory already exists
#   - config/config.js is required at runtime by build-indexes (exports.ttcseason)
#   - npm install is needed so `npm run build` (tsc) can succeed inside that directory
RUN git clone https://github.com/Trial-Of-Wintabura/pokemon-showdown.git caches/pokemon-showdown \
    && cp caches/pokemon-showdown/config/config-example.js caches/pokemon-showdown/config/config.js \
    && cd caches/pokemon-showdown && npm install

# Install dependencies and run full build
RUN npm install && npm run build-full

# Create a placeholder testclient-key.js (gitignored, loaded unconditionally by index.html with no error handler)
RUN echo "const POKEMON_SHOWDOWN_TESTCLIENT_KEY = 'sid';" > play.pokemonshowdown.com/config/testclient-key.js

# Resolve the config.js symlink into a real file so it survives the multi-stage copy.
# play.pokemonshowdown.com/config/config.js is a symlink -> ../../config/config.js (gitignored),
# which becomes a dangling symlink in the nginx stage if not resolved here.
RUN cp --dereference play.pokemonshowdown.com/config/config.js /tmp/psc-config.js \
    && mv /tmp/psc-config.js play.pokemonshowdown.com/config/config.js

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built client files to nginx web root
COPY --from=builder /app/play.pokemonshowdown.com /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
