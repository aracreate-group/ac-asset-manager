import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (_: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'OK', message: 'Gateway is healthy' });
});

// Proxy to Auth Service
//In your Express API gateway:
app.use('/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
    logLevel: 'debug',  // Enable verbose logging
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying:', req.originalUrl, '->', proxyReq.path);
    }
}));


// 404 Handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ status: 404, message: 'Not Found' });
});

// Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Gateway Error:', err);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
