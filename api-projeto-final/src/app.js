import cors from 'cors';
import express from 'express';
import routes from '../src/routes/index.js';
import { errorHandler } from './errors/errorHandler.js';

const app = express();
const API_PREFIX = process.env.API_PREFIX;

app.use(cors());
app.use(express.json());
app.use(API_PREFIX || '/api', routes);

app.get('/', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;