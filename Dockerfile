FROM navikt/node-express:16

RUN mkdir -p /var/src/app
WORKDIR /var/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ENV NODE_EXTRA_CA_CERTS /etc/ssl/ca-bundle.pem

COPY ./server/node_modules ./node_modules
COPY ./server/dist ./dist
COPY ./build ./build

EXPOSE 3000

ENTRYPOINT ["sh", "-c"]
CMD ["node dist/main.js"]
