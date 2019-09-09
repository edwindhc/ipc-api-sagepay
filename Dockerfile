FROM node:10.16.3

WORKDIR /app

COPY package*.json ./

RUN yarn --pure-lockfile

COPY . /app

CMD ["yarn", "docker:start"]