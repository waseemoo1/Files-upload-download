#################
## DEVELOPMENT ##
#################
FROM node:18.16.0-alpine3.17 AS development

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn*.lock ./

RUN yarn install

COPY --chown=node:node . .

USER node

###################
## BUILD FOR PRODUCTION ##
###################

FROM node:18.16.0-alpine3.17 As build

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN yarn install --production && yarn cache clean

USER node

################
## PRODUCTION ##
################
FROM node:18.16.0-alpine3.17 AS production

RUN yarn global add pm2

WORKDIR /app

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

EXPOSE 3000

CMD ["pm2-runtime", "./dist/main.js"]
# CMD [ "node", "dist/main.js" ]
