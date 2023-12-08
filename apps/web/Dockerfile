# BUILDER - Stage 1
FROM node:18-alpine
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat

COPY . .

RUN npm install -g npm@8.19.2
RUN npm install
RUN npm run build


EXPOSE 3002

CMD ["npm", "start"]
