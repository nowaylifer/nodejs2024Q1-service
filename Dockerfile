FROM node:20-alpine As dev-build
WORKDIR /app
COPY package*.json ./
RUN npm ci


FROM node:20-alpine As dev
WORKDIR /app
COPY package*.json ./
COPY --from=dev-build /app/node_modules ./node_modules
COPY . .
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]


FROM node:20-alpine As prod-build
WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force
USER node


FROM node:20-alpine As prod
COPY --chown=node:node --from=prod-build app/node_modules ./node_modules
COPY --chown=node:node --from=prod-build app/dist ./dist
CMD [ "node", "dist/main.js" ]