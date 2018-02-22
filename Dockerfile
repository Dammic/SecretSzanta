FROM node:latest

WORKDIR /secretSzanta

RUN node --version
RUN npm --version

# copy dependencies
COPY package*.json ./

RUN npm install

COPY . .

# exposing port inside of container to outside
EXPOSE 3000

RUN npm run build:prod

CMD [ "npm", "run", "run"]
