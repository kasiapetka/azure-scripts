FROM  node:14-alpine

WORKDIR /app

COPY countfilessizesdate.js .
COPY package.json .

RUN npm install

ENV D=1
ENV M=1
ENV Y=2022


ENTRYPOINT node countfilessizesdate.js -D $D -M $M -Y $Y 
