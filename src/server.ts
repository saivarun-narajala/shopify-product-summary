import express from 'express';
import { PORT } from './env.js';
import api from './routes/products.js';

const app = express();

app.get('/health', (_req, res) => res.json({ ok: true }));

// mount our API routes
app.use('/', api);

// basic error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
