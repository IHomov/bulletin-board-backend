import express, { Application, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocument } from './openapi';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http'; 
import logger from './logger';
import authRoutes from './routes/auth.routes';
import announcementRoutes from './routes/announcements.routes';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if( !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

  })
);


app.use(pinoHttp({ logger }));
app.use(express.json());

const swaggerDocument = generateOpenApiDocument();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/auth', authRoutes);
app.use('/announcements', announcementRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running properly!' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Welcome to Bulletin Board API!');
});
export default app;