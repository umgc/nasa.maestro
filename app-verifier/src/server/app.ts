import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import ServerRoutes from './server-router.js';
import IOC from './ioc.js';
import path from 'path';

// TODO refactor to implement dependency injection
// https://blog.risingstack.com/dependency-injection-in-node-js/
const app = express();
IOC.initContainer();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload({ createParentPath: true }));
app.use(express.static(`${path.resolve('dist/public')}`));
app.use('/api', ServerRoutes.initRouter());
app.get('/ping', (res, resp) => {
  resp.send('pong');
});

// If we get an unknown route just send back the index page
app.use((request: Request, response: Response) => {
  response.sendFile(`${path.resolve('dist/public', 'index.html')}`);
});

const port = process.env.PORT || 3581;

// Starts the Api service
app.listen(port, () => {
  console.log(`HELLO WORLD...I AM ALIVE! and listening on port ${port}`);
});
