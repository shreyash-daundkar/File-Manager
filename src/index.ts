import express, { Express } from 'express';
import { PORT } from './utils/variables';
import indexRouter from './routes';
import errorMiddleware from './middlewares/error';


const app: Express = express();

app.use(express.json());

app.use('/', indexRouter);

app.use(errorMiddleware);


app.listen(PORT, () => console.log(`App running on port ${PORT}`));