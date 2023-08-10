import express, { Express } from 'express';
import config from 'config';
import routes from './routes'
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import logger from 'morgan';

const app: Express = express();
const port: number = config.get('port');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes)

const startServer = async () => {
  try {
    console.log('Connecting to Database...');
    await mongoose.connect(config.get('database.connection'));
    console.log('Database connected');

    console.log('Job started');
  } catch (error) {
    console.log('Database Connection Error', error);
    process.exit(1);
  }
};

startServer();

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
