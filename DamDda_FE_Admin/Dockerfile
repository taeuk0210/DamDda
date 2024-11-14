# https://velog.io/@usod_99/%EB%B0%B0%ED%8F%AC2
# 순서가 중요!

FROM node:lts-alpine as build  

WORKDIR /app  

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY /nginx/nginx.conf /etc/nginx/nginx.conf

COPY /nginx/default.conf /etc/nginx/conf.d/default.conf

COPY /nginx/default.conf /etc/nginx/sites-available

COPY /nginx/default.conf /etc/nginx/sites-enabled

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]