FROM ghcr.io/navikt/baseimages/node-express:16

WORKDIR /var

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ENV NODE_EXTRA_CA_CERTS /etc/ssl/ca-bundle.pem

COPY ./server/node_modules ./node_modules
COPY ./server/dist ./dist
COPY ./dist ./build

EXPOSE 3000

ENTRYPOINT ["sh", "-c"]
CMD ["node dist/main.js"]
