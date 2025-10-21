import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import metricsMiddleware from './metricsMiddleware/metricsMiddleware.js'
import healthRouter from './routes/health.js'
const app = express();
const port = process.env.PORT || 8080;
const whitelist = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(metricsMiddleware);

// Connect to database
connectDB();

// API route
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);
app.use('/', healthRouter)

app.get('/', (req, res) => {
  res.send('Yay!! Backend of wanderlust app is now accessible ');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
