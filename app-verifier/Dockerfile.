FROM umgccaps/nasa.maestro.verifier:latest

LABEL author="Johnny Lockhart"
LABEL version="1.0"

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm ci && mkdir dist/public

COPY . ./

RUN npm run ng build --prod --output-path=./dist/public

WORKDIR /usr/src/app/dist/public

CMD ["npm", "run-script", "start-docker-app-server"]
