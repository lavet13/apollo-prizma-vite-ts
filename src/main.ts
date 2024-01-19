import 'dotenv/config';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import cors from 'cors';

import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './graphql/types';
import resolvers from './graphql/resolvers';

export interface ContextValue {
  token?: string | string[];
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function bootstrap() {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer<ContextValue>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  if (import.meta.env.PROD) {
    httpServer.listen(import.meta.env.VITE_PORT, () => {
      console.log(
        `🚀 Query endpoint ready at http://localhost:${
          import.meta.env.VITE_PORT
        }`
      );
    });
  }

  app.use(
    '/',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware<ContextValue>(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  return app;
}

const app = bootstrap();
export const viteNodeApp = app;
