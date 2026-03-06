# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# copy dependency files first (better caching)
COPY package*.json ./

RUN npm ci

# copy source code
COPY . .

# build-time environment variable
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# build react app
RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine

# remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy build files
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]