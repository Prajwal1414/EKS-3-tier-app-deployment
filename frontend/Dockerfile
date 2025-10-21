FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY .env.docker .env
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache gettext

# Set default value for VITE_API_PATH
ENV VITE_API_PATH=http://localhost:8080

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY assets/env.js.template /usr/share/nginx/html/assets/
COPY entrypoint.sh /entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
