import { v1 } from './routes/v1.routes';
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Logestic } from 'logestic';
import { createErrorResponse, createSuccessResponse } from './helpers/response';
import { swagger } from '@elysiajs/swagger';

const api = new Elysia({ prefix: '/api' }).use(v1);

const PORT = Number.parseInt(process.env.PORT ?? '3000');

const app = new Elysia()
  .get('/', ({ set }) => {
    return createSuccessResponse(
      { message: 'Welcome to Kuudere API! 🎉', docs: 'You can see docs at /docs' },
      set
    );
  })
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Kuudere API Documentation',
          version: '1.0.0',
          description: 'An API to extract info, sources, episodes, search etc from kuudere.to',
        },
      },
      path: '/docs',
    })
  )
  .use(Logestic.preset('fancy'))
  .use(api)
  .all('*', ({ set }) => {
    return createErrorResponse(
      'Could not find the route you are looking for.',
      'NOT_FOUND',
      set,
      404
    );
  });

// Vercel imports the exported Elysia instance and manages its own listener.
// Opening a port during a serverless function cold start causes a 500 error.
if (import.meta.main && !process.env.VERCEL) {
  app.listen(PORT);
  console.log(`🦊 Elysia server started on ${PORT}`);
}

export default app;
