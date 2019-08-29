FROM node:latest
ADD . /code
WORKDIR /code
RUN yarn install
RUN yarn run test
RUN yarn run build:prod
EXPOSE 3000

CMD yarn run run

