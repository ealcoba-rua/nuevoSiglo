FROM node:13.8.0
WORKDIR /media/datos/api-nodejs/nuevoSiglo/nuevoSiglo
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run dev
EXPOSE 8085:80